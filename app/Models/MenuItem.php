<?php

namespace App\Models;

use App\Enums\DiscountType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'sub_category_id',
        'name',
        'price',
        'image_path',
        'is_available',
        'is_best_seller',
        'has_discount',
        'discount_type',
        'discount_value',
        'sort_order',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'discounted_price',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
            'has_discount' => 'boolean',
            'discount_value' => 'integer',
            'sort_order' => 'integer',
            'discount_type' => DiscountType::class,
        ];
    }

    public function getDiscountedPriceAttribute(): ?int
    {
        if (! $this->has_discount || ! $this->discount_type || ! $this->discount_value) {
            return null;
        }

        if ($this->discount_type === DiscountType::Percentage) {
            return max(0, (int) round($this->price - (($this->price * $this->discount_value) / 100)));
        }

        return max(0, $this->price - $this->discount_value);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function variantGroups(): HasMany
    {
        return $this->hasMany(VariantGroup::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
