<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreVariantOptionRequest extends FormRequest
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
            'variant_group_id' => ['required', 'integer', 'exists:variant_groups,id'],
            'name' => ['required', 'string', 'max:255'],
            'additional_price' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
