<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Customer\MenuController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\MenuItemController;
use App\Http\Controllers\Dashboard\OrderController as DashboardOrderController;
use App\Http\Controllers\Dashboard\PaymentController;
use App\Http\Controllers\Dashboard\ReportController;
use App\Http\Controllers\Dashboard\SubCategoryController;
use App\Http\Controllers\Dashboard\TableController;
use App\Http\Controllers\Dashboard\VariantGroupController;
use App\Http\Controllers\Dashboard\VariantOptionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard.index')
        : redirect()->route('login');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');

        Route::prefix('pesanan')->name('orders.')->group(function () {
            Route::get('/', [DashboardOrderController::class, 'index'])->name('index');
            Route::get('/takeaway', [DashboardOrderController::class, 'takeawayCreate'])->name('takeaway.create');
            Route::post('/takeaway', [DashboardOrderController::class, 'storeTakeaway'])->name('takeaway.store');
            Route::patch('/{order}/selesai', [DashboardOrderController::class, 'complete'])->name('complete');
            Route::delete('/{order}', [DashboardOrderController::class, 'destroy'])->name('destroy');
            Route::patch('/{order}/pembayaran/cash', [PaymentController::class, 'processCash'])->name('payment.cash');
            Route::patch('/{order}/pembayaran/qris/konfirmasi', [PaymentController::class, 'confirmQris'])->name('payment.qris.confirm');
        });

        Route::resource('menu-items', MenuItemController::class)->except(['create', 'edit', 'show']);
        Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
        Route::resource('sub-categories', SubCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('variant-groups', VariantGroupController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('variant-options', VariantOptionController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::prefix('tables')->name('tables.')->group(function () {
            Route::get('/', [TableController::class, 'index'])->name('index');
            Route::post('/', [TableController::class, 'store'])->name('store');
            Route::delete('/{table}', [TableController::class, 'destroy'])->name('destroy');
            Route::patch('/{table}/reset-status', [TableController::class, 'resetStatus'])->name('reset-status');
            Route::get('/{table}/qr', [TableController::class, 'showQr'])->name('show-qr');
            Route::get('/{table}/qr/download', [TableController::class, 'downloadQr'])->name('download-qr');
        });

        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/daily', [ReportController::class, 'daily'])->name('daily');
            Route::get('/weekly', [ReportController::class, 'weekly'])->name('weekly');
            Route::get('/monthly', [ReportController::class, 'monthly'])->name('monthly');
            Route::get('/top-items', [ReportController::class, 'topItems'])->name('top-items');
            Route::get('/revenue', [ReportController::class, 'revenue'])->name('revenue');
        });
    });
});

Route::prefix('meja/{table}')->whereNumber('table')->name('customer.')->group(function () {
    Route::get('/menu', [MenuController::class, 'index'])->name('menu');
    Route::get('/checkout', [MenuController::class, 'checkout'])->name('checkout');
    Route::post('/pesanan', [CustomerOrderController::class, 'store'])->name('order.store');
    Route::get('/pembayaran/{order:order_number}', [CustomerOrderController::class, 'payment'])->name('payment');
    Route::post('/pembayaran/{order:order_number}/sudah-bayar', [CustomerOrderController::class, 'markQrisPaid'])->name('payment.mark-paid');
    Route::get('/sukses/{order:order_number}', [CustomerOrderController::class, 'success'])->name('success');
    Route::get('/belum-bayar', [MenuController::class, 'unpaid'])->name('unpaid');
    Route::get('/error', [MenuController::class, 'error'])->name('error');
});
