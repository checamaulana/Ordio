import { Head } from '@inertiajs/react';

import { ReportChart } from '@/components/dashboard/report-chart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type MonthlyDaily = {
    date: string;
    transactions: number;
    revenue: number;
};

type ReportMonthlyProps = {
    report: {
        year: number;
        month: number;
        daily: MonthlyDaily[];
        total_revenue: number;
    };
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export default function ReportMonthly({ report }: ReportMonthlyProps) {
    return (
        <DashboardLayout>
            <Head title="Laporan Bulanan" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Laporan Bulanan</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Ringkasan bulan {report.month} tahun {report.year}.
                    </p>
                </header>

                <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Total Pendapatan Bulan Ini</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(report.total_revenue)}</p>
                </article>

                <ReportChart
                    title="Pendapatan per Hari"
                    description="Total pendapatan harian selama bulan berjalan."
                    points={report.daily.map((day) => ({
                        label: day.date,
                        value: day.revenue,
                        detail: `${day.transactions} transaksi`,
                    }))}
                    valueFormatter={formatCurrency}
                />
            </section>
        </DashboardLayout>
    );
}
