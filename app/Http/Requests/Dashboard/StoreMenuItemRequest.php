<?php

namespace App\Http\Requests\Dashboard;

use App\Enums\DiscountType;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_available' => $this->boolean('is_available', true),
            'is_best_seller' => $this->boolean('is_best_seller'),
            'has_discount' => $this->boolean('has_discount'),
            'sort_order' => $this->input('sort_order', 0),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $imageRequired = $this->isMethod('POST') ? 'required' : 'nullable';

        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_id' => [
                'nullable',
                'integer',
                Rule::exists('sub_categories', 'id')->where(function (Builder $query): void {
                    $query->where('category_id', $this->integer('category_id'));
                }),
            ],
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'image' => [$imageRequired, 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'is_available' => ['boolean'],
            'is_best_seller' => ['boolean'],
            'has_discount' => ['boolean'],
            'discount_type' => [
                'nullable',
                Rule::in(array_column(DiscountType::cases(), 'value')),
                Rule::requiredIf(fn (): bool => $this->boolean('has_discount')),
            ],
            'discount_value' => [
                'nullable',
                'integer',
                'min:0',
                Rule::requiredIf(fn (): bool => $this->boolean('has_discount')),
            ],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
