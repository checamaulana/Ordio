interface OrderSummaryProps {
    subtotal: number;
    discountTotal: number;
    taxAmount: number;
    total: number;
}

export function OrderSummary({ subtotal, discountTotal, taxAmount, total }: OrderSummaryProps) {
    return (
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between py-1">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between py-1">
                <span>Diskon</span>
                <span>-Rp {discountTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between py-1">
                <span>Pajak (11%)</span>
                <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
        </div>
    );
}
