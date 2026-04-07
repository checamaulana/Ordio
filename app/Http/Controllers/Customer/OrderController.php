<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\TableStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreOrderRequest;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function store(StoreOrderRequest $request, int $table): RedirectResponse
    {
        $tableModel = Table::query()->where('number', $table)->first();

        if (! $tableModel) {
            return redirect()->route('customer.error', ['table' => $table]);
        }

        if ($tableModel->hasUnpaidOrder()) {
            return redirect()->route('customer.unpaid', ['table' => $tableModel->number]);
        }

        $data = $request->validated();

        $menuItems = MenuItem::query()
            ->with('variantGroups.variantOptions')
            ->whereIn('id', collect($data['items'])->pluck('menu_item_id')->all())
            ->get()
            ->keyBy('id');

        $paymentMethod = PaymentMethod::from($data['payment_method']);

        $order = DB::transaction(function () use ($data, $menuItems, $paymentMethod, $tableModel): Order {
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
                'order_type' => OrderType::DineIn,
                'table_id' => $tableModel->id,
                'status' => OrderStatus::Diproses,
                'payment_status' => PaymentStatus::BelumBayar,
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

            $tableModel->update([
                'status' => TableStatus::Terisi,
            ]);

            return $order;
        });

        if ($paymentMethod === PaymentMethod::Qris) {
            return redirect()->route('customer.payment', [
                'table' => $tableModel->number,
                'order' => $order->order_number,
            ]);
        }

        return redirect()->route('customer.success', [
            'table' => $tableModel->number,
            'order' => $order->order_number,
        ]);
    }

    public function payment(int $table, Order $order): Response|RedirectResponse
    {
        if (! $this->isOrderFromTable($order, $table)) {
            return redirect()->route('customer.error', ['table' => $table]);
        }

        return Inertia::render('customer/Payment', [
            'tableNumber' => $table,
            'order' => [
                'order_number' => $order->order_number,
                'payment_status' => $order->payment_status->value,
                'total' => $order->total,
            ],
            'qrisImageUrl' => asset('images/qris.png'),
        ]);
    }

    public function markQrisPaid(int $table, Order $order): RedirectResponse
    {
        if (! $this->isOrderFromTable($order, $table)) {
            return redirect()->route('customer.error', ['table' => $table]);
        }

        if ($order->payment_method === PaymentMethod::Qris && $order->payment_status !== PaymentStatus::SudahBayar) {
            $order->update([
                'payment_status' => PaymentStatus::MenungguKonfirmasi,
            ]);
        }

        return redirect()->route('customer.payment', [
            'table' => $table,
            'order' => $order->order_number,
        ]);
    }

    public function success(int $table, Order $order): Response|RedirectResponse
    {
        if (! $this->isOrderFromTable($order, $table)) {
            return redirect()->route('customer.error', ['table' => $table]);
        }

        return Inertia::render('customer/Success', [
            'tableNumber' => $table,
            'orderNumber' => $order->order_number,
            'paymentMethod' => $order->payment_method->value,
            'total' => $order->total,
        ]);
    }

    private function isOrderFromTable(Order $order, int $tableNumber): bool
    {
        return $order->table?->number === $tableNumber;
    }
}
