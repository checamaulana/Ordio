<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreCategoryRequest;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with(['subCategories' => fn ($query) => $query->orderBy('sort_order')])
            ->withCount('menuItems')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('dashboard/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        Category::query()->create($request->validated());

        return redirect()->route('dashboard.categories.index');
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('dashboard.categories.index');
    }

    public function destroy(Category $category)
    {
        if ($category->menuItems()->exists()) {
            return redirect()->route('dashboard.categories.index')->withErrors([
                'category' => 'Kategori tidak bisa dihapus karena masih memiliki item menu.',
            ]);
        }

        if ($category->subCategories()->exists()) {
            return redirect()->route('dashboard.categories.index')->withErrors([
                'category' => 'Hapus sub-kategori terlebih dahulu sebelum menghapus kategori.',
            ]);
        }

        $category->delete();

        return redirect()->route('dashboard.categories.index');
    }
}
