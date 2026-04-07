import { useEffect, useMemo, useState } from 'react';

import type { DashboardOrder } from '@/types/dashboard-order';

type PaymentCashModalProps = {
    order: DashboardOrder | null;
    processing: boolean;
    errorMessage?: string;
    onClose: () => void;
    onSubmit: (cashReceived: number) => void;
};

function formatCurrency(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export function PaymentCashModal({ order, processing, errorMessage, onClose, onSubmit }: PaymentCashModalProps) {
    const [cashInput, setCashInput] = useState('');

    useEffect(() => {
        if (!order) {
            setCashInput('');
        }
    }, [order]);

    const cashReceived = Number(cashInput || 0);
    const change = useMemo(() => {
        if (!order) {
            return 0;
        }

        return Math.max(0, cashReceived - order.total);
    }, [cashReceived, order]);

    if (!order) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">Pembayaran Cash</h2>
                <p className="mt-1 text-sm text-slate-600">{order.order_number}</p>

                <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <p>
                        Total bayar: <span className="font-semibold text-slate-900">{formatCurrency(order.total)}</span>
                    </p>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="cash-received">
                            Uang diterima
                        </label>
                        <input
                            id="cash-received"
                            type="number"
                            min={0}
                            value={cashInput}
                            onChange={(event) => setCashInput(event.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                            placeholder="Contoh: 100000"
                        />
                    </div>
                    <p>
                        Kembalian: <span className="font-semibold text-emerald-700">{formatCurrency(change)}</span>
                    </p>
                    {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
                </div>

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
                        disabled={processing || cashReceived <= 0}
                        onClick={() => onSubmit(cashReceived)}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                    </button>
                </div>
            </div>
        </div>
    );
}
