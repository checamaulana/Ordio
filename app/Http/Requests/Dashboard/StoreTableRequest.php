<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<int, \Illuminate\Contracts\Validation\ValidationRule|string>|string>
     */
    public function rules(): array
    {
        return [
            'number' => ['required', 'integer', 'min:1', 'max:9999', Rule::unique('tables', 'number')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'number.required' => 'Nomor meja wajib diisi.',
            'number.integer' => 'Nomor meja harus berupa angka.',
            'number.min' => 'Nomor meja minimal 1.',
            'number.max' => 'Nomor meja maksimal 9999.',
            'number.unique' => 'Nomor meja sudah digunakan.',
        ];
    }
}
