import { useForm } from '@inertiajs/react';
import { type ChangeEvent, type FormEvent, useState } from 'react';

type Category = {
    id: number;
    name: string;
    sub_categories: {
        id: number;
        name: string;
    }[];
};

type MenuItemFormValues = {
    category_id: number;
    sub_category_id: number | '';
    name: string;
    price: number;
    image: File | null;
    is_available: boolean;
    is_best_seller: boolean;
    has_discount: boolean;
    discount_type: '' | 'percentage' | 'fixed';
    discount_value: number;
    sort_order: number;
};

interface MenuFormProps {
    categories: Category[];
    submitUrl: string;
    submitMethod?: 'post' | 'put';
    initialValues?: Partial<Omit<MenuItemFormValues, 'image'>>;
    submitLabel: string;
    currentImageUrl?: string;
    onSuccess?: () => void;
}

const defaultValues = (categories: Category[]): MenuItemFormValues => ({
    category_id: categories[0]?.id ?? 0,
    sub_category_id: '',
    name: '',
    price: 0,
    image: null,
    is_available: true,
    is_best_seller: false,
    has_discount: false,
    discount_type: '',
    discount_value: 0,
    sort_order: 0,
});

export function MenuForm({
    categories,
    submitUrl,
    submitMethod = 'post',
    initialValues,
    submitLabel,
    currentImageUrl,
    onSuccess,
}: MenuFormProps) {
    const initialData: MenuItemFormValues = initialValues
        ? { ...defaultValues(categories), ...initialValues, image: null }
        : defaultValues(categories);

    const { data, setData, post, put, processing, errors, reset } = useForm<MenuItemFormValues>(initialData);

    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null);

    const selectedCategory = categories.find((category) => category.id === data.category_id);
    const subCategories = selectedCategory?.sub_categories ?? [];

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('image', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                if (submitMethod === 'post') {
                    reset();
                    setPreviewUrl(null);
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
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
                    Nama Menu
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
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category_id">
                    Kategori
                </label>
                <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(event) => {
                        const categoryId = Number(event.target.value);
                        setData((current) => {
                            const nextCategory = categories.find((category) => category.id === categoryId);
                            const isValidSubCategory = nextCategory?.sub_categories.some(
                                (subCategory) => subCategory.id === current.sub_category_id,
                            );

                            return {
                                ...current,
                                category_id: categoryId,
                                sub_category_id: isValidSubCategory ? current.sub_category_id : '',
                            };
                        });
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="sub_category_id">
                    Sub-kategori
                </label>
                <select
                    id="sub_category_id"
                    value={data.sub_category_id}
                    onChange={(event) => setData('sub_category_id', event.target.value ? Number(event.target.value) : '')}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">Tanpa sub-kategori</option>
                    {subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="price">
                    Harga
                </label>
                <input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(event) => setData('price', Number(event.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price}</p> : null}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="image_path">
                    Foto Menu
                </label>
                {previewUrl ? (
                    <div className="mb-2">
                        <img
                            src={previewUrl}
                            alt="Preview gambar menu"
                            className="h-32 w-32 rounded-md border border-slate-200 object-cover"
                        />
                    </div>
                ) : null}
                <input
                    id="image_path"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />
                <p className="mt-1 text-xs text-slate-500">JPEG, PNG, atau WebP. Maks. 2MB.</p>
                {errors.image ? <p className="mt-1 text-xs text-red-600">{errors.image}</p> : null}
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

            <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.is_available}
                        onChange={(event) => setData('is_available', event.target.checked)}
                    />
                    Tersedia
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.is_best_seller}
                        onChange={(event) => setData('is_best_seller', event.target.checked)}
                    />
                    Best seller
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.has_discount}
                        onChange={(event) => setData('has_discount', event.target.checked)}
                    />
                    Pakai diskon
                </label>
            </div>

            {data.has_discount ? (
                <>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="discount_type">
                            Tipe Diskon
                        </label>
                        <select
                            id="discount_type"
                            value={data.discount_type}
                            onChange={(event) => setData('discount_type', event.target.value as 'percentage' | 'fixed' | '')}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">Pilih tipe</option>
                            <option value="percentage">Persentase</option>
                            <option value="fixed">Nominal</option>
                        </select>
                        {errors.discount_type ? <p className="mt-1 text-xs text-red-600">{errors.discount_type}</p> : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="discount_value">
                            Nilai Diskon
                        </label>
                        <input
                            id="discount_value"
                            type="number"
                            value={data.discount_value}
                            onChange={(event) => setData('discount_value', Number(event.target.value))}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        {errors.discount_value ? <p className="mt-1 text-xs text-red-600">{errors.discount_value}</p> : null}
                    </div>
                </>
            ) : null}

            <div className="md:col-span-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
