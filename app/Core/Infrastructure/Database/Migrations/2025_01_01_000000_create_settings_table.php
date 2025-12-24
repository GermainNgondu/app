<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            
            $table->string('group')->index(); // ex: 'general', 'mail', 'seo'
            $table->string('key')->unique();  // ex: 'app_name'
            
            $table->text('value')->nullable(); // On stocke tout en texte
            
            // Permet de caster la valeur à la sortie (string, integer, boolean, array)
            $table->string('type')->default('string'); 
            
            $table->string('description')->nullable(); // Pour l'UI Admin
            $table->boolean('is_locked')->default(false); // Si true, impossible de supprimer via UI
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};