import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { CategoryForm } from '@/components/dashboard/category-form';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type SubCategory = {
    id: number;
    name: string;
    sort_order: number;
};

type Category = {
    id: number;
    name: string;
    sort_order: number;
    menu_items_count: number;
    sub_categories: SubCategory[];
};

interface CategoriesProps {
    categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const editingCategory = categories.find((category) => category.id === editingCategoryId) ?? null;

    return (
        <DashboardLayout>
            <Head title="Kategori" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Kelola Kategori</h1>
                    <p className="mt-1 text-sm text-slate-600">Atur kategori dan sub-kategori menu restoran.</p>
                </header>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-lg border border-slate-200 bg-white p-4">
                        <h2 className="text-lg font-semibold text-slate-900">Tambah Kategori</h2>
                        <div className="mt-4">
                            <CategoryForm submitUrl="/dashboard/categories" submitLabel="Simpan Kategori" />
                        </div>
                    </section>

                    {editingCategory ? (
                        <section className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Edit Kategori</h2>
                                <button
                                    type="button"
                                    className="text-sm text-slate-600 underline"
                                    onClick={() => setEditingCategoryId(null)}
                                >
                                    Batal
                                </button>
                            </div>
                            <div className="mt-4">
                                <CategoryForm
                                    key={editingCategory.id}
                                    submitUrl={`/dashboard/categories/${editingCategory.id}`}
                                    submitMethod="put"
                                    submitLabel="Update Kategori"
                                    initialValues={{
                                        name: editingCategory.name,
                                        sort_order: editingCategory.sort_order,
                                    }}
                                    onSuccess={() => setEditingCategoryId(null)}
                                />
                            </div>
                        </section>
                    ) : null}
                </div>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                    <h2 className="text-lg font-semibold text-slate-900">Daftar Kategori</h2>
                    <div className="mt-4 space-y-4">
                        {categories.map((category) => (
                            <article key={category.id} className="rounded-md border border-slate-200 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{category.name}</p>
                                        <p className="text-xs text-slate-500">{category.menu_items_count} item menu</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="rounded border border-slate-300 px-3 py-1 text-sm"
                                            onClick={() => {
                                                const name = window.prompt('Nama sub-kategori', '');
                                                if (!name) {
                                                    return;
                                                }

                                                router.post('/dashboard/sub-categories', {
                                                    category_id: category.id,
                                                    name,
                                                    sort_order: category.sub_categories.length,
                                                });
                                            }}
                                        >
                                            Tambah Sub-kategori
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded border border-slate-300 px-3 py-1 text-sm"
                                            onClick={() => setEditingCategoryId(category.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                                            onClick={() => {
                                                if (window.confirm(`Hapus kategori ${category.name}?`)) {
                                                    router.delete(`/dashboard/categories/${category.id}`);
                                                }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <ul className="mt-3 space-y-2">
                                    {category.sub_categories.map((subCategory) => (
                                        <li
                                            key={subCategory.id}
                                            className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm"
                                        >
                                            <span>{subCategory.name}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="text-xs text-slate-600 underline"
                                                    onClick={() => {
                                                        const name = window.prompt('Nama sub-kategori baru', subCategory.name);
                                                        if (!name) {
                                                            return;
                                                        }

                                                        router.put(`/dashboard/sub-categories/${subCategory.id}`, {
                                                            category_id: category.id,
                                                            name,
                                                            sort_order: subCategory.sort_order,
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs text-red-600 underline"
                                                    onClick={() => {
                                                        if (window.confirm(`Hapus sub-kategori ${subCategory.name}?`)) {
                                                            router.delete(`/dashboard/sub-categories/${subCategory.id}`);
                                                        }
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    {category.sub_categories.length === 0 ? (
                                        <li className="text-sm text-slate-500">Belum ada sub-kategori.</li>
                                    ) : null}
                                </ul>
                            </article>
                        ))}
                        {categories.length === 0 ? <p className="text-sm text-slate-500">Belum ada kategori.</p> : null}
                    </div>
                </section>
            </section>
        </DashboardLayout>
    );
}
