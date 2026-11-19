<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Domain extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'domain',
        'status',
        'cloudflare_token',
        'cloudflare_zone_id',
        'worker_status',
        'dns_verified_at',
    ];

    protected $casts = [
        'cloudflare_token' => 'encrypted',
        'dns_verified_at'  => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function aliases(): HasMany
    {
        return $this->hasMany(Alias::class);
    }

    public function threads(): HasMany
    {
        return $this->hasMany(Thread::class);
    }
}
