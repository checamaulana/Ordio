<?php

use App\Enums\DiscountType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->nullOnDelete();
            $table->string('name');
            $table->unsignedInteger('price');
            $table->string('image_path', 500);
            $table->boolean('is_available')->default(true);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('has_discount')->default(false);
            $table->enum('discount_type', array_column(DiscountType::cases(), 'value'))->nullable();
            $table->unsignedInteger('discount_value')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
