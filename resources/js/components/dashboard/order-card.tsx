import type { DashboardOrder } from '@/types/dashboard-order';

type OrderCardProps = {
    order: DashboardOrder;
    onOpenDetail: (order: DashboardOrder) => void;
    onOpenCashPayment: (order: DashboardOrder) => void;
    onOpenQrisConfirmation: (order: DashboardOrder) => void;
    onCompleteOrder: (order: DashboardOrder) => void;
    onDeleteOrder: (order: DashboardOrder) => void;
    deletingOrderId: number | null;
};

function formatCurrency(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

function formatTime(value: string | null) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
    }).format(new Date(value));
}

export function OrderCard({
    order,
    onOpenDetail,
    onOpenCashPayment,
    onOpenQrisConfirmation,
    onCompleteOrder,
    onDeleteOrder,
    deletingOrderId,
}: OrderCardProps) {
    const isDineIn = order.order_type === 'dine_in';
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const isDeleting = deletingOrderId === order.id;

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{order.order_number}</h3>
                    <p className="text-sm text-slate-600">
                        {isDineIn ? `Meja ${order.table_number ?? '-'}` : 'Takeaway'} • {itemCount} item
                    </p>
                </div>
                <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        isDineIn ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'
                    }`}
                >
                    {isDineIn ? 'Dine-in' : 'Takeaway'}
                </span>
            </div>

            <div className="mt-3 text-sm text-slate-600">
                <p>Masuk: {formatTime(order.created_at)}</p>
                <p>Metode bayar: {order.payment_method === 'cash' ? 'Cash' : 'QRIS'}</p>
                <p>
                    Status bayar:{' '}
                    {order.payment_status === 'belum_bayar'
                        ? 'Belum bayar'
                        : order.payment_status === 'menunggu_konfirmasi'
                          ? 'Menunggu konfirmasi'
                          : 'Sudah bayar'}
                </p>
                <p className="mt-1 font-semibold text-slate-900">Total: {formatCurrency(order.total)}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onOpenDetail(order)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                    Detail
                </button>

                {order.payment_method === 'cash' && order.payment_status === 'belum_bayar' ? (
                    <button
                        type="button"
                        onClick={() => onOpenCashPayment(order)}
                        className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                    >
                        Proses Cash
                    </button>
                ) : null}

                {order.payment_method === 'qris' && order.payment_status === 'menunggu_konfirmasi' ? (
                    <button
                        type="button"
                        onClick={() => onOpenQrisConfirmation(order)}
                        className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                    >
                        Konfirmasi QRIS
                    </button>
                ) : null}

                <button
                    type="button"
                    disabled={order.payment_status !== 'sudah_bayar' || order.status !== 'diproses'}
                    onClick={() => onCompleteOrder(order)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Tandai Selesai
                </button>

                <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDeleteOrder(order)}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
            </div>
        </article>
    );
}
