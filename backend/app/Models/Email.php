<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Email extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'alias_id',
        'thread_id',
        'message_id',
        'from_email',
        'from_name',
        'subject',
        'body_text',
        'body_html',
        'headers',
        'attachments_count',
        'is_read',
        'received_at',
        'raw_email_path',
    ];

    protected $casts = [
        'headers'          => 'array',
        'is_read'          => 'boolean',
        'received_at'      => 'datetime',
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

    /** Scope isolation stricte — toute lecture passe par là */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('is_read', false);
    }
}
