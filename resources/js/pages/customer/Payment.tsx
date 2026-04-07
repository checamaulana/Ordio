import { Head, router } from '@inertiajs/react';

import { QrisPaymentView } from '@/components/customer/qris-payment-view';
import { CustomerLayout } from '@/layouts/customer-layout';

type PaymentOrder = {
    order_number: string;
    payment_status: 'belum_bayar' | 'menunggu_konfirmasi' | 'sudah_bayar';
    total: number;
};

interface PaymentPageProps {
    tableNumber: number;
    order: PaymentOrder;
    qrisImageUrl: string;
}

export default function Payment({ tableNumber, order, qrisImageUrl }: PaymentPageProps) {
    return (
        <>
            <Head title="Pembayaran QRIS" />
            <CustomerLayout onCartClick={() => router.visit(`/meja/${tableNumber}/menu`)} tableNumber={tableNumber}>
                <QrisPaymentView
                    isWaitingConfirmation={order.payment_status !== 'belum_bayar'}
                    onConfirmPaid={() =>
                        router.post(`/meja/${tableNumber}/pembayaran/${order.order_number}/sudah-bayar`, {}, {
                            preserveScroll: true,
                        })
                    }
                    orderNumber={order.order_number}
                    qrisImageUrl={qrisImageUrl}
                    total={order.total}
                />
            </CustomerLayout>
        </>
    );
}
