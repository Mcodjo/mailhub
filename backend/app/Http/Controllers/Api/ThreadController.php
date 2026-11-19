<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    /**
     * GET /api/threads/{thread}
     *
     * Retourne le thread avec tous ses messages (reçus + envoyés) triés par date.
     * L'utilisateur ne peut voir que les threads de ses propres domaines.
     */
    public function show(Request $request, Thread $thread): JsonResponse
    {
        // Autorisation : le thread appartient à un domaine de l'utilisateur
        $thread->load('domain');
        abort_if(
            $thread->domain && $thread->domain->user_id !== $request->user()->id,
            403,
            'Accès refusé.'
        );

        $userId = $request->user()->id;

        // Emails reçus du thread
        $received = $thread->emails()
            ->where('user_id', $userId)
            ->with(['alias:id,local_part,domain_id', 'alias.domain:id,domain'])
            ->get()
            ->map(fn ($e) => array_merge($e->toArray(), ['_type' => 'received', '_time' => $e->received_at]));

        // Emails envoyés du thread
        $sent = $thread->sentEmails()
            ->where('user_id', $userId)
            ->with(['alias:id,local_part,domain_id', 'alias.domain:id,domain'])
            ->get()
            ->map(fn ($e) => array_merge($e->toArray(), ['_type' => 'sent', '_time' => $e->sent_at]));

        $messages = $received->concat($sent)
            ->sortBy('_time')
            ->values();

        return response()->json([
            'thread'   => $thread->only(['id', 'domain_id', 'subject', 'created_at']),
            'messages' => $messages,
        ]);
    }
}
