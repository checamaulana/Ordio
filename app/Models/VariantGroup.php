<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VariantGroup extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'menu_item_id',
        'name',
    ];

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function variantOptions(): HasMany
    {
        return $this->hasMany(VariantOption::class);
    }
}
