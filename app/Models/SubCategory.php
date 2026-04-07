<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubCategory extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'sort_order',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}
