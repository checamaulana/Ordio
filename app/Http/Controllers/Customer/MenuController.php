<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(int $table): Response|RedirectResponse
    {
        $tableModel = Table::query()->where('number', $table)->first();

        if (! $tableModel) {
            return Inertia::render('customer/Error', [
                'tableNumber' => $table,
                'message' => 'Meja tidak ditemukan atau sudah tidak tersedia.',
            ]);
        }

        if ($tableModel->hasUnpaidOrder()) {
            return redirect()->route('customer.unpaid', ['table' => $tableModel->number]);
        }

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

        return Inertia::render('customer/Menu', [
            'tableNumber' => $tableModel->number,
            'categories' => $categories,
            'menuItems' => $menuItems->map(fn (MenuItem $item) => [
                ...$item->toArray(),
                'image_path' => $item->image_path ? Storage::disk('public')->url($item->image_path) : null,
            ]),
        ]);
    }

    public function checkout(int $table): Response|RedirectResponse
    {
        $tableModel = Table::query()->where('number', $table)->first();

        if (! $tableModel) {
            return Inertia::render('customer/Error', [
                'tableNumber' => $table,
                'message' => 'Meja tidak ditemukan atau sudah tidak tersedia.',
            ]);
        }

        if ($tableModel->hasUnpaidOrder()) {
            return redirect()->route('customer.unpaid', ['table' => $tableModel->number]);
        }

        return Inertia::render('customer/Checkout', [
            'tableNumber' => $tableModel->number,
        ]);
    }

    public function unpaid(int $table): Response
    {
        $tableModel = Table::query()->where('number', $table)->first();

        if (! $tableModel) {
            return Inertia::render('customer/Error', [
                'tableNumber' => $table,
                'message' => 'Meja tidak ditemukan atau sudah tidak tersedia.',
            ]);
        }

        $unpaidOrder = Order::query()
            ->where('table_id', $tableModel->id)
            ->where('status', OrderStatus::Diproses)
            ->where('payment_status', '!=', PaymentStatus::SudahBayar)
            ->latest('id')
            ->first();

        return Inertia::render('customer/Unpaid', [
            'tableNumber' => $tableModel->number,
            'unpaidOrder' => $unpaidOrder ? [
                'order_number' => $unpaidOrder->order_number,
                'payment_method' => $unpaidOrder->payment_method->value,
                'payment_status' => $unpaidOrder->payment_status->value,
                'total' => $unpaidOrder->total,
            ] : null,
        ]);
    }

    public function error(int $table): Response
    {
        return Inertia::render('customer/Error', [
            'tableNumber' => $table,
            'message' => 'Meja tidak ditemukan atau sudah tidak tersedia.',
        ]);
    }
}
