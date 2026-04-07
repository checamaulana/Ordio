import { CartItem } from '@/components/customer/cart-item';
import { OrderSummary } from '@/components/customer/order-summary';
import type { CartItem as CartItemData } from '@/hooks/use-cart';

interface CartSheetProps {
    isOpen: boolean;
    items: CartItemData[];
    subtotal: number;
    discountTotal: number;
    taxAmount: number;
    total: number;
    onClose: () => void;
    onUpdateQuantity: (key: string, quantity: number) => void;
    onRemove: (key: string) => void;
    onCheckout: () => void;
}

export function CartSheet({
    isOpen,
    items,
    subtotal,
    discountTotal,
    taxAmount,
    total,
    onClose,
    onUpdateQuantity,
    onRemove,
    onCheckout,
}: CartSheetProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={onClose}>
            <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Keranjang</h2>
                    <button className="text-sm text-slate-500" onClick={onClose} type="button">
                        Tutup
                    </button>
                </div>

                <div className="space-y-3">
                    {items.length === 0 ? <p className="text-sm text-slate-500">Keranjang masih kosong.</p> : null}
                    {items.map((item) => (
                        <CartItem key={item.key} item={item} onRemove={onRemove} onUpdateQuantity={onUpdateQuantity} />
                    ))}
                </div>

                <div className="mt-4 space-y-3">
                    <OrderSummary discountTotal={discountTotal} subtotal={subtotal} taxAmount={taxAmount} total={total} />
                    <button
                        className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white disabled:bg-slate-300"
                        disabled={items.length === 0}
                        onClick={onCheckout}
                        type="button"
                    >
                        Lanjut ke Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
