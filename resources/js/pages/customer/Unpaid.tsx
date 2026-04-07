import { Head, router } from '@inertiajs/react';

import { CustomerLayout } from '@/layouts/customer-layout';

type UnpaidOrder = {
    order_number: string;
    payment_method: 'cash' | 'qris';
    payment_status: 'belum_bayar' | 'menunggu_konfirmasi' | 'sudah_bayar';
    total: number;
};

interface UnpaidPageProps {
    tableNumber: number;
    unpaidOrder: UnpaidOrder | null;
}

export default function Unpaid({ tableNumber, unpaidOrder }: UnpaidPageProps) {
    return (
        <>
            <Head title="Pesanan Belum Dibayar" />
            <CustomerLayout onCartClick={() => router.visit(`/meja/${tableNumber}/menu`)} tableNumber={tableNumber}>
                <section className="space-y-4 rounded-xl border border-amber-200 bg-white p-5">
                    <h1 className="text-xl font-semibold text-amber-700">Masih ada pesanan yang belum dibayar</h1>
                    <p className="text-sm text-slate-600">Silakan selesaikan pembayaran pesanan sebelumnya terlebih dahulu sebelum memesan lagi.</p>

                    {unpaidOrder ? (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                            <p>Nomor pesanan: {unpaidOrder.order_number}</p>
                            <p>Metode bayar: {unpaidOrder.payment_method === 'cash' ? 'Cash' : 'QRIS'}</p>
                            <p>Status bayar: {unpaidOrder.payment_status.replace('_', ' ')}</p>
                            <p>Total: Rp {unpaidOrder.total.toLocaleString('id-ID')}</p>
                        </div>
                    ) : null}

                    <button className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white" onClick={() => router.reload()} type="button">
                        Cek Ulang Status Pembayaran
                    </button>
                </section>
            </CustomerLayout>
        </>
    );
}
