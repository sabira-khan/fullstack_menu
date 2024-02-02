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
        Schema::table('discounts', function (Blueprint $table) {
            // Remove existing columns
            $table->dropColumn(['name', 'amount']);

            $table->decimal('discount_value');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();

            // Add foreign key constraints
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            // Reverse the changes made in the 'up' method
            $table->string('name');
            $table->decimal('amount');

            // Remove new columns and foreign key constraints
            $table->dropColumn(['discount_type', 'discount_value', 'category_id', 'item_id']);
            $table->dropForeign(['category_id']);
            $table->dropForeign(['item_id']);
        });
    }
};
