<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreVariantGroupRequest;
use App\Models\VariantGroup;

class VariantGroupController extends Controller
{
    public function index()
    {
        return redirect()->route('dashboard.menu-items.index');
    }

    public function store(StoreVariantGroupRequest $request)
    {
        VariantGroup::query()->create($request->validated());

        return redirect()->route('dashboard.menu-items.index');
    }

    public function update(StoreVariantGroupRequest $request, VariantGroup $variantGroup)
    {
        $variantGroup->update($request->validated());

        return redirect()->route('dashboard.menu-items.index');
    }

    public function destroy(VariantGroup $variantGroup)
    {
        $variantGroup->delete();

        return redirect()->route('dashboard.menu-items.index');
    }
}
