<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
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
            'cash_received' => ['required', 'integer', 'min:0', 'max:999999999'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cash_received.required' => 'Nominal uang diterima wajib diisi.',
            'cash_received.integer' => 'Nominal uang diterima harus berupa angka.',
            'cash_received.min' => 'Nominal uang diterima tidak boleh negatif.',
            'cash_received.max' => 'Nominal uang diterima terlalu besar.',
        ];
    }
}
