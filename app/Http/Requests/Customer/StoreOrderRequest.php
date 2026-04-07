<?php

namespace App\Http\Requests\Customer;

use App\Models\MenuItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $items = collect($this->input('items', []))
            ->map(function ($item): array {
                $variantOptionIds = collect($item['variant_option_ids'] ?? [])
                    ->filter(fn ($id): bool => $id !== null && $id !== '')
                    ->map(fn ($id): int => (int) $id)
                    ->values()
                    ->all();

                return [
                    'menu_item_id' => isset($item['menu_item_id']) ? (int) $item['menu_item_id'] : null,
                    'quantity' => isset($item['quantity']) ? (int) $item['quantity'] : 1,
                    'note' => $item['note'] ?? null,
                    'variant_option_ids' => $variantOptionIds,
                ];
            })
            ->values()
            ->all();

        $this->merge([
            'items' => $items,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'payment_method' => ['required', Rule::in(['cash', 'qris'])],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'items.*.note' => ['nullable', 'string', 'max:500'],
            'items.*.variant_option_ids' => ['nullable', 'array'],
            'items.*.variant_option_ids.*' => ['integer', 'distinct', 'exists:variant_options,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $items = collect($this->input('items', []));

            if ($items->isEmpty()) {
                return;
            }

            $menuItems = MenuItem::query()
                ->with('variantGroups.variantOptions')
                ->whereIn('id', $items->pluck('menu_item_id')->all())
                ->get()
                ->keyBy('id');

            foreach ($items as $index => $item) {
                /** @var MenuItem|null $menuItem */
                $menuItem = $menuItems->get($item['menu_item_id']);

                if (! $menuItem) {
                    $validator->errors()->add("items.$index.menu_item_id", 'Menu tidak ditemukan.');

                    continue;
                }

                if (! $menuItem->is_available) {
                    $validator->errors()->add("items.$index.menu_item_id", 'Menu yang dipilih sedang habis.');

                    continue;
                }

                $selectedIds = collect($item['variant_option_ids'] ?? []);
                $menuOptionMap = $menuItem->variantGroups
                    ->flatMap(fn ($group) => $group->variantOptions)
                    ->keyBy('id');

                if ($selectedIds->contains(fn ($id): bool => ! $menuOptionMap->has($id))) {
                    $validator->errors()->add("items.$index.variant_option_ids", 'Varian tidak sesuai dengan menu.');

                    continue;
                }

                if ($menuItem->variantGroups->isEmpty()) {
                    continue;
                }

                $selectedGroupCount = $selectedIds
                    ->map(fn ($id) => $menuOptionMap->get($id)?->variant_group_id)
                    ->filter()
                    ->unique()
                    ->count();

                if ($selectedIds->count() !== $selectedGroupCount) {
                    $validator->errors()->add("items.$index.variant_option_ids", 'Setiap grup varian hanya boleh dipilih satu opsi.');
                }

                if ($selectedGroupCount !== $menuItem->variantGroups->count()) {
                    $validator->errors()->add("items.$index.variant_option_ids", 'Pilih varian untuk setiap grup yang tersedia.');
                }
            }
        });
    }
}
