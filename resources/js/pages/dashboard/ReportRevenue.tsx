import { Head } from '@inertiajs/react';

import { ReportChart } from '@/components/dashboard/report-chart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type ReportRevenueProps = {
    report: {
        start_date: string;
        end_date: string;
        total_revenue: number;
        cash_revenue: number;
        qris_revenue: number;
    };
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export default function ReportRevenue({ report }: ReportRevenueProps) {
    return (
        <DashboardLayout>
            <Head title="Laporan Pendapatan" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Pendapatan</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Rincian pendapatan periode {report.start_date} sampai {report.end_date}.
                    </p>
                </header>

                <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Total Pendapatan</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(report.total_revenue)}</p>
                </article>

                <ReportChart
                    title="Perbandingan Metode Pembayaran"
                    points={[
                        { label: 'Cash', value: report.cash_revenue },
                        { label: 'QRIS', value: report.qris_revenue },
                    ]}
                    valueFormatter={formatCurrency}
                />
            </section>
        </DashboardLayout>
    );
}
