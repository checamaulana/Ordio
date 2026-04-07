interface AppLogoProps {
    subtitle?: string;
    className?: string;
}

export function AppLogo({ subtitle = 'Sistem Pemesanan QR', className }: AppLogoProps) {
    return (
        <div className={className}>
            <p className="text-lg font-bold tracking-tight text-amber-700">Kopi Tempo</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
    );
}
