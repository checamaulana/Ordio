import { router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type VariantOption = {
    id: number;
    name: string;
    additional_price: number;
};

type VariantGroup = {
    id: number;
    name: string;
    variant_options: VariantOption[];
};

interface VariantFormProps {
    menuItemId: number;
    variantGroups: VariantGroup[];
}

export function VariantForm({ menuItemId, variantGroups }: VariantFormProps) {
    const groupForm = useForm({
        menu_item_id: menuItemId,
        name: '',
    });

    const optionForm = useForm({
        variant_group_id: variantGroups[0]?.id ?? 0,
        name: '',
        additional_price: 0,
    });

    const submitGroup = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        groupForm.post('/dashboard/variant-groups', {
            onSuccess: () => groupForm.reset('name'),
        });
    };

    const submitOption = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        optionForm.post('/dashboard/variant-options', {
            onSuccess: () => optionForm.reset('name', 'additional_price'),
        });
    };

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-slate-900">Variasi Menu</h3>

            <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitGroup}>
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="group_name">
                        Nama Grup Variasi
                    </label>
                    <input
                        id="group_name"
                        type="text"
                        value={groupForm.data.name}
                        onChange={(event) => groupForm.setData('name', event.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={groupForm.processing}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        Tambah Grup
                    </button>
                </div>
            </form>

            <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={submitOption}>
                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="variant_group_id">
                        Grup Variasi
                    </label>
                    <select
                        id="variant_group_id"
                        value={optionForm.data.variant_group_id}
                        onChange={(event) => optionForm.setData('variant_group_id', Number(event.target.value))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                        {variantGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="option_name">
                        Nama Opsi
                    </label>
                    <input
                        id="option_name"
                        type="text"
                        value={optionForm.data.name}
                        onChange={(event) => optionForm.setData('name', event.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="additional_price">
                        Harga Tambahan
                    </label>
                    <input
                        id="additional_price"
                        type="number"
                        value={optionForm.data.additional_price}
                        onChange={(event) => optionForm.setData('additional_price', Number(event.target.value))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>
                <div className="md:col-span-4">
                    <button
                        type="submit"
                        disabled={optionForm.processing || variantGroups.length === 0}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        Tambah Opsi
                    </button>
                </div>
            </form>

            <div className="mt-6 space-y-4">
                {variantGroups.map((group) => (
                    <div key={group.id} className="rounded-md border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{group.name}</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="text-xs text-slate-600 underline"
                                    onClick={() => {
                                        const newName = window.prompt('Nama grup variasi baru', group.name);
                                        if (!newName) {
                                            return;
                                        }
                                        router.put(`/dashboard/variant-groups/${group.id}`, {
                                            menu_item_id: menuItemId,
                                            name: newName,
                                        });
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="text-xs text-red-600 underline"
                                    onClick={() => {
                                        if (window.confirm('Hapus grup variasi ini?')) {
                                            router.delete(`/dashboard/variant-groups/${group.id}`);
                                        }
                                    }}
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                            {group.variant_options.map((option) => (
                                <li key={option.id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1">
                                    <span>
                                        {option.name} (+Rp {option.additional_price.toLocaleString('id-ID')})
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="text-xs text-slate-600 underline"
                                            onClick={() => {
                                                const newName = window.prompt('Nama opsi baru', option.name);
                                                if (!newName) {
                                                    return;
                                                }

                                                const newPrice = window.prompt(
                                                    'Harga tambahan baru',
                                                    String(option.additional_price),
                                                );

                                                if (newPrice === null) {
                                                    return;
                                                }

                                                router.put(`/dashboard/variant-options/${option.id}`, {
                                                    variant_group_id: group.id,
                                                    name: newName,
                                                    additional_price: Number(newPrice),
                                                });
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-xs text-red-600 underline"
                                            onClick={() => {
                                                if (window.confirm('Hapus opsi variasi ini?')) {
                                                    router.delete(`/dashboard/variant-options/${option.id}`);
                                                }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {group.variant_options.length === 0 ? <li className="text-xs text-slate-500">Belum ada opsi.</li> : null}
                        </ul>
                    </div>
                ))}
                {variantGroups.length === 0 ? <p className="text-sm text-slate-500">Belum ada grup variasi.</p> : null}
            </div>
        </section>
    );
}
