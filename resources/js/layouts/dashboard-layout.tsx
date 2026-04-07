import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';


import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

type DashboardLayoutProps = PropsWithChildren;

type DashboardPageProps = {
    auth?: {
        user?: {
            username?: string;
            name?: string;
        };
    };
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { url, props } = usePage<DashboardPageProps>();
    const username = props.auth?.user?.username || props.auth?.user?.name;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-screen-2xl">
                <DashboardSidebar currentPath={url} />
                <div className="flex min-h-screen flex-1 flex-col">
                    <DashboardHeader username={username} />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
