import { AppLogo } from '@/components/shared/app-logo';

type DashboardHeaderProps = {
    username?: string;
};

export function DashboardHeader({ username }: DashboardHeaderProps) {
    return (
        <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
                <AppLogo className="md:hidden" subtitle="Dashboard Kasir" />
                <div className="ml-auto text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Kasir Aktif</p>
                    <p className="text-sm font-semibold text-slate-800">{username || 'Kasir'}</p>
                </div>
            </div>
        </header>
    );
}
