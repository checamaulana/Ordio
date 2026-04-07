import type { CartItem as CartItemData } from '@/hooks/use-cart';

interface CartItemProps {
    item: CartItemData;
    onUpdateQuantity: (key: string, quantity: number) => void;
    onRemove: (key: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-medium text-slate-900">{item.menu_item_name}</p>
                    {item.selected_variants.length > 0 ? (
                        <p className="mt-1 text-xs text-slate-500">
                            {item.selected_variants.map((variant) => `${variant.variant_group_name}: ${variant.variant_option_name}`).join(' • ')}
                        </p>
                    ) : null}
                    {item.note ? <p className="mt-1 text-xs text-slate-500">Catatan: {item.note}</p> : null}
                </div>
                <button className="text-xs text-red-500" onClick={() => onRemove(item.key)} type="button">
                    Hapus
                </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded-full border border-slate-300" onClick={() => onUpdateQuantity(item.key, item.quantity - 1)} type="button">
                        -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button className="h-8 w-8 rounded-full border border-slate-300" onClick={() => onUpdateQuantity(item.key, item.quantity + 1)} type="button">
                        +
                    </button>
                </div>
                <span className="text-sm font-semibold text-slate-900">Rp {item.subtotal.toLocaleString('id-ID')}</span>
            </div>
        </div>
    );
}
