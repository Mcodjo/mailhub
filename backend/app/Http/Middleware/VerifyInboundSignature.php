<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Vérifie la signature HMAC-SHA256 du webhook Cloudflare Worker.
 *
 * Format attendu :
 *   Header  x-mailprohub-signature : sha256=<hex>
 *   Header  x-mailprohub-timestamp : <unix_timestamp>
 *
 * HMAC calculé sur : "{timestamp}.{raw_body}"
 * Secret           : env CLOUDFLARE_WEBHOOK_SECRET
 * Skew max         : env CLOUDFLARE_WEBHOOK_SKEW (défaut 300 s)
 */
class VerifyInboundSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = config('services.cloudflare.webhook_secret');

        // Si le secret n'est pas configuré, bloquer en prod, passer en local
        if (empty($secret)) {
            if (app()->isProduction()) {
                return $this->reject('WEBHOOK_SECRET_NOT_CONFIGURED');
            }
            return $next($request);
        }

        $signature = $request->header('x-mailprohub-signature', '');
        $timestamp  = $request->header('x-mailprohub-timestamp', '');

        if (empty($signature) || empty($timestamp)) {
            return $this->reject('MISSING_SIGNATURE_HEADERS');
        }

        // Vérification anti-rejeu : skew max configurable (défaut 5 min)
        $maxSkew = (int) config('services.cloudflare.webhook_skew', 300);
        if (abs(time() - (int) $timestamp) > $maxSkew) {
            return $this->reject('TIMESTAMP_TOO_OLD');
        }

        $rawBody  = $request->getContent();
        $expected = 'sha256=' . hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);

        // hash_equals : comparaison en temps constant (protection timing attack)
        if (! hash_equals($expected, $signature)) {
            return $this->reject('INVALID_SIGNATURE');
        }

        return $next($request);
    }

    private function reject(string $code): Response
    {
        return response()->json([
            'error' => [
                'code'    => 'INVALID_SIGNATURE',
                'message' => 'Signature de webhook invalide ou absente.',
            ],
        ], 403);
    }
}
