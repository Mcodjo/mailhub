<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Thread extends Model
{
    protected $fillable = ['domain_id', 'subject'];

    public function domain(): BelongsTo
    {
        return $this->belongsTo(Domain::class);
    }

    public function emails(): HasMany
    {
        return $this->hasMany(Email::class);
    }

    public function sentEmails(): HasMany
    {
        return $this->hasMany(SentEmail::class);
    }
}
