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
        Schema::create('variant_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_group_id')->constrained('variant_groups')->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('additional_price')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_options');
    }
};
