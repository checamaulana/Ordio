import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { MenuForm } from '@/components/dashboard/menu-form';
import { VariantForm } from '@/components/dashboard/variant-form';
import { DashboardLayout } from '@/layouts/dashboard-layout';

type SubCategory = {
    id: number;
    name: string;
};

type Category = {
    id: number;
    name: string;
    sub_categories: SubCategory[];
};

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

type MenuItem = {
    id: number;
    category_id: number;
    sub_category_id: number | null;
    name: string;
    price: number;
    image_path: string;
    is_available: boolean;
    is_best_seller: boolean;
    has_discount: boolean;
    discount_type: 'percentage' | 'fixed' | null;
    discount_value: number | null;
    sort_order: number;
    category: { name: string };
    sub_category: { name: string } | null;
    variant_groups: VariantGroup[];
};

interface MenuItemsProps {
    categories: Category[];
    menuItems: MenuItem[];
}

export default function MenuItems({ categories, menuItems }: MenuItemsProps) {
    const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
    const editingMenu = useMemo(() => menuItems.find((item) => item.id === editingMenuId) ?? null, [editingMenuId, menuItems]);

    return (
        <DashboardLayout>
            <Head title="Item Menu" />

            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">Kelola Item Menu</h1>
                    <p className="mt-1 text-sm text-slate-600">Tambah, ubah, dan hapus item menu beserta variasinya.</p>
                </header>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">{editingMenu ? 'Edit Item Menu' : 'Tambah Item Menu'}</h2>
                        {editingMenu ? (
                            <button
                                type="button"
                                className="text-sm text-slate-600 underline"
                                onClick={() => setEditingMenuId(null)}
                            >
                                Batal Edit
                            </button>
                        ) : null}
                    </div>

                    <MenuForm
                        key={editingMenu ? `edit-${editingMenu.id}` : 'create'}
                        categories={categories}
                        submitUrl={editingMenu ? `/dashboard/menu-items/${editingMenu.id}` : '/dashboard/menu-items'}
                        submitMethod={editingMenu ? 'put' : 'post'}
                        submitLabel={editingMenu ? 'Update Menu' : 'Simpan Menu'}
                        currentImageUrl={editingMenu ? `/storage/${editingMenu.image_path}` : undefined}
                        initialValues={
                            editingMenu
                                ? {
                                      category_id: editingMenu.category_id,
                                      sub_category_id: editingMenu.sub_category_id ?? '',
                                      name: editingMenu.name,
                                      price: editingMenu.price,
                                      is_available: editingMenu.is_available,
                                      is_best_seller: editingMenu.is_best_seller,
                                      has_discount: editingMenu.has_discount,
                                      discount_type: editingMenu.discount_type ?? '',
                                      discount_value: editingMenu.discount_value ?? 0,
                                      sort_order: editingMenu.sort_order,
                                  }
                                : undefined
                        }
                        onSuccess={() => setEditingMenuId(null)}
                    />
                </section>

                {editingMenu ? <VariantForm menuItemId={editingMenu.id} variantGroups={editingMenu.variant_groups} /> : null}

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                    <h2 className="text-lg font-semibold text-slate-900">Daftar Item Menu</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-3 py-2">Nama</th>
                                    <th className="px-3 py-2">Kategori</th>
                                    <th className="px-3 py-2">Harga</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="px-3 py-2 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-3 py-2 text-slate-700">
                                            {item.category?.name}
                                            {item.sub_category ? ` / ${item.sub_category.name}` : ''}
                                        </td>
                                        <td className="px-3 py-2 text-slate-700">Rp {item.price.toLocaleString('id-ID')}</td>
                                        <td className="px-3 py-2 text-slate-700">
                                            <div className="space-y-1">
                                                <p>{item.is_available ? 'Tersedia' : 'Tidak tersedia'}</p>
                                                <p>{item.is_best_seller ? 'Best seller' : 'Reguler'}</p>
                                                <p>{item.has_discount ? 'Diskon aktif' : 'Tanpa diskon'}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                                                    onClick={() => setEditingMenuId(item.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                                                    onClick={() => {
                                                        if (window.confirm(`Hapus item menu ${item.name}?`)) {
                                                            router.delete(`/dashboard/menu-items/${item.id}`);
                                                        }
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {menuItems.length === 0 ? <p className="mt-3 text-sm text-slate-500">Belum ada item menu.</p> : null}
                    </div>
                </section>
            </section>
        </DashboardLayout>
    );
}
