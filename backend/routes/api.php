<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\AliasController;
use App\Http\Controllers\Api\DomainController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth — public
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    // OAuth Google
    Route::get('google',          [GoogleController::class, 'redirect']);
    Route::get('google/callback', [GoogleController::class, 'callback']);
});

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
    | Aliases (F11)
    |----------------------------------------------------------------------
    */
    Route::get('aliases',                      [AliasController::class, 'index']);
    Route::post('domains/{domain}/aliases',    [AliasController::class, 'store']);
    Route::delete('aliases/{alias}',           [AliasController::class, 'destroy']);
});
