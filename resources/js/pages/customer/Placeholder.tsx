import { Head } from '@inertiajs/react';

interface CustomerPlaceholderProps {
    title: string;
    description: string;
    tableNumber: number;
    orderNumber?: string;
}

export default function Placeholder({ title, description, tableNumber, orderNumber }: CustomerPlaceholderProps) {
    return (
        <>
            <Head title={title} />
            <main className="mx-auto w-full max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
                <p className="mt-2 text-sm text-neutral-600">Meja {tableNumber}</p>
                {orderNumber ? <p className="mt-1 text-sm text-neutral-600">Nomor pesanan: {orderNumber}</p> : null}
                <p className="mt-3 text-sm text-neutral-600">{description}</p>
            </main>
        </>
    );
}
