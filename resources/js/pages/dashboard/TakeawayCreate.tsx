import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState, type ReactNode } from 'react';

import { CartItem } from '@/components/customer/cart-item';
import { MenuCategoryTabs } from '@/components/customer/menu-category-tabs';
import { MenuItemCard } from '@/components/customer/menu-item-card';
import { MenuItemDetail, type MenuItemDetailData } from '@/components/customer/menu-item-detail';
import { OrderSummary } from '@/components/customer/order-summary';
import { PaymentMethodSelector } from '@/components/customer/payment-method-selector';
import { useCart } from '@/hooks/use-cart';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type PaymentMethod = 'cash' | 'qris';

type Category = {
    id: number;
    name: string;
};

type MenuItem = MenuItemDetailData & {
    category_id: number;
    is_best_seller: boolean;
};

type TakeawayFormItem = {
    menu_item_id: number;
    quantity: number;
    note: string;
    variant_option_ids: number[];
};

type TakeawayFormData = {
    payment_method: PaymentMethod;
    items: TakeawayFormItem[];
};

interface TakeawayCreateProps {
    categories: Category[];
    menuItems: MenuItem[];
}

const TAKEAWAY_CART_KEY = 'dashboard-takeaway';

export default function TakeawayCreate({ categories, menuItems }: TakeawayCreateProps) {
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(categories[0]?.id ?? null);
    const { items, totals, addItem, updateQuantity, removeItem, clearCart } = useCart(TAKEAWAY_CART_KEY);
    const { data, setData, post, processing, errors, clearErrors, transform } = useForm<TakeawayFormData>({
        payment_method: 'cash',
        items: [],
    });

    const filteredItems = useMemo(() => {
        if (!activeCategoryId) {
            return menuItems;
        }

        return menuItems.filter((item) => item.category_id === activeCategoryId);
    }, [activeCategoryId, menuItems]);

    const selectedItem = useMemo(() => menuItems.find((item) => item.id === selectedItemId) ?? null, [menuItems, selectedItemId]);

    const payloadItems = useMemo<TakeawayFormItem[]>(
        () =>
            items.map((item) => ({
                menu_item_id: item.menu_item_id,
                quantity: item.quantity,
                note: item.note,
                variant_option_ids: item.selected_variants.map((variant) => variant.variant_option_id),
            })),
        [items],
    );

    const handleSubmit = () => {
        if (payloadItems.length === 0 || processing) {
            return;
        }

        clearErrors();
        transform(() => ({
            payment_method: data.payment_method,
            items: payloadItems,
        }));
        post('/dashboard/pesanan/takeaway', {
            preserveScroll: true,
            onSuccess: () => {
                clearCart();
            },
        });
    };

    return (
        <>
            <Head title="Takeaway Baru" />

            <section className="space-y-6">
                <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Takeaway Baru</h1>
                        <p className="mt-1 text-sm text-slate-600">Pilih menu, isi variasi, lalu kirim pesanan takeaway dari dashboard.</p>
                    </div>
                    <Link
                        className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        href="/dashboard/pesanan"
                    >
                        Kembali ke Pesanan Aktif
                    </Link>
                </header>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]">
                    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Pilih Menu</h2>
                            <p className="text-sm text-slate-600">Gunakan kategori untuk mempercepat input pesanan.</p>
                        </div>

                        {categories.length > 0 ? (
                            <MenuCategoryTabs activeCategoryId={activeCategoryId} categories={categories} onChangeCategory={setActiveCategoryId} />
                        ) : null}

                        {filteredItems.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                                Belum ada item menu pada kategori ini.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                {filteredItems.map((item) => (
                                    <MenuItemCard key={item.id} item={item} onSelect={setSelectedItemId} />
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="h-fit space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24">
                        <h2 className="text-lg font-semibold text-slate-900">Ringkasan Pesanan</h2>

                        <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                            {items.length === 0 ? <p className="text-sm text-slate-500">Keranjang masih kosong.</p> : null}
                            {items.map((item) => (
                                <CartItem key={item.key} item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
                            ))}
                        </div>

                        <OrderSummary discountTotal={totals.discount_total} subtotal={totals.subtotal} taxAmount={totals.tax_amount} total={totals.total} />
                        <PaymentMethodSelector onChange={(value) => setData('payment_method', value)} value={data.payment_method} />

                        {errors.items ? <p className="text-sm text-amber-600">{errors.items}</p> : null}
                        {errors.payment_method ? <p className="text-sm text-amber-600">{errors.payment_method}</p> : null}

                        <button
                            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            disabled={items.length === 0 || processing}
                            onClick={handleSubmit}
                            type="button"
                        >
                            {processing ? 'Menyimpan pesanan...' : 'Kirim Pesanan Takeaway'}
                        </button>
                    </aside>
                </div>
            </section>

            <MenuItemDetail isOpen={Boolean(selectedItem)} item={selectedItem} onAddToCart={addItem} onClose={() => setSelectedItemId(null)} />
        </>
    );
}

TakeawayCreate.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
