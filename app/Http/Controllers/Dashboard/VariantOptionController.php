<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreVariantOptionRequest;
use App\Models\VariantOption;

class VariantOptionController extends Controller
{
    public function index()
    {
        return redirect()->route('dashboard.menu-items.index');
    }

    public function store(StoreVariantOptionRequest $request)
    {
        VariantOption::query()->create($request->validated());

        return redirect()->route('dashboard.menu-items.index');
    }

    public function update(StoreVariantOptionRequest $request, VariantOption $variantOption)
    {
        $variantOption->update($request->validated());

        return redirect()->route('dashboard.menu-items.index');
    }

    public function destroy(VariantOption $variantOption)
    {
        $variantOption->delete();

        return redirect()->route('dashboard.menu-items.index');
    }
}
