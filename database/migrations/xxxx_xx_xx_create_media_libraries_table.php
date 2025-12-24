<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_libraries', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ex: "Bibliothèque Globale"
            $table->string('slug')->unique(); // ex: "default"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_libraries');
    }
};