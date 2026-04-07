<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\TableStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'tables';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'number',
        'status',
        'qr_code_path',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TableStatus::class,
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function hasUnpaidOrder(): bool
    {
        return $this->orders()
            ->where('status', OrderStatus::Diproses)
            ->where('payment_status', '!=', PaymentStatus::SudahBayar)
            ->exists();
    }
}
