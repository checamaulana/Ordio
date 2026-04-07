import { Head, router, useForm } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

import { QrCodeModal } from '@/components/dashboard/qr-code-modal';
import { TableForm } from '@/components/dashboard/table-form';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type TableItem = {
    id: number;
    number: number;
    status: 'kosong' | 'terisi';
    can_delete: boolean;
    qr_code_url: string;
};

type TablesProps = {
    tables: TableItem[];
};

type QrData = {
    tableNumber: number | null;
    qrCodeUrl: string;
    downloadUrl: string;
};

export default function Tables({ tables }: TablesProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loadingQrTableId, setLoadingQrTableId] = useState<number | null>(null);
    const [qrData, setQrData] = useState<QrData>({
        tableNumber: null,
        qrCodeUrl: '',
        downloadUrl: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        number: '',
    });

    const handleSubmitTable = () => {
        post('/dashboard/tables', {
            onSuccess: () => {
                reset();
                setIsFormOpen(false);
            },
        });
    };

    const handleOpenQr = async (tableId: number) => {
        setLoadingQrTableId(tableId);

        try {
            const response = await fetch(`/dashboard/tables/${tableId}/qr`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                return;
            }

            const payload = (await response.json()) as {
                table_number: number;
                qr_code_url: string;
                download_url: string;
            };

            setQrData({
                tableNumber: payload.table_number,
                qrCodeUrl: payload.qr_code_url,
                downloadUrl: payload.download_url,
            });
        } finally {
            setLoadingQrTableId(null);
        }
    };

    const handleCloseQr = () => {
        setQrData({
            tableNumber: null,
            qrCodeUrl: '',
            downloadUrl: '',
        });
    };

    return (
        <>
            <Head title="Kelola Meja" />

            <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Kelola Meja</h1>
                        <p className="mt-1 text-sm text-slate-600">Atur data meja dan QR code pelanggan.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(true)}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Tambah Meja
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-600">
                                <th className="px-3 py-2 font-medium">Nomor Meja</th>
                                <th className="px-3 py-2 font-medium">Status</th>
                                <th className="px-3 py-2 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr key={table.id} className="border-b border-slate-100">
                                    <td className="px-3 py-3 font-medium text-slate-900">Meja {table.number}</td>
                                    <td className="px-3 py-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                table.status === 'kosong'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {table.status === 'kosong' ? 'Kosong' : 'Terisi'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={loadingQrTableId === table.id}
                                                onClick={() => handleOpenQr(table.id)}
                                                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                                            >
                                                {loadingQrTableId === table.id ? 'Memuat...' : 'Lihat QR'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.patch(`/dashboard/tables/${table.id}/reset-status`)
                                                }
                                                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                            >
                                                Reset Status
                                            </button>
                                            <button
                                                type="button"
                                                disabled={!table.can_delete}
                                                onClick={() => router.delete(`/dashboard/tables/${table.id}`)}
                                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <TableForm
                open={isFormOpen}
                processing={processing}
                number={data.number}
                error={errors.number}
                onChangeNumber={(value) => setData('number', value)}
                onClose={() => {
                    setIsFormOpen(false);
                    reset();
                }}
                onSubmit={handleSubmitTable}
            />

            <QrCodeModal
                open={Boolean(qrData.tableNumber)}
                tableNumber={qrData.tableNumber}
                qrCodeUrl={qrData.qrCodeUrl}
                downloadUrl={qrData.downloadUrl}
                onClose={handleCloseQr}
            />
        </>
    );
}

Tables.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
