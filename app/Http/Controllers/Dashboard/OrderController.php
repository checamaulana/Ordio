<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\TableStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreOrderRequest;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(Request $request): Response|JsonResponse
    {
        $orders = Order::query()
            ->with(['table:id,number', 'items.variants'])
            ->where('status', OrderStatus::Diproses)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Order $order): array => $this->transformOrder($order))
            ->values();

        if ($request->wantsJson()) {
            return response()->json([
                'orders' => $orders,
                'server_time' => now()->toIso8601String(),
            ]);
        }

        return Inertia::render('dashboard/Orders', [
            'orders' => $orders,
            'pollingIntervalMs' => 10_000,
        ]);
    }

    public function takeawayCreate(): Response
    {
        $categories = Category::query()
            ->with(['subCategories' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        $menuItems = MenuItem::query()
            ->with([
                'category:id,name',
                'subCategory:id,name',
                'variantGroups.variantOptions',
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('dashboard/TakeawayCreate', [
            'categories' => $categories,
            'menuItems' => $menuItems->map(fn (MenuItem $item) => [
                ...$item->toArray(),
                'image_path' => $item->image_path ? Storage::disk('public')->url($item->image_path) : null,
            ]),
        ]);
    }

    public function storeTakeaway(StoreOrderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $paymentMethod = PaymentMethod::from($data['payment_method']);
        $paymentStatus = $paymentMethod === PaymentMethod::Cash
            ? PaymentStatus::BelumBayar
            : PaymentStatus::MenungguKonfirmasi;

        $menuItems = MenuItem::query()
            ->with('variantGroups.variantOptions')
            ->whereIn('id', collect($data['items'])->pluck('menu_item_id')->all())
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($data, $menuItems, $paymentMethod, $paymentStatus): void {
            $itemTotals = [];
            $orderLines = [];

            foreach ($data['items'] as $payload) {
                /** @var MenuItem|null $menuItem */
                $menuItem = $menuItems->get($payload['menu_item_id']);

                if (! $menuItem || ! $menuItem->is_available) {
                    throw ValidationException::withMessages([
                        'items' => ['Salah satu menu tidak tersedia.'],
                    ]);
                }

                $optionMap = $menuItem->variantGroups
                    ->flatMap(fn ($group) => $group->variantOptions)
                    ->keyBy('id');

                $selectedOptions = collect($payload['variant_option_ids'] ?? [])
                    ->map(fn ($id) => $optionMap->get($id))
                    ->filter();

                $variantTotal = (int) $selectedOptions->sum('additional_price');
                $quantity = (int) $payload['quantity'];
                $baseTotal = $this->orderService->calculateItemBaseTotal($menuItem->price, $quantity, $variantTotal);
                $discount = $this->orderService->calculateItemDiscount(
                    $baseTotal,
                    $menuItem->has_discount,
                    $menuItem->discount_type,
                    $menuItem->discount_value,
                );

                $itemTotals[] = [
                    'base_total' => $baseTotal,
                    'discount' => $discount,
                ];

                $orderLines[] = [
                    'menu_item' => $menuItem,
                    'quantity' => $quantity,
                    'note' => Arr::get($payload, 'note'),
                    'unit_price' => $menuItem->price + $variantTotal,
                    'discount_amount' => $discount,
                    'subtotal' => max(0, $baseTotal - $discount),
                    'variants' => $selectedOptions,
                ];
            }

            $totals = $this->orderService->calculateOrderTotals($itemTotals);

            $order = Order::query()->create([
                'order_number' => $this->orderService->generateOrderNumber(),
                'order_type' => OrderType::Takeaway,
                'table_id' => null,
                'status' => OrderStatus::Diproses,
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                ...$totals,
            ]);

            foreach ($orderLines as $line) {
                $orderItem = $order->items()->create([
                    'menu_item_id' => $line['menu_item']->id,
                    'menu_item_name' => $line['menu_item']->name,
                    'quantity' => $line['quantity'],
                    'unit_price' => $line['unit_price'],
                    'discount_amount' => $line['discount_amount'],
                    'subtotal' => $line['subtotal'],
                    'note' => $line['note'],
                ]);

                foreach ($line['variants'] as $variant) {
                    $orderItem->variants()->create([
                        'variant_group_name' => $variant->variantGroup->name,
                        'variant_option_name' => $variant->name,
                        'additional_price' => $variant->additional_price,
                    ]);
                }
            }
        });

        return redirect()->route('dashboard.orders.index')->with('success', 'Pesanan takeaway berhasil dibuat.');
    }

    public function complete(Request $request, Order $order): RedirectResponse|JsonResponse
    {
        if ($order->status !== OrderStatus::Diproses) {
            return $this->orderErrorResponse($request, 'Pesanan ini tidak berada di status diproses.');
        }

        if ($order->payment_status !== PaymentStatus::SudahBayar) {
            return $this->orderErrorResponse($request, 'Pesanan belum dibayar, tidak bisa diselesaikan.');
        }

        $order->update([
            'status' => OrderStatus::Selesai,
        ]);

        if ($order->table_id !== null) {
            $this->setTableKosongIfNoActiveOrders((int) $order->table_id);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Status pesanan berhasil diubah ke selesai.',
                'order' => $this->transformOrder($order->fresh(['table:id,number', 'items.variants'])),
            ]);
        }

        return redirect()->back();
    }

    public function destroy(Request $request, Order $order): RedirectResponse|JsonResponse
    {
        $tableId = $order->table_id !== null ? (int) $order->table_id : null;
        $order->delete();

        if ($tableId !== null) {
            $this->setTableKosongIfNoActiveOrders($tableId);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Pesanan berhasil dihapus.',
            ]);
        }

        return redirect()->back()->with('success', 'Pesanan berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_type' => $order->order_type->value,
            'table_number' => $order->table?->number,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'payment_method' => $order->payment_method->value,
            'subtotal' => $order->subtotal,
            'discount_total' => $order->discount_total,
            'tax_amount' => $order->tax_amount,
            'total' => $order->total,
            'cash_received' => $order->cash_received,
            'cash_change' => $order->cash_change,
            'created_at' => $order->created_at?->toIso8601String(),
            'items' => $order->items->map(static fn ($item): array => [
                'id' => $item->id,
                'menu_item_name' => $item->menu_item_name,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'discount_amount' => $item->discount_amount,
                'subtotal' => $item->subtotal,
                'note' => $item->note,
                'variants' => $item->variants->map(static fn ($variant): array => [
                    'id' => $variant->id,
                    'variant_group_name' => $variant->variant_group_name,
                    'variant_option_name' => $variant->variant_option_name,
                    'additional_price' => $variant->additional_price,
                ])->values(),
            ])->values(),
        ];
    }

    private function orderErrorResponse(Request $request, string $message): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
            ], 422);
        }

        return redirect()->back()->withErrors([
            'order' => $message,
        ]);
    }

    private function setTableKosongIfNoActiveOrders(int $tableId): void
    {
        $table = Table::query()->find($tableId);

        if (! $table) {
            return;
        }

        $hasActiveOrder = Order::query()
            ->where('table_id', $tableId)
            ->where('status', OrderStatus::Diproses)
            ->exists();

        if (! $hasActiveOrder && $table->status !== TableStatus::Kosong) {
            $table->update([
                'status' => TableStatus::Kosong,
            ]);
        }
    }
}
