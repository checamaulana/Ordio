import { Head, router } from '@inertiajs/react';

import { CustomerLayout } from '@/layouts/customer-layout';

interface ErrorPageProps {
    tableNumber?: number;
    message?: string;
}

export default function Error({ tableNumber, message }: ErrorPageProps) {
    return (
        <>
            <Head title="Meja Tidak Tersedia" />
            <CustomerLayout onCartClick={() => router.visit('/')} tableNumber={tableNumber ?? '-'}>
                <section className="space-y-4 rounded-xl border border-red-200 bg-white p-5">
                    <h1 className="text-xl font-semibold text-red-700">Oops, meja tidak tersedia</h1>
                    <p className="text-sm text-slate-600">{message ?? 'QR code tidak valid atau meja sudah tidak aktif.'}</p>
                    <button className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white" onClick={() => router.visit('/')} type="button">
                        Kembali ke Beranda
                    </button>
                </section>
            </CustomerLayout>
        </>
    );
}
