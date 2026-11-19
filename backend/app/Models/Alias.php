<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alias extends Model
{
    use HasFactory;
    protected $fillable = [
        'domain_id',
        'local_part',
        'is_primary',
        'send_from_verified_at',
    ];

    protected $casts = [
        'is_primary'            => 'boolean',
        'send_from_verified_at' => 'datetime',
    ];

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

    /** Adresse complète : local_part@domain */
    public function getAddressAttribute(): string
    {
        return $this->local_part . '@' . $this->domain->domain;
    }
}
