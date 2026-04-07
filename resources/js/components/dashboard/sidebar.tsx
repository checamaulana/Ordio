import { router } from '@inertiajs/react';

import { AppLogo } from '@/components/shared/app-logo';

type NavigationItem = {
    label: string;
    href: string;
};

type NavigationSection = {
    title: string;
    items: NavigationItem[];
};

interface DashboardSidebarProps {
    currentPath?: string;
}

const NAVIGATION_SECTIONS: NavigationSection[] = [
    {
        title: 'Dashboard',
        items: [{ label: 'Pesanan Aktif', href: '/dashboard/pesanan' }],
    },
    {
        title: 'Kelola Menu',
        items: [
            { label: 'Item Menu', href: '/dashboard/menu-items' },
            { label: 'Kategori', href: '/dashboard/categories' },
        ],
    },
    {
        title: 'Kelola Meja',
        items: [{ label: 'Meja', href: '/dashboard/tables' }],
    },
    {
        title: 'Laporan',
        items: [
            { label: 'Harian', href: '/dashboard/reports/daily' },
            { label: 'Mingguan', href: '/dashboard/reports/weekly' },
            { label: 'Bulanan', href: '/dashboard/reports/monthly' },
            { label: 'Item Terlaris', href: '/dashboard/reports/top-items' },
            { label: 'Pendapatan', href: '/dashboard/reports/revenue' },
        ],
    },
];

export function DashboardSidebar({ currentPath = '' }: DashboardSidebarProps) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:flex lg:flex-col">
            <AppLogo subtitle="Dashboard Kasir" />

            <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
                {NAVIGATION_SECTIONS.map((section) => (
                    <section key={section.title} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</p>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = currentPath.startsWith(item.href);

                                return (
                                    <li key={item.href}>
                                        <a
                                            className={`block rounded-md px-3 py-2 text-sm transition ${
                                                isActive
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </nav>

            <button
                className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                onClick={handleLogout}
                type="button"
            >
                Keluar
            </button>
        </aside>
    );
}
