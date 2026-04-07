<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreSubCategoryRequest;
use App\Models\SubCategory;

class SubCategoryController extends Controller
{
    public function index()
    {
        return redirect()->route('dashboard.categories.index');
    }

    public function store(StoreSubCategoryRequest $request)
    {
        SubCategory::query()->create($request->validated());

        return redirect()->route('dashboard.categories.index');
    }

    public function update(StoreSubCategoryRequest $request, SubCategory $subCategory)
    {
        $subCategory->update($request->validated());

        return redirect()->route('dashboard.categories.index');
    }

    public function destroy(SubCategory $subCategory)
    {
        if ($subCategory->menuItems()->exists()) {
            return redirect()->route('dashboard.categories.index')->withErrors([
                'sub_category' => 'Sub-kategori tidak bisa dihapus karena masih dipakai item menu.',
            ]);
        }

        $subCategory->delete();

        return redirect()->route('dashboard.categories.index');
    }
}
