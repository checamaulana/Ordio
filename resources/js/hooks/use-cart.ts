import { useEffect, useMemo, useState } from 'react';

const TAX_RATE = 0.11;

export type VariantOptionSelection = {
    variant_group_id: number;
    variant_group_name: string;
    variant_option_id: number;
    variant_option_name: string;
    additional_price: number;
};

export type CartMenuItem = {
    id: number;
    name: string;
    price: number;
    image_path: string;
    has_discount: boolean;
    discount_type: 'percentage' | 'fixed' | null;
    discount_value: number | null;
};

export type CartItem = {
    key: string;
    menu_item_id: number;
    menu_item_name: string;
    image_path: string;
    quantity: number;
    note: string;
    selected_variants: VariantOptionSelection[];
    has_discount: boolean;
    discount_type: 'percentage' | 'fixed' | null;
    discount_value: number | null;
    unit_price: number;
    base_total: number;
    discount_amount: number;
    subtotal: number;
};

type AddCartItemPayload = {
    menuItem: CartMenuItem;
    quantity: number;
    note: string;
    selectedVariants: VariantOptionSelection[];
};

type CartTotals = {
    subtotal: number;
    discount_total: number;
    tax_amount: number;
    total: number;
};

const buildStorageKey = (tableNumber: number | string) => `customer-cart-table-${tableNumber}`;

function calculateDiscount(
    baseTotal: number,
    hasDiscount: boolean,
    discountType: 'percentage' | 'fixed' | null,
    discountValue: number | null,
): number {
    if (!hasDiscount || !discountType || !discountValue) {
        return 0;
    }

    if (discountType === 'percentage') {
        return Math.min(baseTotal, Math.round((baseTotal * discountValue) / 100));
    }

    return Math.min(baseTotal, discountValue);
}

function mapCartItem(payload: AddCartItemPayload): CartItem {
    const variantTotal = payload.selectedVariants.reduce((sum, variant) => sum + variant.additional_price, 0);
    const unitPrice = payload.menuItem.price + variantTotal;
    const baseTotal = Math.max(0, unitPrice * payload.quantity);
    const discountAmount = calculateDiscount(
        baseTotal,
        payload.menuItem.has_discount,
        payload.menuItem.discount_type,
        payload.menuItem.discount_value,
    );

    return {
        key: `${payload.menuItem.id}-${payload.selectedVariants.map((variant) => variant.variant_option_id).join('-')}-${payload.note.trim()}`,
        menu_item_id: payload.menuItem.id,
        menu_item_name: payload.menuItem.name,
        image_path: payload.menuItem.image_path,
        quantity: payload.quantity,
        note: payload.note,
        selected_variants: payload.selectedVariants,
        has_discount: payload.menuItem.has_discount,
        discount_type: payload.menuItem.discount_type,
        discount_value: payload.menuItem.discount_value,
        unit_price: unitPrice,
        base_total: baseTotal,
        discount_amount: discountAmount,
        subtotal: Math.max(0, baseTotal - discountAmount),
    };
}

function recalculate(item: CartItem): CartItem {
    const baseTotal = Math.max(0, item.unit_price * item.quantity);
    const discountAmount = calculateDiscount(baseTotal, item.has_discount, item.discount_type, item.discount_value);

    return {
        ...item,
        base_total: baseTotal,
        discount_amount: discountAmount,
        subtotal: Math.max(0, baseTotal - discountAmount),
    };
}

export function useCart(tableNumber: number | string) {
    const storageKey = buildStorageKey(tableNumber);
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            setIsLoaded(true);
            return;
        }

        try {
            const parsed = JSON.parse(raw) as CartItem[];
            setItems(parsed.map((item) => recalculate(item)));
        } catch {
            setItems([]);
        } finally {
            setIsLoaded(true);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!isLoaded || typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(items));
    }, [isLoaded, items, storageKey]);

    const totals = useMemo<CartTotals>(() => {
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const discountTotal = items.reduce((sum, item) => sum + item.discount_amount, 0);
        const taxAmount = Math.round(subtotal * TAX_RATE);

        return {
            subtotal,
            discount_total: discountTotal,
            tax_amount: taxAmount,
            total: subtotal + taxAmount,
        };
    }, [items]);

    const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

    const addItem = (payload: AddCartItemPayload) => {
        const next = mapCartItem(payload);

        setItems((current) => {
            const index = current.findIndex((item) => item.key === next.key);

            if (index === -1) {
                return [...current, next];
            }

            const merged = [...current];
            const existing = merged[index];
            merged[index] = recalculate({
                ...existing,
                quantity: existing.quantity + next.quantity,
            });

            return merged;
        });
    };

    const updateQuantity = (key: string, quantity: number) => {
        setItems((current) =>
            current
                .map((item) => {
                    if (item.key !== key) {
                        return item;
                    }

                    return recalculate({
                        ...item,
                        quantity,
                    });
                })
                .filter((item) => item.quantity > 0),
        );
    };

    const removeItem = (key: string) => {
        setItems((current) => current.filter((item) => item.key !== key));
    };

    const clearCart = () => {
        setItems([]);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(storageKey);
        }
    };

    return {
        items,
        cartCount,
        totals,
        isLoaded,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
    };
}
