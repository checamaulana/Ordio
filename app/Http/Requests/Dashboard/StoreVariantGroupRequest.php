<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreVariantGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
