import { Head } from '@inertiajs/react';

import { ReportChart } from '@/components/dashboard/report-chart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type WeeklyDaily = {
    date: string;
    transactions: number;
    revenue: number;
};

type ReportWeeklyProps = {
    report: {
        start_date: string;
        end_date: string;
        daily: WeeklyDaily[];
        total_revenue: number;
    };
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export default function ReportWeekly({ report }: ReportWeeklyProps) {
    return (
        <DashboardLayout>
            <Head title="Laporan Mingguan" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Laporan Mingguan</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Periode {report.start_date} sampai {report.end_date}.
                    </p>
                </header>

                <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Total Pendapatan Minggu Ini</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(report.total_revenue)}</p>
                </article>

                <ReportChart
                    title="Pendapatan Harian"
                    description="Perbandingan nominal pendapatan setiap hari dalam satu minggu."
                    points={report.daily.map((day) => ({
                        label: day.date,
                        value: day.revenue,
                        detail: `${day.transactions} transaksi`,
                    }))}
                    valueFormatter={formatCurrency}
                />

                <ReportChart
                    title="Jumlah Transaksi Harian"
                    points={report.daily.map((day) => ({
                        label: day.date,
                        value: day.transactions,
                    }))}
                />
            </section>
        </DashboardLayout>
    );
}
