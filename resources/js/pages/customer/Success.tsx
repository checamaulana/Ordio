import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

import { CustomerLayout } from '@/layouts/customer-layout';

interface SuccessPageProps {
    tableNumber: number;
    orderNumber: string;
    paymentMethod: 'cash' | 'qris';
    total: number;
}

export default function Success({ tableNumber, orderNumber, paymentMethod, total }: SuccessPageProps) {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.removeItem(`customer-cart-table-${tableNumber}`);
    }, [tableNumber]);

    return (
        <>
            <Head title="Pesanan Berhasil" />
            <CustomerLayout onCartClick={() => router.visit(`/meja/${tableNumber}/menu`)} tableNumber={tableNumber}>
                <section className="space-y-4 rounded-xl border border-emerald-200 bg-white p-5">
                    <h1 className="text-xl font-semibold text-emerald-700">Pesanan Anda berhasil dikirim!</h1>
                    <p className="text-sm text-slate-600">Nomor pesanan: {orderNumber}</p>
                    <p className="text-sm text-slate-600">Total: Rp {total.toLocaleString('id-ID')}</p>
                    {paymentMethod === 'cash' ? (
                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Silakan menuju kasir untuk melakukan pembayaran cash.</p>
                    ) : (
                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Pembayaran menunggu verifikasi kasir.</p>
                    )}
                    <button className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white" onClick={() => router.visit(`/meja/${tableNumber}/menu`)} type="button">
                        Kembali ke Menu
                    </button>
                </section>
            </CustomerLayout>
        </>
    );
}
