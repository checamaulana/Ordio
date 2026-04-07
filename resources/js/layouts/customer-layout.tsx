import { ShoppingCart } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { AppLogo } from '@/components/shared/app-logo';

interface CustomerLayoutProps extends PropsWithChildren {
    tableNumber: number | string;
    onCartClick?: () => void;
    cartCount?: number;
}

export function CustomerLayout({ children, tableNumber, onCartClick, cartCount = 0 }: CustomerLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                    <AppLogo subtitle="Pesan tanpa antre" />
                    <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                        Meja {tableNumber}
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl px-4 py-4 pb-24 md:px-6 md:py-6">{children}</main>

            <button
                aria-label="Buka keranjang"
                className="fixed right-4 bottom-4 rounded-full bg-amber-600 p-4 text-white shadow-lg transition hover:bg-amber-500"
                onClick={onCartClick}
                type="button"
            >
                <span className="relative flex">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}
