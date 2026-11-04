<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('alias_id')->constrained()->cascadeOnDelete();
            $table->foreignId('thread_id')->nullable()->constrained()->nullOnDelete();
            // Message-ID RFC — unique par user pour idempotence webhook
            $table->string('message_id');
            $table->string('from_email');
            $table->string('from_name')->nullable();
            $table->string('subject');
            $table->longText('body_text')->nullable();
            $table->longText('body_html')->nullable();
            $table->json('headers');
            $table->unsignedSmallInteger('attachments_count')->default(0);
            $table->boolean('is_read')->default(false);
            $table->timestamp('received_at');
            // chemin brut RFC pour parsing différé / audit sécurité
            $table->string('raw_email_path')->nullable();
            $table->timestamps();

            // idempotence webhook : un message_id par user
            $table->unique(['user_id', 'message_id']);

            // index perf < 1s (DATA.md)
            $table->index(['alias_id', 'received_at']);
            $table->index(['user_id', 'is_read', 'received_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
