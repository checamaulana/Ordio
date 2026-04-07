<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use InvalidArgumentException;

class PaymentService
{
    public function calculateCashChange(int $total, int $cashReceived): int
    {
        if ($cashReceived < $total) {
            throw new InvalidArgumentException('Jumlah uang tidak mencukupi total pembayaran.');
        }

        return $cashReceived - $total;
    }

    public function markCashPaid(Order $order, int $cashReceived): Order
    {
        $change = $this->calculateCashChange($order->total, $cashReceived);

        $order->forceFill([
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::SudahBayar,
            'cash_received' => $cashReceived,
            'cash_change' => $change,
        ])->save();

        return $order;
    }

    public function markQrisAwaitingConfirmation(Order $order): Order
    {
        $order->forceFill([
            'payment_method' => PaymentMethod::Qris,
            'payment_status' => PaymentStatus::MenungguKonfirmasi,
        ])->save();

        return $order;
    }

    public function markQrisPaid(Order $order): Order
    {
        $order->forceFill([
            'payment_method' => PaymentMethod::Qris,
            'payment_status' => PaymentStatus::SudahBayar,
        ])->save();

        return $order;
    }
}
