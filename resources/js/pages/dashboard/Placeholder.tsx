import { Head } from '@inertiajs/react';

interface DashboardPlaceholderProps {
    title: string;
    description: string;
}

export default function Placeholder({ title, description }: DashboardPlaceholderProps) {
    return (
        <>
            <Head title={title} />
            <main className="mx-auto w-full max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
                <p className="mt-3 text-sm text-neutral-600">{description}</p>
            </main>
        </>
    );
}
