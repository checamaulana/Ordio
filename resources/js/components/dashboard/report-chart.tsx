import { cn } from '@/lib/utils';

type ChartPoint = {
    label: string;
    value: number;
    detail?: string;
};

type ReportChartProps = {
    title: string;
    description?: string;
    points: ChartPoint[];
    valueFormatter?: (value: number) => string;
    emptyMessage?: string;
    className?: string;
};

export function ReportChart({
    title,
    description,
    points,
    valueFormatter = (value) => value.toLocaleString('id-ID'),
    emptyMessage = 'Belum ada data untuk ditampilkan.',
    className,
}: ReportChartProps) {
    const maxValue = Math.max(...points.map((point) => point.value), 0);

    return (
        <section className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', className)}>
            <header className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
            </header>

            {points.length === 0 ? (
                <p className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500">{emptyMessage}</p>
            ) : (
                <ul className="space-y-3">
                    {points.map((point) => {
                        const width = maxValue === 0 ? 0 : Math.max((point.value / maxValue) * 100, 2);

                        return (
                            <li key={point.label}>
                                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                                    <p className="font-medium text-slate-700">{point.label}</p>
                                    <p className="text-right font-semibold text-slate-900">{valueFormatter(point.value)}</p>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${width}%` }} />
                                </div>
                                {point.detail ? <p className="mt-1 text-xs text-slate-500">{point.detail}</p> : null}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
