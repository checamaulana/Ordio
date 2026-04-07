<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\ProcessPaymentRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function processCash(ProcessPaymentRequest $request, Order $order): RedirectResponse|JsonResponse
    {
        if ($order->payment_method !== PaymentMethod::Cash) {
            return $this->paymentErrorResponse($request, 'Pesanan ini bukan metode pembayaran cash.');
        }

        if ($order->payment_status !== PaymentStatus::BelumBayar) {
            return $this->paymentErrorResponse($request, 'Pesanan ini sudah diproses pembayarannya.');
        }

        $cashReceived = $request->integer('cash_received');

        if ($cashReceived < $order->total) {
            return $this->paymentErrorResponse($request, 'Nominal uang kurang dari total pembayaran.');
        }

        $order->update([
            'payment_status' => PaymentStatus::SudahBayar,
            'cash_received' => $cashReceived,
            'cash_change' => $cashReceived - $order->total,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Pembayaran cash berhasil dikonfirmasi.',
                'cash_received' => $order->cash_received,
                'cash_change' => $order->cash_change,
                'payment_status' => $order->payment_status->value,
            ]);
        }

        return redirect()->back();
    }

    public function confirmQris(Request $request, Order $order): RedirectResponse|JsonResponse
    {
        if ($order->payment_method !== PaymentMethod::Qris) {
            return $this->paymentErrorResponse($request, 'Pesanan ini bukan metode pembayaran QRIS.');
        }

        if ($order->payment_status !== PaymentStatus::MenungguKonfirmasi) {
            return $this->paymentErrorResponse($request, 'Status QRIS pesanan ini belum menunggu konfirmasi.');
        }

        $order->update([
            'payment_status' => PaymentStatus::SudahBayar,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Pembayaran QRIS berhasil dikonfirmasi.',
                'payment_status' => $order->payment_status->value,
            ]);
        }

        return redirect()->back();
    }

    private function paymentErrorResponse(Request $request, string $message): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
            ], 422);
        }

        return redirect()->back()->withErrors([
            'payment' => $message,
        ]);
    }
}
