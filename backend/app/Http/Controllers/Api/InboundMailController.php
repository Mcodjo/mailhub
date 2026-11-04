<?php

namespace App\Http\Controllers\Api;

use App\Events\MailReceived;
use App\Http\Controllers\Controller;
use App\Models\Alias;
use App\Models\Email;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InboundMailController extends Controller
{
    /**
     * POST /api/inbound-mail
     *
     * Reçoit un mail du Worker Cloudflare (signature déjà vérifiée par middleware).
     * Payload attendu :
     * {
     *   "message_id"       : "<unique@domain>",
     *   "from_email"       : "sender@example.com",
     *   "from_name"        : "Sender Name",           // optionnel
     *   "to"               : "contact@mondomaine.fr",
     *   "subject"          : "Objet du mail",
     *   "body_text"        : "...",                    // optionnel
     *   "body_html"        : "...",                    // optionnel
     *   "headers"          : {},
     *   "attachments_count": 0,
     *   "in_reply_to"      : "<id@domain>",            // optionnel — thread
     *   "received_at"      : "2026-11-04T12:00:00Z"
     * }
     */
    public function receive(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message_id'        => ['required', 'string', 'max:998'],
            'from_email'        => ['required', 'email:rfc'],
            'from_name'         => ['nullable', 'string', 'max:255'],
            'to'                => ['required', 'email:rfc'],
            'subject'           => ['required', 'string', 'max:988'],
            'body_text'         => ['nullable', 'string'],
            'body_html'         => ['nullable', 'string'],
            'headers'           => ['nullable', 'array'],
            'attachments_count' => ['integer', 'min:0', 'max:9999'],
            'in_reply_to'       => ['nullable', 'string', 'max:998'],
            'received_at'       => ['required', 'date'],
        ]);

        // Résoudre l'alias destinataire
        [$localPart, $domainName] = $this->parseAddress($data['to']);

        $alias = Alias::with('domain.user')
            ->whereHas('domain', fn ($q) => $q->where('domain', $domainName)->where('status', 'active'))
            ->where('local_part', $localPart)
            ->first();

        if (! $alias) {
            // Domaine ou alias inconnu — on accepte quand même (202) pour éviter
            // que le Worker retente indéfiniment
            return response()->json(['status' => 'alias_not_found'], 202);
        }

        $user = $alias->domain->user;

        // Idempotence : rejeter les doublons silencieusement (202)
        if (Email::where('user_id', $user->id)->where('message_id', $data['message_id'])->exists()) {
            return response()->json(['status' => 'duplicate'], 202);
        }

        // Résolution ou création du thread
        $threadId = $this->resolveThread($user->id, $alias->domain_id, $data);

        $email = Email::create([
            'user_id'           => $user->id,
            'alias_id'          => $alias->id,
            'thread_id'         => $threadId,
            'message_id'        => $data['message_id'],
            'from_email'        => $data['from_email'],
            'from_name'         => $data['from_name'] ?? null,
            'subject'           => $data['subject'],
            'body_text'         => $data['body_text'] ?? null,
            'body_html'         => $data['body_html'] ?? null,
            'headers'           => $data['headers'] ?? [],
            'attachments_count' => $data['attachments_count'] ?? 0,
            'is_read'           => false,
            'received_at'       => $data['received_at'],
        ]);

        // Notification temps réel (Reverb) — fallback polling 30 s côté client
        MailReceived::dispatch($email);

        return response()->json(['status' => 'stored', 'id' => $email->id], 201);
    }

    // -------------------------------------------------------------------------

    /** Sépare "contact@mondomaine.fr" en ["contact", "mondomaine.fr"] */
    private function parseAddress(string $address): array
    {
        $parts = explode('@', strtolower(trim($address)), 2);
        return [$parts[0] ?? '', $parts[1] ?? ''];
    }

    /**
     * Résout le thread :
     * - Si in_reply_to correspond à un mail existant → même thread
     * - Sinon, cherche un thread par sujet normalisé sur le domaine
     * - Sinon, crée un nouveau thread
     */
    private function resolveThread(int $userId, int $domainId, array $data): ?int
    {
        // 1. Réponse à un message connu
        if (! empty($data['in_reply_to'])) {
            $parent = Email::forUser($userId)
                ->where('message_id', $data['in_reply_to'])
                ->value('thread_id');

            if ($parent) {
                return $parent;
            }
        }

        // 2. Sujet normalisé (retire Re:/Fwd: en début)
        $subject = preg_replace('/^(re|fwd?)\s*:\s*/i', '', $data['subject']);

        $existing = Thread::where('domain_id', $domainId)
            ->where('subject', $subject)
            ->latest()
            ->value('id');

        if ($existing) {
            return $existing;
        }

        // 3. Nouveau thread
        return Thread::create([
            'domain_id' => $domainId,
            'subject'   => $subject,
        ])->id;
    }
}
