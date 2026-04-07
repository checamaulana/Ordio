interface QrisPaymentViewProps {
    orderNumber: string;
    total: number;
    qrisImageUrl: string;
    isWaitingConfirmation: boolean;
    onConfirmPaid: () => void;
}

export function QrisPaymentView({ orderNumber, total, qrisImageUrl, isWaitingConfirmation, onConfirmPaid }: QrisPaymentViewProps) {
    return (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">Pembayaran QRIS</h1>
                <p className="mt-1 text-sm text-slate-600">Nomor pesanan: {orderNumber}</p>
                <p className="text-sm font-semibold text-slate-900">Total: Rp {total.toLocaleString('id-ID')}</p>
            </div>

            <img alt="QRIS" className="mx-auto w-full max-w-64 rounded-lg border border-slate-200" src={qrisImageUrl} />

            {isWaitingConfirmation ? (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    Pembayaran sedang diverifikasi oleh kasir. Mohon tunggu sebentar.
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-600">Silakan scan QR di atas menggunakan aplikasi bank atau e-wallet Anda.</p>
                    <button className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white" onClick={onConfirmPaid} type="button">
                        Saya Sudah Bayar
                    </button>
                </>
            )}
        </section>
    );
}
