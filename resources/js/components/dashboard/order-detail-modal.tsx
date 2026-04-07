import type { DashboardOrder } from '@/types/dashboard-order';

type OrderDetailModalProps = {
    order: DashboardOrder | null;
    onClose: () => void;
};

function formatCurrency(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
    if (!order) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Detail {order.order_number}</h2>
                        <p className="text-sm text-slate-600">
                            {order.order_type === 'dine_in' ? `Meja ${order.table_number ?? '-'}` : 'Takeaway'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                    >
                        Tutup
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                        <article key={item.id} className="rounded-md border border-slate-200 p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {item.menu_item_name} x{item.quantity}
                                    </p>
                                    {item.variants.length > 0 ? (
                                        <ul className="mt-1 text-xs text-slate-600">
                                            {item.variants.map((variant) => (
                                                <li key={variant.id}>
                                                    {variant.variant_group_name}: {variant.variant_option_name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                    {item.note ? <p className="mt-1 text-xs italic text-slate-600">Catatan: {item.note}</p> : null}
                                </div>
                                <p className="text-sm font-medium text-slate-900">{formatCurrency(item.subtotal)}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                    <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                    <p>Diskon: -{formatCurrency(order.discount_total)}</p>
                    <p>Pajak: {formatCurrency(order.tax_amount)}</p>
                    <p className="mt-1 font-semibold text-slate-900">Total: {formatCurrency(order.total)}</p>
                </div>
            </div>
        </div>
    );
}
