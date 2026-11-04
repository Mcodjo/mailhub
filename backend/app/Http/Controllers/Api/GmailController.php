<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alias;
use App\Services\GmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GmailController extends Controller
{
    public function __construct(private GmailService $gmail) {}

    /**
     * GET /api/gmail/connect/redirect
     *
     * Retourne l'URL d'autorisation Google (scope mail complet — CDC-2).
     * Le state contient l'ID utilisateur chiffré pour identifier le callback.
     * Le frontend ouvre cette URL dans la fenêtre courante ou un popup.
     */
    public function redirect(Request $request): JsonResponse
    {
        // State signé : user_id + timestamp (anti-rejeu, pas de session serveur)
        $state = encrypt([
            'user_id' => $request->user()->id,
            'ts'      => now()->timestamp,
        ]);

        $url = Socialite::driver('google')
            ->scopes(['https://mail.google.com/'])
            ->with([
                'access_type' => 'offline',   // obtenir un refresh_token
                'prompt'      => 'consent',   // forcer le consentement pour refresh_token
                'state'       => $state,
            ])
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    /**
     * GET /api/gmail/callback
     *
     * Reçoit le code d'autorisation Google, échange contre les tokens,
     * chiffre et stocke dans gmail_tokens.
     * Redirige le frontend vers la page de configuration.
     */
    public function callback(Request $request): \Illuminate\Http\RedirectResponse
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        // Vérifier le state (anti-CSRF)
        try {
            $state = decrypt($request->query('state', ''));
        } catch (\Throwable) {
            return redirect("{$frontendUrl}/settings?gmail=error&reason=invalid_state");
        }

        // Rejeter les states trop anciens (> 10 minutes)
        if (now()->timestamp - ($state['ts'] ?? 0) > 600) {
            return redirect("{$frontendUrl}/settings?gmail=error&reason=expired_state");
        }

        $user = \App\Models\User::find($state['user_id'] ?? null);
        if (! $user) {
            return redirect("{$frontendUrl}/settings?gmail=error&reason=user_not_found");
        }

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable) {
            return redirect("{$frontendUrl}/settings?gmail=error&reason=oauth_failed");
        }

        // Vérifier le scope (CDC-2 : doit contenir https://mail.google.com/)
        $scope = $googleUser->token['scope'] ?? '';
        if (! str_contains($scope, 'https://mail.google.com/')) {
            return redirect("{$frontendUrl}/settings?gmail=error&reason=insufficient_scope");
        }

        // Stocker ou mettre à jour les tokens chiffrés
        $user->gmailToken()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'access_token'  => $googleUser->token,
                'refresh_token' => $googleUser->refreshToken,
                'expires_at'    => now()->addSeconds($googleUser->expiresIn ?? 3600),
                'scope'         => $scope,
                'revoked_at'    => null,
            ]
        );

        return redirect("{$frontendUrl}/settings?gmail=connected");
    }

    /**
     * POST /api/gmail/verify-alias
     *
     * CDC-1 — Vérifie qu'un alias est configuré "Envoyer en tant que"
     * dans le compte Gmail connecté. Met à jour send_from_verified_at.
     *
     * Body : { "alias_id": 1 }
     */
    public function verifyAlias(Request $request): JsonResponse
    {
        $data = $request->validate([
            'alias_id' => ['required', 'integer', 'exists:aliases,id'],
        ]);

        $alias = Alias::with('domain')->findOrFail($data['alias_id']);

        // Isolation : l'alias doit appartenir à l'utilisateur
        abort_if($alias->domain->user_id !== $request->user()->id, 403, 'Accès refusé.');

        $aliasEmail = $alias->local_part . '@' . $alias->domain->domain;

        try {
            $verified = $this->gmail->verifySendAs($request->user(), $aliasEmail);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error' => [
                    'code'    => 'GMAIL_OAUTH_REQUIRED',
                    'message' => 'Connectez d\'abord votre compte Gmail.',
                ],
            ], 409);
        }

        if (! $verified) {
            return response()->json([
                'error' => [
                    'code'    => 'GMAIL_ALIAS_NOT_VERIFIED',
                    'message' => "L'adresse {$aliasEmail} n'est pas configurée comme \"Envoyer en tant que\" dans votre compte Gmail. Ajoutez-la dans Paramètres › Comptes › Envoyer des e-mails en tant que, puis relancez cette vérification.",
                ],
            ], 409);
        }

        $alias->update(['send_from_verified_at' => now()]);

        return response()->json([
            'alias'   => $alias->fresh(),
            'address' => $aliasEmail,
            'message' => 'Alias vérifié. L\'envoi depuis cette adresse est activé.',
        ]);
    }

    /**
     * DELETE /api/gmail/connect
     *
     * Révoque les tokens côté Google + supprime logiquement en base.
     */
    public function disconnect(Request $request): JsonResponse
    {
        $token = $request->user()->gmailToken;

        if (! $token) {
            return response()->json(['message' => 'Aucun compte Gmail connecté.']);
        }

        $this->gmail->revokeToken($token);

        return response()->json(['message' => 'Compte Gmail déconnecté.']);
    }

    /**
     * GET /api/gmail/status — état de connexion de l'utilisateur (sans exposer les tokens)
     */
    public function status(Request $request): JsonResponse
    {
        $token = $request->user()->gmailToken;

        if (! $token || $token->isRevoked()) {
            return response()->json(['connected' => false]);
        }

        return response()->json([
            'connected'  => true,
            'expires_at' => $token->expires_at,
            'scope_ok'   => $token->hasMailScope(),
        ]);
    }
}
