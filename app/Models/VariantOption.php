<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VariantOption extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'variant_group_id',
        'name',
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

    public function variantGroup(): BelongsTo
    {
        return $this->belongsTo(VariantGroup::class);
    }
}
