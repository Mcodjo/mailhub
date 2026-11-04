<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use App\Services\DnsRecordService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DomainController extends Controller
{
    public function __construct(private DnsRecordService $dns) {}

    /** POST /api/domains — enregistre un nouveau domaine */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'domain' => [
                'required',
                'string',
                'max:255',
                // FQDN simple : lettres, chiffres, tirets, points, au moins un point
                'regex:/^(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i',
                'unique:domains,domain',
            ],
        ]);

        $domain = $request->user()->domains()->create([
            'domain' => strtolower($data['domain']),
            'status' => 'pending',
        ]);

        return response()->json([
            'domain'  => $domain,
            'records' => $this->dns->expectedRecords($domain),
        ], 201);
    }

    /** GET /api/domains — liste les domaines de l'utilisateur */
    public function index(Request $request): JsonResponse
    {
        $domains = $request->user()
            ->domains()
            ->withCount('aliases')
            ->latest()
            ->get();

        return response()->json($domains);
    }

    /** GET /api/domains/{domain} */
    public function show(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);

        return response()->json($domain->load('aliases'));
    }

    /** GET /api/domains/{domain}/dns — enregistrements attendus */
    public function dnsRecords(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);

        return response()->json([
            'domain'  => $domain->domain,
            'records' => $this->dns->expectedRecords($domain),
        ]);
    }

    /** POST /api/domains/{domain}/dns/verify — vérifie la propagation */
    public function verifyDns(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);

        $result = $this->dns->verify($domain);

        if ($result['all_verified'] && $domain->status === 'dns_pending') {
            $domain->update([
                'status'          => 'verified',
                'dns_verified_at' => now(),
            ]);
        } elseif ($domain->status === 'pending') {
            $domain->update(['status' => 'dns_pending']);
        }

        return response()->json([
            'domain'       => $domain->fresh(),
            'records'      => $result['records'],
            'all_verified' => $result['all_verified'],
        ]);
    }

    /** POST /api/domains/{domain}/cloudflare/connect — stocke le token CF chiffré */
    public function connectCloudflare(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);

        $data = $request->validate([
            'token'   => ['required', 'string', 'min:20'],
            'zone_id' => ['required', 'string', 'size:32'],
        ]);

        $domain->update([
            'cloudflare_token'   => $data['token'],   // encrypted cast
            'cloudflare_zone_id' => $data['zone_id'],
        ]);

        return response()->json(['message' => 'Token Cloudflare enregistré.']);
    }

    /** POST /api/domains/{domain}/activate — activation finale */
    public function activate(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);

        if ($domain->status !== 'verified') {
            return response()->json([
                'error' => [
                    'code'    => 'DOMAIN_DNS_NOT_PROPAGATED',
                    'message' => 'Les enregistrements DNS doivent être vérifiés avant l\'activation.',
                ],
            ], 409);
        }

        if ($domain->aliases()->where('send_from_verified_at', '!=', null)->doesntExist()) {
            return response()->json([
                'error' => [
                    'code'    => 'GMAIL_ALIAS_NOT_VERIFIED',
                    'message' => 'Au moins un alias doit être vérifié dans Gmail avant l\'activation.',
                ],
            ], 409);
        }

        $domain->update(['status' => 'active']);

        return response()->json(['domain' => $domain]);
    }

    /** DELETE /api/domains/{domain} */
    public function destroy(Request $request, Domain $domain): JsonResponse
    {
        $this->authorizeOwner($request, $domain);
        $domain->delete();

        return response()->json(null, 204);
    }

    // -------------------------------------------------------------------------

    private function authorizeOwner(Request $request, Domain $domain): void
    {
        abort_if($domain->user_id !== $request->user()->id, 403, 'Accès refusé.');
    }
}
