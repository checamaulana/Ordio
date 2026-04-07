import { useMemo, useState } from 'react';

import type { CartMenuItem, VariantOptionSelection } from '@/hooks/use-cart';

export type MenuItemDetailData = CartMenuItem & {
    discounted_price: number | null;
    is_available: boolean;
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

interface MenuItemDetailProps {
    item: MenuItemDetailData | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (payload: {
        menuItem: CartMenuItem;
        quantity: number;
        note: string;
        selectedVariants: VariantOptionSelection[];
    }) => void;
}

export function MenuItemDetail({ item, isOpen, onClose, onAddToCart }: MenuItemDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const [selectedVariantMap, setSelectedVariantMap] = useState<Record<number, number>>({});

    const selectedVariants = useMemo<VariantOptionSelection[]>(() => {
        if (!item) {
            return [];
        }

        return item.variant_groups
            .map((group) => {
                const selectedId = selectedVariantMap[group.id];
                const option = group.variant_options.find((variant) => variant.id === selectedId);

                if (!option) {
                    return null;
                }

                return {
                    variant_group_id: group.id,
                    variant_group_name: group.name,
                    variant_option_id: option.id,
                    variant_option_name: option.name,
                    additional_price: option.additional_price,
                };
            })
            .filter((variant): variant is VariantOptionSelection => variant !== null);
    }, [item, selectedVariantMap]);

    const variantTotal = selectedVariants.reduce((sum, variant) => sum + variant.additional_price, 0);
    const previewTotal = item ? (item.price + variantTotal) * quantity : 0;

    const canSubmit = item ? item.is_available && selectedVariants.length === item.variant_groups.length : false;

    if (!isOpen || !item) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={onClose}>
            <div
                className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4"
                onClick={(event) => event.stopPropagation()}
            >
                <img alt={item.name} className="h-44 w-full rounded-xl object-cover" src={item.image_path} />
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.name}</h2>
                <p className="text-sm text-slate-600">Harga dasar Rp {item.price.toLocaleString('id-ID')}</p>

                <div className="mt-4 space-y-4">
                    {item.variant_groups.map((group) => (
                        <div key={group.id}>
                            <p className="mb-2 text-sm font-semibold text-slate-800">{group.name}</p>
                            <div className="space-y-2">
                                {group.variant_options.map((option) => {
                                    const checked = selectedVariantMap[group.id] === option.id;

                                    return (
                                        <label key={option.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
                                            <span>{option.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500">+Rp {option.additional_price.toLocaleString('id-ID')}</span>
                                                <input
                                                    checked={checked}
                                                    name={`group-${group.id}`}
                                                    onChange={() =>
                                                        setSelectedVariantMap((current) => ({
                                                            ...current,
                                                            [group.id]: option.id,
                                                        }))
                                                    }
                                                    type="radio"
                                                />
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="note">
                        Catatan (opsional)
                    </label>
                    <textarea
                        className="min-h-20 w-full rounded-lg border border-slate-200 p-2 text-sm"
                        id="note"
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Contoh: tanpa gula"
                        value={note}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            className="h-9 w-9 rounded-full border border-slate-300"
                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                            type="button"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                            className="h-9 w-9 rounded-full border border-slate-300"
                            onClick={() => setQuantity((current) => current + 1)}
                            type="button"
                        >
                            +
                        </button>
                    </div>
                    <p className="font-semibold text-slate-900">Rp {previewTotal.toLocaleString('id-ID')}</p>
                </div>

                <button
                    className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white disabled:bg-slate-300"
                    disabled={!canSubmit}
                    onClick={() => {
                        onAddToCart({
                            menuItem: {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                image_path: item.image_path,
                                has_discount: item.has_discount,
                                discount_type: item.discount_type,
                                discount_value: item.discount_value,
                            },
                            quantity,
                            note,
                            selectedVariants,
                        });
                        setQuantity(1);
                        setNote('');
                        setSelectedVariantMap({});
                        onClose();
                    }}
                    type="button"
                >
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}
