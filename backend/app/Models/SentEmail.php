<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SentEmail extends Model
{
    protected $fillable = [
        'user_id',
        'alias_id',
        'thread_id',
        'in_reply_to',
        'from_email',
        'to_emails',
        'cc_emails',
        'subject',
        'body_text',
        'body_html',
        'sent_at',
    ];

    protected $casts = [
        'from_email' => 'array',
        'to_emails'  => 'array',
        'cc_emails'  => 'array',
        'sent_at'    => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function alias(): BelongsTo
    {
        return $this->belongsTo(Alias::class);
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
