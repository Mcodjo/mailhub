<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SentEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SentEmailController extends Controller
{
    /**
     * GET /api/sent
     *
     * Liste paginée des emails envoyés par l'utilisateur.
     *
     * Query params :
     *   alias_id  int  — filtrer par alias
     *   per_page  int  — 10–100 (défaut 25)
     *   page      int
     */
    public function index(Request $request): JsonResponse
    {
        $query = SentEmail::forUser($request->user()->id)
            ->with(['alias:id,local_part,domain_id', 'alias.domain:id,domain'])
            ->orderByDesc('sent_at');

        if ($aliasId = $request->integer('alias_id')) {
            $query->where('alias_id', $aliasId);
        }

        $query->select([
            'id', 'alias_id', 'thread_id', 'in_reply_to',
            'from_email', 'to_emails', 'cc_emails',
            'subject', 'sent_at',
        ]);

        $perPage = max(10, min(100, (int) $request->input('per_page', 25)));

        return response()->json($query->paginate($perPage));
    }

    /**
     * GET /api/sent/{sentEmail}
     *
     * Email envoyé complet avec corps HTML/texte.
     */
    public function show(Request $request, SentEmail $sentEmail): JsonResponse
    {
        abort_if($sentEmail->user_id !== $request->user()->id, 403, 'Accès refusé.');

        $sentEmail->load(['alias:id,local_part,domain_id', 'alias.domain:id,domain', 'thread:id,subject']);

        return response()->json($sentEmail);
    }
}
