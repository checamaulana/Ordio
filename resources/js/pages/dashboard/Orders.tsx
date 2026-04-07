import { Head, Link } from '@inertiajs/react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { NotificationPopup } from '@/components/dashboard/notification-popup';
import { OrderCard } from '@/components/dashboard/order-card';
import { OrderDetailModal } from '@/components/dashboard/order-detail-modal';
import { PaymentCashModal } from '@/components/dashboard/payment-cash-modal';
import { PaymentQrisModal } from '@/components/dashboard/payment-qris-modal';
import { useNotification } from '@/hooks/use-notification';
import { usePolling } from '@/hooks/use-polling';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import type { DashboardOrder, OrdersPollingResponse } from '@/types/dashboard-order';

type OrdersPageProps = {
    orders: DashboardOrder[];
    pollingIntervalMs?: number;
};

type ActionError = {
    cash?: string;
    qris?: string;
};

const ORDERS_BASE_PATH = '/dashboard/pesanan';

function getCsrfToken(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}

export default function Orders({ orders: initialOrders, pollingIntervalMs = 10_000 }: OrdersPageProps) {
    const [orders, setOrders] = useState<DashboardOrder[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);
    const [cashPaymentOrder, setCashPaymentOrder] = useState<DashboardOrder | null>(null);
    const [qrisPaymentOrder, setQrisPaymentOrder] = useState<DashboardOrder | null>(null);
    const [processingCash, setProcessingCash] = useState(false);
    const [processingQris, setProcessingQris] = useState(false);
    const [processingCompleteId, setProcessingCompleteId] = useState<number | null>(null);
    const [processingDeleteId, setProcessingDeleteId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<ActionError>({});
    const [knownOrderIds, setKnownOrderIds] = useState<number[]>(initialOrders.map((order) => order.id));
    const { notifications, notify, dismissNotification } = useNotification();

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(ORDERS_BASE_PATH, {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                return;
            }

            const payload = (await response.json()) as OrdersPollingResponse;
            const latestOrders = payload.orders;
            const latestIds = latestOrders.map((order) => order.id);
            const incomingNewOrders = latestOrders.filter((order) => !knownOrderIds.includes(order.id));

            setOrders(latestOrders);
            setKnownOrderIds(latestIds);

            if (incomingNewOrders.length > 0) {
                notify(`${incomingNewOrders.length} pesanan baru masuk.`, 'warning');
            }
        } catch {
            notify('Gagal memuat pembaruan pesanan.', 'warning');
        }
    }, [knownOrderIds, notify]);

    usePolling(fetchOrders, pollingIntervalMs, { enabled: true, immediate: false });

    const activeOrders = useMemo(() => orders.filter((order) => order.status === 'diproses'), [orders]);

    const requestCompleteOrder = async (order: DashboardOrder) => {
        setProcessingCompleteId(order.id);

        try {
            const response = await fetch(`${ORDERS_BASE_PATH}/${order.id}/selesai`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!response.ok) {
                notify('Gagal mengubah status pesanan.', 'warning');
                return;
            }

            notify(`Pesanan ${order.order_number} sudah selesai.`, 'success');
            await fetchOrders();
        } finally {
            setProcessingCompleteId(null);
        }
    };

    const requestCashPayment = async (cashReceived: number) => {
        if (!cashPaymentOrder) {
            return;
        }

        setActionError((current) => ({ ...current, cash: undefined }));
        setProcessingCash(true);

        try {
            const response = await fetch(`${ORDERS_BASE_PATH}/${cashPaymentOrder.id}/pembayaran/cash`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    cash_received: cashReceived,
                }),
            });

            const payload = (await response.json().catch(() => null)) as { message?: string } | null;

            if (!response.ok) {
                setActionError((current) => ({ ...current, cash: payload?.message ?? 'Pembayaran cash gagal diproses.' }));
                return;
            }

            notify(`Pembayaran cash untuk ${cashPaymentOrder.order_number} berhasil.`, 'success');
            setCashPaymentOrder(null);
            await fetchOrders();
        } finally {
            setProcessingCash(false);
        }
    };

    const requestQrisConfirmation = async () => {
        if (!qrisPaymentOrder) {
            return;
        }

        setActionError((current) => ({ ...current, qris: undefined }));
        setProcessingQris(true);

        try {
            const response = await fetch(`${ORDERS_BASE_PATH}/${qrisPaymentOrder.id}/pembayaran/qris/konfirmasi`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const payload = (await response.json().catch(() => null)) as { message?: string } | null;

            if (!response.ok) {
                setActionError((current) => ({ ...current, qris: payload?.message ?? 'Konfirmasi QRIS gagal diproses.' }));
                return;
            }

            notify(`Pembayaran QRIS untuk ${qrisPaymentOrder.order_number} berhasil.`, 'success');
            setQrisPaymentOrder(null);
            await fetchOrders();
        } finally {
            setProcessingQris(false);
        }
    };

    const requestDeleteOrder = async (order: DashboardOrder) => {
        if (!window.confirm(`Hapus pesanan ${order.order_number}?`)) {
            return;
        }

        setProcessingDeleteId(order.id);

        try {
            const response = await fetch(`${ORDERS_BASE_PATH}/${order.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const payload = (await response.json().catch(() => null)) as { message?: string } | null;

            if (!response.ok) {
                notify(payload?.message ?? 'Gagal menghapus pesanan.', 'warning');
                return;
            }

            notify(payload?.message ?? `Pesanan ${order.order_number} berhasil dihapus.`, 'success');
            setSelectedOrder((current) => (current?.id === order.id ? null : current));
            setCashPaymentOrder((current) => (current?.id === order.id ? null : current));
            setQrisPaymentOrder((current) => (current?.id === order.id ? null : current));
            await fetchOrders();
        } catch {
            notify('Gagal menghapus pesanan.', 'warning');
        } finally {
            setProcessingDeleteId(null);
        }
    };

    return (
        <>
            <Head title="Pesanan Aktif" />

            <section className="space-y-6">
                <header className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Pesanan Aktif</h1>
                        <p className="mt-1 text-sm text-slate-600">Pantau pesanan diproses dan konfirmasi pembayaran kasir.</p>
                    </div>
                    <Link
                        href={`${ORDERS_BASE_PATH}/takeaway`}
                        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Takeaway Baru
                    </Link>
                </header>

                <div className="grid gap-4 lg:grid-cols-2">
                    {activeOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onOpenDetail={setSelectedOrder}
                            onOpenCashPayment={setCashPaymentOrder}
                            onOpenQrisConfirmation={setQrisPaymentOrder}
                            onCompleteOrder={requestCompleteOrder}
                            onDeleteOrder={requestDeleteOrder}
                            deletingOrderId={processingDeleteId}
                        />
                    ))}
                </div>

                {activeOrders.length === 0 ? (
                    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                        Belum ada pesanan aktif saat ini.
                    </section>
                ) : null}
            </section>

            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

            <PaymentCashModal
                order={cashPaymentOrder}
                processing={processingCash}
                errorMessage={actionError.cash}
                onClose={() => {
                    setCashPaymentOrder(null);
                    setActionError((current) => ({ ...current, cash: undefined }));
                }}
                onSubmit={requestCashPayment}
            />

            <PaymentQrisModal
                order={qrisPaymentOrder}
                processing={processingQris}
                errorMessage={actionError.qris}
                onClose={() => {
                    setQrisPaymentOrder(null);
                    setActionError((current) => ({ ...current, qris: undefined }));
                }}
                onConfirm={requestQrisConfirmation}
            />

            <NotificationPopup notifications={notifications} onDismiss={dismissNotification} />

            {processingCompleteId ? (
                <div className="fixed bottom-4 right-4 rounded-md bg-slate-900 px-3 py-2 text-xs text-white shadow">
                    Memperbarui pesanan #{processingCompleteId}...
                </div>
            ) : null}
        </>
    );
}

Orders.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
