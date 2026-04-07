import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type CategoryFormValues = {
    name: string;
    sort_order: number;
};

interface CategoryFormProps {
    submitUrl: string;
    submitMethod?: 'post' | 'put';
    initialValues?: CategoryFormValues;
    submitLabel: string;
    onSuccess?: () => void;
}

export function CategoryForm({
    submitUrl,
    submitMethod = 'post',
    initialValues = { name: '', sort_order: 0 },
    submitLabel,
    onSuccess,
}: CategoryFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<CategoryFormValues>(initialValues);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            onSuccess: () => {
                if (submitMethod === 'post') {
                    reset('name');
                }

                onSuccess?.();
            },
        };

        if (submitMethod === 'put') {
            put(submitUrl, options);
            return;
        }

        post(submitUrl, options);
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
                    Nama Kategori
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="sort_order">
                    Urutan
                </label>
                <input
                    id="sort_order"
                    type="number"
                    value={data.sort_order}
                    onChange={(event) => setData('sort_order', Number(event.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
                {processing ? 'Menyimpan...' : submitLabel}
            </button>
        </form>
    );
}
