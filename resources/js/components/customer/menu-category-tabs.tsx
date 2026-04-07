type Category = {
    id: number;
    name: string;
};

interface MenuCategoryTabsProps {
    categories: Category[];
    activeCategoryId: number | null;
    onChangeCategory: (categoryId: number) => void;
}

export function MenuCategoryTabs({ categories, activeCategoryId, onChangeCategory }: MenuCategoryTabsProps) {
    return (
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            {categories.map((category) => {
                const isActive = category.id === activeCategoryId;

                return (
                    <button
                        key={category.id}
                        className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                            isActive ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'
                        }`}
                        onClick={() => onChangeCategory(category.id)}
                        type="button"
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
}
