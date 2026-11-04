<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alias;
use App\Models\Email;
use App\Models\SentEmail;
use App\Models\Thread;
use App\Services\GmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SendEmailController extends Controller
{
    public function __construct(private GmailService $gmail) {}

    /**
     * POST /api/emails/send
     *
     * Compose et envoie un nouvel email depuis un alias Domial.
     *
     * Body :
     * {
     *   "alias_id"  : 1,
     *   "to"        : ["recipient@example.com"],
     *   "cc"        : [],                        // optionnel
     *   "subject"   : "Objet",
     *   "body_html" : "<p>...</p>",              // au moins l'un des deux
     *   "body_text" : "..."
     * }
     */
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'alias_id'  => ['required', 'integer', 'exists:aliases,id'],
            'to'        => ['required', 'array', 'min:1'],
            'to.*'      => ['email:rfc'],
            'cc'        => ['array'],
            'cc.*'      => ['email:rfc'],
            'subject'   => ['required', 'string', 'max:988'],
            'body_html' => ['nullable', 'string'],
            'body_text' => ['nullable', 'string'],
        ]);

        $alias = $this->resolveAlias($request, $data['alias_id']);
        $fromEmail = $alias->local_part . '@' . $alias->domain->domain;

        [$sentEmail] = $this->doSend($request->user(), $alias, $fromEmail, $data);

        return response()->json($sentEmail, 201);
    }

    /**
     * POST /api/emails/{email}/reply
     *
     * Répond à un email reçu. Pré-remplit To, Subject, In-Reply-To, References.
     *
     * Body :
     * {
     *   "body_html" : "<p>...</p>",
     *   "body_text" : "...",
     *   "cc"        : []    // optionnel
     * }
     */
    public function reply(Request $request, Email $email): JsonResponse
    {
        abort_if($email->user_id !== $request->user()->id, 403, 'Accès refusé.');

        $data = $request->validate([
            'body_html' => ['nullable', 'string'],
            'body_text' => ['nullable', 'string'],
            'cc'        => ['array'],
            'cc.*'      => ['email:rfc'],
        ]);

        $email->load(['alias.domain']);
        $alias = $email->alias;
        $fromEmail = $alias->local_part . '@' . $alias->domain->domain;

        // Sujet : ajouter "Re: " si absent
        $subject = $email->subject;
        if (! preg_match('/^re\s*:/i', $subject)) {
            $subject = 'Re: ' . $subject;
        }

        $payload = array_merge($data, [
            'alias_id'      => $alias->id,
            'to'            => [$email->from_email],
            'subject'       => $subject,
            'in_reply_to'   => $email->message_id,
            'references'    => $email->message_id,
            'thread_id'     => $email->thread_id,
        ]);

        [$sentEmail] = $this->doSend($request->user(), $alias, $fromEmail, $payload);

        return response()->json($sentEmail, 201);
    }

    // -------------------------------------------------------------------------

    /**
     * Cœur de l'envoi : appelle GmailService, enregistre SentEmail.
     *
     * @return array{SentEmail, array}
     */
    private function doSend(\App\Models\User $user, Alias $alias, string $fromEmail, array $data): array
    {
        try {
            $result = $this->gmail->sendViaApi($user, [
                'from_email'     => $fromEmail,
                'from_name'      => $user->name,
                'to'             => $data['to'],
                'cc'             => $data['cc'] ?? [],
                'subject'        => $data['subject'],
                'body_html'      => $data['body_html'] ?? null,
                'body_text'      => $data['body_text'] ?? null,
                'in_reply_to'    => $data['in_reply_to'] ?? null,
                'references'     => $data['references'] ?? null,
                'gmail_thread_id'=> null, // Google crée un thread côté Gmail — on gère le nôtre
            ]);
        } catch (\RuntimeException $e) {
            $code = $e->getMessage();

            if ($code === 'GMAIL_OAUTH_REQUIRED') {
                abort(response()->json([
                    'error' => [
                        'code'    => 'GMAIL_OAUTH_REQUIRED',
                        'message' => 'Connectez d\'abord votre compte Gmail.',
                    ],
                ], 409));
            }

            abort(response()->json([
                'error' => [
                    'code'    => 'GMAIL_SEND_FAILED',
                    'message' => 'L\'envoi a échoué. Vérifiez votre connexion Gmail.',
                ],
            ], 502));
        }

        // Résolution ou création du thread Domial
        $threadId = $data['thread_id'] ?? $this->resolveOrCreateThread($alias->domain_id, $data['subject']);

        $sentEmail = SentEmail::create([
            'user_id'    => $user->id,
            'alias_id'   => $alias->id,
            'thread_id'  => $threadId,
            'in_reply_to'=> $data['in_reply_to'] ?? null,
            'from_email' => $fromEmail,
            'to_emails'  => $data['to'],
            'cc_emails'  => $data['cc'] ?? [],
            'subject'    => $data['subject'],
            'body_text'  => $data['body_text'] ?? null,
            'body_html'  => $data['body_html'] ?? null,
            'sent_at'    => now(),
        ]);

        return [$sentEmail, $result];
    }

    private function resolveAlias(Request $request, int $aliasId): Alias
    {
        $alias = Alias::with('domain')->findOrFail($aliasId);
        abort_if($alias->domain->user_id !== $request->user()->id, 403, 'Accès refusé.');

        // CDC-1 : l'alias doit être vérifié pour l'envoi
        abort_if(
            ! $alias->send_from_verified_at,
            409,
            response()->json([
                'error' => [
                    'code'    => 'ALIAS_NOT_VERIFIED',
                    'message' => "L'alias {$alias->local_part}@{$alias->domain->domain} n'est pas encore vérifié pour l'envoi. Lancez la vérification depuis les paramètres.",
                ],
            ])
        );

        return $alias;
    }

    private function resolveOrCreateThread(int $domainId, string $subject): int
    {
        $normalized = preg_replace('/^(re|fwd?)\s*:\s*/i', '', $subject);

        return Thread::firstOrCreate(
            ['domain_id' => $domainId, 'subject' => $normalized],
        )->id;
    }
}
