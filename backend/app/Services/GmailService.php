<?php

namespace App\Services;

use App\Models\GmailToken;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Gestion des tokens Gmail OAuth2 et des appels API associés.
 *
 * Règles de sécurité (SECURITY.md) :
 *  - Scope limité à https://mail.google.com/ — aucun appel de lecture Gmail
 *  - Tokens jamais dans les logs (Http::withoutRedirecting + no-log)
 *  - access_token / refresh_token jamais exposés en réponse API
 */
class GmailService
{
    /**
     * Retourne un access token valide pour l'utilisateur.
     * Rafraîchit automatiquement si expiré.
     *
     * @throws RuntimeException GMAIL_OAUTH_REQUIRED si absent ou révoqué
     */
    public function getValidAccessToken(User $user): string
    {
        $token = $user->gmailToken;

        if (! $token || $token->isRevoked()) {
            throw new RuntimeException('GMAIL_OAUTH_REQUIRED');
        }

        if ($token->isExpired()) {
            $token = $this->refreshAccessToken($token);
        }

        return $token->access_token; // decrypté par le cast
    }

    /**
     * Rafraîchit l'access token via refresh_token.
     * Met à jour la ligne en base. En cas d'échec, révoque logiquement.
     */
    public function refreshAccessToken(GmailToken $token): GmailToken
    {
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id'     => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $token->refresh_token,
            'grant_type'    => 'refresh_token',
        ]);

        if ($response->failed()) {
            // Le refresh_token a été révoqué côté Google
            $token->update(['revoked_at' => now()]);
            throw new RuntimeException('GMAIL_OAUTH_REQUIRED');
        }

        $data = $response->json();

        $token->update([
            'access_token' => $data['access_token'],
            'expires_at'   => now()->addSeconds((int) $data['expires_in']),
        ]);

        return $token->fresh();
    }

    /**
     * CDC-1 — Vérifie que l'alias est configuré comme "Envoyer en tant que"
     * dans le compte Gmail connecté.
     *
     * Appelle Gmail API : GET /gmail/v1/users/me/settings/sendAs/{aliasEmail}
     * Retourne true uniquement si verificationStatus === 'accepted'.
     */
    public function verifySendAs(User $user, string $aliasEmail): bool
    {
        $accessToken = $this->getValidAccessToken($user);

        $response = Http::withToken($accessToken)
            ->get("https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/{$aliasEmail}");

        if ($response->failed()) {
            return false;
        }

        return ($response->json('verificationStatus') ?? '') === 'accepted';
    }

    /**
     * Révoque le token côté Google puis marque la ligne comme révoquée en base.
     */
    public function revokeToken(GmailToken $token): void
    {
        // Tente la révocation Google (best-effort — on continue même en échec réseau)
        Http::asForm()->post('https://oauth2.googleapis.com/revoke', [
            'token' => $token->access_token,
        ]);

        $token->update(['revoked_at' => now()]);
    }

    /**
     * Génère la chaîne XOAUTH2 pour SMTP (base64 du format SASL).
     * Utilisée lors de l'envoi via smtp.gmail.com:587.
     */
    public function buildXoauth2String(string $userEmail, string $accessToken): string
    {
        return base64_encode("user={$userEmail}\x01auth=Bearer {$accessToken}\x01\x01");
    }
}
