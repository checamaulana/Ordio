type PaymentMethod = 'cash' | 'qris';

interface PaymentMethodSelectorProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Pilih metode pembayaran</p>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                <span>Cash (Bayar di kasir)</span>
                <input checked={value === 'cash'} name="payment-method" onChange={() => onChange('cash')} type="radio" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                <span>QRIS (Bayar digital)</span>
                <input checked={value === 'qris'} name="payment-method" onChange={() => onChange('qris')} type="radio" />
            </label>
        </div>
    );
}
