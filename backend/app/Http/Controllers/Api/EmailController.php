<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Email;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    /**
     * GET /api/emails
     *
     * Liste paginée des emails de l'utilisateur.
     *
     * Query params :
     *   alias_id   int    — filtrer par alias
     *   thread_id  int    — filtrer par thread
     *   unread     bool   — 1/true = non lus seulement
     *   per_page   int    — 10–100 (défaut 25)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Email::forUser($request->user()->id)
            ->with(['alias:id,local_part,domain_id', 'alias.domain:id,domain'])
            ->orderByDesc('received_at');

        if ($aliasId = $request->integer('alias_id')) {
            $query->where('alias_id', $aliasId);
        }

        if ($threadId = $request->integer('thread_id')) {
            $query->where('thread_id', $threadId);
        }

        if (filter_var($request->input('unread'), FILTER_VALIDATE_BOOLEAN)) {
            $query->unread();
        }

        // Corps exclu de la liste (trop lourd) — disponible sur GET /emails/{id}
        $query->select([
            'id', 'alias_id', 'thread_id', 'message_id',
            'from_email', 'from_name', 'subject',
            'attachments_count', 'is_read', 'received_at',
        ]);

        $perPage = max(10, min(100, (int) $request->input('per_page', 25)));

        return response()->json($query->paginate($perPage));
    }

    /**
     * GET /api/emails/unread-count
     *
     * Compteur non-lus (polling fallback côté frontend quand Reverb n'est pas dispo).
     * Retourné en tête de route avant {id} pour éviter la collision.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Email::forUser($request->user()->id)->unread()->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * GET /api/emails/{email}
     *
     * Email complet avec corps HTML/texte.
     */
    public function show(Request $request, Email $email): JsonResponse
    {
        $this->authorizeOwner($request, $email);

        $email->load(['alias:id,local_part,domain_id', 'alias.domain:id,domain', 'thread:id,subject']);

        return response()->json($email);
    }

    /**
     * PATCH /api/emails/{email}/read
     *
     * Marque un email comme lu (idempotent).
     */
    public function markRead(Request $request, Email $email): JsonResponse
    {
        $this->authorizeOwner($request, $email);

        $email->update(['is_read' => true]);

        return response()->json(['id' => $email->id, 'is_read' => true]);
    }

    /**
     * PATCH /api/emails/{email}/unread
     *
     * Marque un email comme non lu (idempotent).
     */
    public function markUnread(Request $request, Email $email): JsonResponse
    {
        $this->authorizeOwner($request, $email);

        $email->update(['is_read' => false]);

        return response()->json(['id' => $email->id, 'is_read' => false]);
    }

    /**
     * DELETE /api/emails/{email}
     */
    public function destroy(Request $request, Email $email): JsonResponse
    {
        $this->authorizeOwner($request, $email);

        $email->delete();

        return response()->json(null, 204);
    }

    // -------------------------------------------------------------------------

    private function authorizeOwner(Request $request, Email $email): void
    {
        abort_if($email->user_id !== $request->user()->id, 403, 'Accès refusé.');
    }
}
