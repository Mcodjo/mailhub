<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alias;
use App\Models\Domain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AliasController extends Controller
{
    /** GET /api/aliases — toutes les boîtes de l'utilisateur */
    public function index(Request $request): JsonResponse
    {
        $aliases = Alias::whereHas('domain', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('domain:id,domain,status')
            ->get();

        return response()->json($aliases);
    }

    /** POST /api/domains/{domain}/aliases — ajouter un alias */
    public function store(Request $request, Domain $domain): JsonResponse
    {
        abort_if($domain->user_id !== $request->user()->id, 403, 'Accès refusé.');

        $data = $request->validate([
            'local_part' => [
                'required',
                'string',
                'max:64',
                'regex:/^[a-z0-9._-]{1,64}$/',
                // unique par domaine — vérifié en DB mais aussi ici pour message clair
            ],
            'is_primary' => ['boolean'],
        ]);

        // Un seul alias primaire par domaine
        if (! empty($data['is_primary'])) {
            $domain->aliases()->update(['is_primary' => false]);
        }

        $alias = $domain->aliases()->create([
            'local_part' => strtolower($data['local_part']),
            'is_primary' => $data['is_primary'] ?? false,
        ]);

        return response()->json($alias, 201);
    }

    /** DELETE /api/aliases/{alias} — désactive l'alias (mails conservés) */
    public function destroy(Request $request, Alias $alias): JsonResponse
    {
        abort_if($alias->domain->user_id !== $request->user()->id, 403, 'Accès refusé.');
        abort_if($alias->is_primary, 422, 'L\'alias primaire ne peut pas être supprimé directement.');

        $alias->delete();

        return response()->json(null, 204);
    }
}
