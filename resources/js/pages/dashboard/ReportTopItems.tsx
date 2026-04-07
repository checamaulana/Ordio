import { Head } from '@inertiajs/react';

import { ReportChart } from '@/components/dashboard/report-chart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type TopItem = {
    name: string;
    qty: number;
    revenue: number;
};

type ReportTopItemsProps = {
    report: {
        start_date: string;
        end_date: string;
        limit: number;
        items: TopItem[];
        total_qty: number;
        total_revenue: number;
    };
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export default function ReportTopItems({ report }: ReportTopItemsProps) {
    return (
        <DashboardLayout>
            <Head title="Laporan Item Terlaris" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Item Terlaris</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Periode {report.start_date} sampai {report.end_date}, maksimal {report.limit} item.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Total Kuantitas Terjual</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{report.total_qty.toLocaleString('id-ID')}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Total Pendapatan Item Terlaris</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(report.total_revenue)}</p>
                    </article>
                </div>

                <ReportChart
                    title="Peringkat Berdasarkan Jumlah Terjual"
                    points={report.items.map((item) => ({
                        label: item.name,
                        value: item.qty,
                        detail: `Kontribusi pendapatan ${formatCurrency(item.revenue)}`,
                    }))}
                />

                <ReportChart
                    title="Peringkat Berdasarkan Pendapatan"
                    points={report.items.map((item) => ({
                        label: item.name,
                        value: item.revenue,
                        detail: `Jumlah terjual ${item.qty.toLocaleString('id-ID')} porsi`,
                    }))}
                    valueFormatter={formatCurrency}
                />
            </section>
        </DashboardLayout>
    );
}
