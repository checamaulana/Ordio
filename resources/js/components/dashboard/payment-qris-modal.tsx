import type { DashboardOrder } from '@/types/dashboard-order';

type PaymentQrisModalProps = {
    order: DashboardOrder | null;
    processing: boolean;
    errorMessage?: string;
    onClose: () => void;
    onConfirm: () => void;
};

export function PaymentQrisModal({ order, processing, errorMessage, onClose, onConfirm }: PaymentQrisModalProps) {
    if (!order) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">Konfirmasi QRIS</h2>
                <p className="mt-1 text-sm text-slate-600">Pastikan dana masuk sebelum konfirmasi pembayaran.</p>

                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <p>Nomor pesanan: {order.order_number}</p>
                    <p>Total: Rp {order.total.toLocaleString('id-ID')}</p>
                    <p>Status saat ini: Menunggu Konfirmasi</p>
                </div>

                {errorMessage ? <p className="mt-3 text-xs text-red-600">{errorMessage}</p> : null}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onConfirm}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                    </button>
                </div>
            </div>
        </div>
    );
}
