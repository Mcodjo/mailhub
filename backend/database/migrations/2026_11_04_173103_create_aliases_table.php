<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aliases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domain_id')->constrained()->cascadeOnDelete();
            // préfixe avant @ : regex ^[a-z0-9._-]{1,64}$ validé en app
            $table->string('local_part', 64);
            $table->boolean('is_primary')->default(false);
            // date du test "Envoyer en tant que" Gmail réussi (CDC-1)
            $table->timestamp('send_from_verified_at')->nullable();
            $table->timestamps();

            // un alias est unique par domaine
            $table->unique(['domain_id', 'local_part']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aliases');
    }
};
