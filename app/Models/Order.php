<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'order_type',
        'table_id',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'discount_total',
        'tax_amount',
        'total',
        'cash_received',
        'cash_change',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_type' => OrderType::class,
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'payment_method' => PaymentMethod::class,
            'subtotal' => 'integer',
            'discount_total' => 'integer',
            'tax_amount' => 'integer',
            'total' => 'integer',
            'cash_received' => 'integer',
            'cash_change' => 'integer',
        ];
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
