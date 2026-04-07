<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ReportService
{
    public function dailySales(string $date): array
    {
        $start = Carbon::parse($date)->startOfDay();
        $end = Carbon::parse($date)->endOfDay();

        $orders = $this->paidOrdersBetween($start, $end)->get();

        return [
            'date' => $start->toDateString(),
            'orders' => $orders,
            'transaction_count' => $orders->count(),
            'total_revenue' => (int) $orders->sum('total'),
        ];
    }

    public function weeklySales(string $startDate): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = $start->copy()->addDays(6)->endOfDay();

        $daily = $this->paidOrdersBetween($start, $end)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as transactions, SUM(total) as revenue')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->map(fn (Order $aggregate): array => [
                'date' => (string) $aggregate->getAttribute('date'),
                'transactions' => (int) $aggregate->getAttribute('transactions'),
                'revenue' => (int) $aggregate->getAttribute('revenue'),
            ]);

        return [
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'daily' => $daily,
            'total_revenue' => (int) $daily->sum('revenue'),
        ];
    }

    public function monthlySales(int $year, int $month): array
    {
        $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $end = $start->copy()->endOfMonth()->endOfDay();

        $daily = $this->paidOrdersBetween($start, $end)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as transactions, SUM(total) as revenue')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->map(fn (Order $aggregate): array => [
                'date' => (string) $aggregate->getAttribute('date'),
                'transactions' => (int) $aggregate->getAttribute('transactions'),
                'revenue' => (int) $aggregate->getAttribute('revenue'),
            ]);

        return [
            'year' => $year,
            'month' => $month,
            'daily' => $daily,
            'total_revenue' => (int) $daily->sum('revenue'),
        ];
    }

    /**
     * @return Collection<int, array{name:string,qty:int,revenue:int}>
     */
    public function topItems(string $startDate, string $endDate, int $limit = 10): Collection
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        return OrderItem::query()
            ->selectRaw('menu_item_name as name, SUM(quantity) as qty, SUM(subtotal) as revenue')
            ->whereHas('order', function (Builder $query) use ($start, $end): void {
                $query->where('payment_status', PaymentStatus::SudahBayar)
                    ->whereBetween('created_at', [$start, $end]);
            })
            ->groupBy('menu_item_name')
            ->orderByDesc('qty')
            ->limit($limit)
            ->get()
            ->map(fn (OrderItem $aggregate): array => [
                'name' => (string) $aggregate->getAttribute('name'),
                'qty' => (int) $aggregate->getAttribute('qty'),
                'revenue' => (int) $aggregate->getAttribute('revenue'),
            ]);
    }

    public function revenue(string $startDate, string $endDate): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        $query = $this->paidOrdersBetween($start, $end);

        return [
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'total_revenue' => (int) $query->sum('total'),
            'cash_revenue' => (int) (clone $query)->where('payment_method', PaymentMethod::Cash)->sum('total'),
            'qris_revenue' => (int) (clone $query)->where('payment_method', PaymentMethod::Qris)->sum('total'),
        ];
    }

    public function paidOrdersBetween(CarbonInterface $start, CarbonInterface $end): Builder
    {
        return Order::query()
            ->where('payment_status', PaymentStatus::SudahBayar)
            ->whereBetween('created_at', [$start, $end]);
    }
}
