<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->index();
            $table->string('domain')->unique(); // FQDN lowercase
            $table->enum('status', ['pending', 'dns_pending', 'verified', 'active', 'failed'])
                  ->default('pending');
            $table->text('cloudflare_token')->nullable();     // AES-256 encrypted cast
            $table->string('cloudflare_zone_id')->nullable();
            $table->enum('worker_status', ['not_deployed', 'deployed', 'failed'])
                  ->default('not_deployed');
            $table->timestamp('dns_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('domains');
    }
};
