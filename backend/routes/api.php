<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\AliasController;
use App\Http\Controllers\Api\DomainController;
use App\Http\Controllers\Api\GmailController;
use App\Http\Controllers\Api\InboundMailController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Webhook Cloudflare Worker — inbound mail (F03)
|--------------------------------------------------------------------------
| Exempté de CSRF, protégé par HMAC-SHA256 (VerifyInboundSignature).
*/
Route::post('inbound-mail', [InboundMailController::class, 'receive'])
    ->middleware('inbound.signature');

/*
|--------------------------------------------------------------------------
| Auth — public
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    // OAuth Google (auth compte)
    Route::get('google',          [GoogleController::class, 'redirect']);
    Route::get('google/callback', [GoogleController::class, 'callback']);
});

// Callback Gmail OAuth — public, le navigateur y atterrit après consentement Google
Route::get('gmail/callback', [GmailController::class, 'callback']);

/*
|--------------------------------------------------------------------------
| Auth — protégé Sanctum
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    /*
    |----------------------------------------------------------------------
    | Domaines & Wizard DNS (F02)
    |----------------------------------------------------------------------
    */
    Route::get('domains',                                    [DomainController::class, 'index']);
    Route::post('domains',                                   [DomainController::class, 'store']);
    Route::get('domains/{domain}',                           [DomainController::class, 'show']);
    Route::delete('domains/{domain}',                        [DomainController::class, 'destroy']);
    Route::get('domains/{domain}/dns',                       [DomainController::class, 'dnsRecords']);
    Route::post('domains/{domain}/dns/verify',               [DomainController::class, 'verifyDns']);
    Route::post('domains/{domain}/cloudflare/connect',       [DomainController::class, 'connectCloudflare']);
    Route::post('domains/{domain}/activate',                 [DomainController::class, 'activate']);

    /*
    |----------------------------------------------------------------------
    | Gmail OAuth (F04 + CDC-1 + CDC-2)
    |----------------------------------------------------------------------
    */
    Route::prefix('gmail')->group(function () {
        Route::get('connect/redirect', [GmailController::class, 'redirect']);
        Route::post('verify-alias',    [GmailController::class, 'verifyAlias']);
        Route::delete('connect',       [GmailController::class, 'disconnect']);
        Route::get('status',           [GmailController::class, 'status']);
    });

    // Callback public (redirige le navigateur après OAuth, pas de Sanctum)
    // défini hors du groupe auth:sanctum ci-dessous

    /*
    |----------------------------------------------------------------------
    | Aliases (F11)
    |----------------------------------------------------------------------
    */
    Route::get('aliases',                      [AliasController::class, 'index']);
    Route::post('domains/{domain}/aliases',    [AliasController::class, 'store']);
    Route::delete('aliases/{alias}',           [AliasController::class, 'destroy']);
});
