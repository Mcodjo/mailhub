<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\AliasController;
use App\Http\Controllers\Api\DomainController;
use App\Http\Controllers\Api\GmailController;
use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\Api\InboundMailController;
use App\Http\Controllers\Api\SendEmailController;
use App\Http\Controllers\Api\SentEmailController;
use App\Http\Controllers\Api\ThreadController;
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
| Auth — public (rate-limited : 5 tentatives/minute/IP)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
    Route::post('register',        [AuthController::class, 'register']);
    Route::post('login',           [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',  [AuthController::class, 'resetPassword']);

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
    | Emails — inbox (F05)
    | unread-count DOIT être déclaré avant {email} (sinon capturé comme ID)
    |----------------------------------------------------------------------
    */
    // Routes statiques d'abord (avant {email} pour éviter les collisions)
    Route::get('emails/unread-count',          [EmailController::class, 'unreadCount']);
    Route::post('emails/send',                 [SendEmailController::class, 'send']);
    Route::get('emails',                       [EmailController::class, 'index']);
    // Routes dynamiques
    Route::get('emails/{email}',               [EmailController::class, 'show']);
    Route::patch('emails/{email}/read',        [EmailController::class, 'markRead']);
    Route::patch('emails/{email}/unread',      [EmailController::class, 'markUnread']);
    Route::post('emails/{email}/reply',        [SendEmailController::class, 'reply']);
    Route::delete('emails/{email}',            [EmailController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Boîte Envoyés (F08)
    |----------------------------------------------------------------------
    */
    Route::get('sent',          [SentEmailController::class, 'index']);
    Route::get('sent/{sentEmail}', [SentEmailController::class, 'show']);

    /*
    |----------------------------------------------------------------------
    | Threads (conversations)
    |----------------------------------------------------------------------
    */
    Route::get('threads/{thread}', [ThreadController::class, 'show']);

    /*
    |----------------------------------------------------------------------
    | Aliases (F11)
    |----------------------------------------------------------------------
    */
    Route::get('aliases',                      [AliasController::class, 'index']);
    Route::post('domains/{domain}/aliases',    [AliasController::class, 'store']);
    Route::delete('aliases/{alias}',           [AliasController::class, 'destroy']);
});
