<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemVariant extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_item_id',
        'variant_group_name',
        'variant_option_name',
        'additional_price',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'additional_price' => 'integer',
        ];
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
