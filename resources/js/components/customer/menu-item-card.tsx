export type MenuItemCardData = {
    id: number;
    name: string;
    image_path: string;
    price: number;
    discounted_price: number | null;
    is_available: boolean;
    is_best_seller: boolean;
};

interface MenuItemCardProps {
    item: MenuItemCardData;
    onSelect: (itemId: number) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
    return (
        <button
            className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition active:scale-[0.99]"
            disabled={!item.is_available}
            onClick={() => onSelect(item.id)}
            type="button"
        >
            <div className="aspect-video bg-slate-100">
                <img alt={item.name} className="h-full w-full object-cover" src={item.image_path} />
            </div>
            <div className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {item.is_best_seller ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Best Seller</span>
                    ) : null}
                </div>

                <div>
                    {item.discounted_price ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 line-through">Rp {item.price.toLocaleString('id-ID')}</span>
                            <span className="font-semibold text-amber-700">Rp {item.discounted_price.toLocaleString('id-ID')}</span>
                        </div>
                    ) : (
                        <span className="font-semibold text-slate-900">Rp {item.price.toLocaleString('id-ID')}</span>
                    )}
                </div>

                {!item.is_available ? <p className="text-sm font-medium text-red-500">Sedang habis</p> : null}
            </div>
        </button>
    );
}
