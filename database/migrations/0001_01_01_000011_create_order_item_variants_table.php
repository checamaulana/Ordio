<?php

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
        Schema::create('order_item_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
            $table->string('variant_group_name');
            $table->string('variant_option_name');
            $table->unsignedInteger('additional_price')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_variants');
    }
};
