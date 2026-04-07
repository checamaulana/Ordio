import { Head } from '@inertiajs/react';

import { ReportChart } from '@/components/dashboard/report-chart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type DailyOrder = {
    id: number;
    order_number: string;
    total: number;
    payment_method: string;
};

type ReportDailyProps = {
    report: {
        date: string;
        orders: DailyOrder[];
        transaction_count: number;
        total_revenue: number;
    };
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export default function ReportDaily({ report }: ReportDailyProps) {
    return (
        <DashboardLayout>
            <Head title="Laporan Harian" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Laporan Harian</h1>
                    <p className="mt-1 text-sm text-slate-600">Ringkasan transaksi untuk tanggal {report.date}.</p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Jumlah Transaksi</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{report.transaction_count}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Total Pendapatan</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(report.total_revenue)}</p>
                    </article>
                </div>

                <ReportChart
                    title="Pendapatan per Pesanan"
                    description="Visual sederhana total nominal tiap pesanan terbayar."
                    points={report.orders.map((order) => ({
                        label: order.order_number,
                        value: order.total,
                        detail: `Metode pembayaran: ${order.payment_method}`,
                    }))}
                    valueFormatter={formatCurrency}
                />
            </section>
        </DashboardLayout>
    );
}
