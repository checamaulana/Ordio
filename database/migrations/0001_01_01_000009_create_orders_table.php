<?php

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->enum('order_type', array_column(OrderType::cases(), 'value'))->default(OrderType::DineIn->value);
            $table->foreignId('table_id')->nullable()->constrained('tables')->nullOnDelete();
            $table->enum('status', array_column(OrderStatus::cases(), 'value'))->default(OrderStatus::Diproses->value);
            $table->enum('payment_status', array_column(PaymentStatus::cases(), 'value'))->default(PaymentStatus::BelumBayar->value);
            $table->enum('payment_method', array_column(PaymentMethod::cases(), 'value'));
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('discount_total')->default(0);
            $table->unsignedInteger('tax_amount');
            $table->unsignedInteger('total');
            $table->unsignedInteger('cash_received')->nullable();
            $table->unsignedInteger('cash_change')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
