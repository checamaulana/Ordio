import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { CartSheet } from '@/components/customer/cart-sheet';
import { MenuCategoryTabs } from '@/components/customer/menu-category-tabs';
import { MenuItemCard } from '@/components/customer/menu-item-card';
import { MenuItemDetail } from '@/components/customer/menu-item-detail';
import { useCart } from '@/hooks/use-cart';
import { CustomerLayout } from '@/layouts/customer-layout';

type Category = {
    id: number;
    name: string;
};

type MenuItem = {
    id: number;
    category_id: number;
    name: string;
    image_path: string;
    price: number;
    discounted_price: number | null;
    is_available: boolean;
    is_best_seller: boolean;
    has_discount: boolean;
    discount_type: 'percentage' | 'fixed' | null;
    discount_value: number | null;
    variant_groups: {
        id: number;
        name: string;
        variant_options: {
            id: number;
            name: string;
            additional_price: number;
        }[];
    }[];
};

interface MenuPageProps {
    tableNumber: number;
    categories: Category[];
    menuItems: MenuItem[];
}

export default function Menu({ tableNumber, categories, menuItems }: MenuPageProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(categories[0]?.id ?? null);
    const { items, cartCount, totals, addItem, updateQuantity, removeItem } = useCart(tableNumber);

    const filteredItems = useMemo(() => {
        if (!activeCategoryId) {
            return menuItems;
        }

        return menuItems.filter((item) => item.category_id === activeCategoryId);
    }, [activeCategoryId, menuItems]);

    const selectedItem = useMemo(() => menuItems.find((item) => item.id === selectedItemId) ?? null, [menuItems, selectedItemId]);

    return (
        <>
            <Head title={`Menu Meja ${tableNumber}`} />
            <CustomerLayout cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} tableNumber={tableNumber}>
                <section className="space-y-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Menu Digital</h1>
                        <p className="text-sm text-slate-600">Pilih menu favorit Anda dan lanjutkan ke checkout.</p>
                    </div>

                    <MenuCategoryTabs activeCategoryId={activeCategoryId} categories={categories} onChangeCategory={setActiveCategoryId} />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {filteredItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} onSelect={setSelectedItemId} />
                        ))}
                    </div>
                </section>

                <MenuItemDetail
                    isOpen={Boolean(selectedItem)}
                    item={selectedItem}
                    onAddToCart={addItem}
                    onClose={() => setSelectedItemId(null)}
                />

                <CartSheet
                    discountTotal={totals.discount_total}
                    isOpen={isCartOpen}
                    items={items}
                    onCheckout={() => router.visit(`/meja/${tableNumber}/checkout`)}
                    onClose={() => setIsCartOpen(false)}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    subtotal={totals.subtotal}
                    taxAmount={totals.tax_amount}
                    total={totals.total}
                />
            </CustomerLayout>
        </>
    );
}
