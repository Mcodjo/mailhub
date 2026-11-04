<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sent_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('alias_id')->constrained()->cascadeOnDelete();
            $table->foreignId('thread_id')->nullable()->constrained()->nullOnDelete();
            // Message-ID du mail auquel on répond — maintien de conversation
            $table->string('in_reply_to')->nullable();
            $table->json('from_email');   // {email, name}
            $table->json('to_emails');    // [{email, name}, ...]
            $table->json('cc_emails')->nullable();
            $table->string('subject');
            $table->text('body_text')->nullable();
            $table->longText('body_html')->nullable();
            $table->timestamp('sent_at')->index();
            $table->timestamps();

            $table->index(['user_id', 'alias_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sent_emails');
    }
};
