<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService) {}

    public function daily(Request $request): Response
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date'],
        ]);

        $date = (string) ($validated['date'] ?? now()->toDateString());

        return Inertia::render('dashboard/ReportDaily', [
            'report' => $this->reportService->dailySales($date),
        ]);
    }

    public function weekly(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
        ]);

        $startDate = (string) ($validated['start_date'] ?? now()->startOfWeek()->toDateString());

        return Inertia::render('dashboard/ReportWeekly', [
            'report' => $this->reportService->weeklySales($startDate),
        ]);
    }

    public function monthly(Request $request): Response
    {
        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'month' => ['nullable', 'integer', 'between:1,12'],
        ]);

        $year = (int) ($validated['year'] ?? now()->year);
        $month = (int) ($validated['month'] ?? now()->month);

        return Inertia::render('dashboard/ReportMonthly', [
            'report' => $this->reportService->monthlySales($year, $month),
        ]);
    }

    public function topItems(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $startDate = (string) ($validated['start_date'] ?? now()->startOfMonth()->toDateString());
        $endDate = (string) ($validated['end_date'] ?? now()->endOfMonth()->toDateString());
        $limit = (int) ($validated['limit'] ?? 10);

        $items = $this->reportService->topItems($startDate, $endDate, $limit)->values();

        return Inertia::render('dashboard/ReportTopItems', [
            'report' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'limit' => $limit,
                'items' => $items,
                'total_qty' => (int) $items->sum('qty'),
                'total_revenue' => (int) $items->sum('revenue'),
            ],
        ]);
    }

    public function revenue(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $startDate = (string) ($validated['start_date'] ?? now()->startOfMonth()->toDateString());
        $endDate = (string) ($validated['end_date'] ?? now()->endOfMonth()->toDateString());

        return Inertia::render('dashboard/ReportRevenue', [
            'report' => $this->reportService->revenue($startDate, $endDate),
        ]);
    }
}
