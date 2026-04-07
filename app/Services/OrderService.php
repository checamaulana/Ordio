<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Models\Order;
use Carbon\Carbon;

class OrderService
{
    public const TAX_RATE = 0.11;

    public function calculateItemBaseTotal(int $unitPrice, int $quantity, int $variantTotal = 0): int
    {
        return max(0, ($unitPrice + $variantTotal) * $quantity);
    }

    public function calculateItemDiscount(
        int $baseTotal,
        bool $hasDiscount,
        ?DiscountType $discountType,
        ?int $discountValue,
    ): int {
        if (! $hasDiscount || ! $discountType || ! $discountValue) {
            return 0;
        }

        if ($discountType === DiscountType::Percentage) {
            return min($baseTotal, (int) round($baseTotal * $discountValue / 100));
        }

        return min($baseTotal, $discountValue);
    }

    /**
     * @param  list<array{base_total:int,discount:int}>  $itemTotals
     * @return array{subtotal:int,discount_total:int,tax_amount:int,total:int}
     */
    public function calculateOrderTotals(array $itemTotals): array
    {
        $baseTotal = array_sum(array_column($itemTotals, 'base_total'));
        $discountTotal = array_sum(array_column($itemTotals, 'discount'));
        $subtotal = max(0, $baseTotal - $discountTotal);
        $taxAmount = (int) round($subtotal * self::TAX_RATE);

        return [
            'subtotal' => $subtotal,
            'discount_total' => $discountTotal,
            'tax_amount' => $taxAmount,
            'total' => $subtotal + $taxAmount,
        ];
    }

    public function generateOrderNumber(): string
    {
        $today = Carbon::today();
        $prefix = sprintf('KT-%s-', $today->format('Ymd'));

        $latest = Order::query()
            ->where('order_number', 'like', $prefix.'%')
            ->latest('id')
            ->value('order_number');

        $sequence = $latest ? ((int) substr($latest, -4)) + 1 : 1;

        return sprintf('%s%04d', $prefix, $sequence);
    }
}
