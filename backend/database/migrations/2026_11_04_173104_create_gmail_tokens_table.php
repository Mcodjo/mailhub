<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gmail_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->text('access_token');   // AES-256 encrypted cast
            $table->text('refresh_token');  // AES-256 encrypted cast
            $table->timestamp('expires_at');
            // doit contenir https://mail.google.com/ (CDC-2)
            $table->string('scope');
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gmail_tokens');
    }
};
