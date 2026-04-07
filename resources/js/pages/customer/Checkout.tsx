import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { OrderSummary } from '@/components/customer/order-summary';
import { PaymentMethodSelector } from '@/components/customer/payment-method-selector';
import { useCart } from '@/hooks/use-cart';
import { CustomerLayout } from '@/layouts/customer-layout';

interface CheckoutPageProps {
    tableNumber: number;
}

export default function Checkout({ tableNumber }: CheckoutPageProps) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { items, cartCount, totals, clearCart } = useCart(tableNumber);

    const orderPayload = useMemo(
        () => ({
            payment_method: paymentMethod,
            items: items.map((item) => ({
                menu_item_id: item.menu_item_id,
                quantity: item.quantity,
                note: item.note,
                variant_option_ids: item.selected_variants.map((variant) => variant.variant_option_id),
            })),
        }),
        [items, paymentMethod],
    );

    return (
        <>
            <Head title={`Checkout Meja ${tableNumber}`} />
            <CustomerLayout cartCount={cartCount} onCartClick={() => router.visit(`/meja/${tableNumber}/menu`)} tableNumber={tableNumber}>
                <section className="space-y-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Konfirmasi Pesanan</h1>
                        <p className="text-sm text-slate-600">Periksa kembali item dan pilih metode pembayaran.</p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                        {items.length === 0 ? (
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>Keranjang kosong. Silakan pilih menu terlebih dahulu.</p>
                                <button className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white" onClick={() => router.visit(`/meja/${tableNumber}/menu`)} type="button">
                                    Kembali ke Menu
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.key} className="border-b border-slate-100 pb-3 last:border-none last:pb-0">
                                    <p className="font-medium text-slate-900">
                                        {item.quantity}x {item.menu_item_name}
                                    </p>
                                    {item.selected_variants.length > 0 ? (
                                        <p className="text-xs text-slate-500">
                                            {item.selected_variants
                                                .map((variant) => `${variant.variant_group_name}: ${variant.variant_option_name}`)
                                                .join(' • ')}
                                        </p>
                                    ) : null}
                                    {item.note ? <p className="text-xs text-slate-500">Catatan: {item.note}</p> : null}
                                    <p className="mt-1 text-sm font-semibold">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <OrderSummary discountTotal={totals.discount_total} subtotal={totals.subtotal} taxAmount={totals.tax_amount} total={totals.total} />
                    <PaymentMethodSelector onChange={setPaymentMethod} value={paymentMethod} />

                    <button
                        className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white disabled:bg-slate-300"
                        disabled={items.length === 0 || isSubmitting}
                        onClick={() => {
                            setIsSubmitting(true);
                            router.post(`/meja/${tableNumber}/pesanan`, orderPayload, {
                                onSuccess: () => clearCart(),
                                onFinish: () => setIsSubmitting(false),
                            });
                        }}
                        type="button"
                    >
                        {isSubmitting ? 'Mengirim pesanan...' : 'Kirim Pesanan'}
                    </button>
                </section>
            </CustomerLayout>
        </>
    );
}
