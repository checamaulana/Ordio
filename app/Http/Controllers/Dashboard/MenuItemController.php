<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreMenuItemRequest;
use App\Http\Requests\Dashboard\UpdateMenuItemRequest;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with(['subCategories' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        $menuItems = MenuItem::query()
            ->with(['category', 'subCategory', 'variantGroups.variantOptions'])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('dashboard/MenuItems', [
            'categories' => $categories,
            'menuItems' => $menuItems,
        ]);
    }

    public function store(StoreMenuItemRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (! $data['has_discount']) {
            $data['discount_type'] = null;
            $data['discount_value'] = null;
        }

        $data['image_path'] = $request->file('image')->store('menu-images', 'public');
        unset($data['image']);

        MenuItem::query()->create($data);

        return redirect()->route('dashboard.menu-items.index');
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $data = $request->validated();

        if (! $data['has_discount']) {
            $data['discount_type'] = null;
            $data['discount_value'] = null;
        }

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($menuItem->image_path);
            $data['image_path'] = $request->file('image')->store('menu-images', 'public');
        }

        unset($data['image']);

        $menuItem->update($data);

        return redirect()->route('dashboard.menu-items.index');
    }

    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        Storage::disk('public')->delete($menuItem->image_path);
        $menuItem->delete();

        return redirect()->route('dashboard.menu-items.index');
    }
}
