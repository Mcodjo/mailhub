<?php

namespace App\Services;

use App\Models\Domain;

/**
 * Génère les enregistrements DNS attendus pour Cloudflare Email Routing
 * et vérifie leur propagation via dns_get_record().
 */
class DnsRecordService
{
    // MX Cloudflare Email Routing
    private const CF_MX = [
        ['host' => 'route1.mx.cloudflare.net', 'priority' => 36],
        ['host' => 'route2.mx.cloudflare.net', 'priority' => 70],
        ['host' => 'route3.mx.cloudflare.net', 'priority' => 69],
    ];

    private const CF_SPF = 'v=spf1 include:_spf.mx.cloudflare.net ~all';

    /**
     * Retourne le tableau des enregistrements DNS à créer chez le registrar.
     *
     * @return array<int, array{type:string, name:string, value:string, priority?:int, ttl:int, status:string}>
     */
    public function expectedRecords(Domain $domain): array
    {
        $d = $domain->domain;

        $records = [];

        // MX × 3
        foreach (self::CF_MX as $mx) {
            $records[] = [
                'type'     => 'MX',
                'name'     => $d,
                'value'    => $mx['host'],
                'priority' => $mx['priority'],
                'ttl'      => 3600,
                'status'   => 'pending',
            ];
        }

        // SPF (TXT sur la racine)
        $records[] = [
            'type'   => 'TXT',
            'name'   => $d,
            'value'  => self::CF_SPF,
            'ttl'    => 3600,
            'status' => 'pending',
        ];

        // DMARC (TXT sur _dmarc.domain)
        $records[] = [
            'type'   => 'TXT',
            'name'   => "_dmarc.{$d}",
            'value'  => "v=DMARC1; p=none; rua=mailto:dmarc@{$d}",
            'ttl'    => 3600,
            'status' => 'pending',
        ];

        // DKIM : fourni par Cloudflare après activation Email Routing
        $records[] = [
            'type'   => 'TXT',
            'name'   => "domial._domainkey.{$d}",
            'value'  => '(fourni par Cloudflare après connexion)',
            'ttl'    => 3600,
            'status' => 'waiting_cf',
        ];

        return $records;
    }

    /**
     * Vérifie la propagation DNS pour chaque enregistrement attendu.
     * Retourne les mêmes enregistrements avec status 'ok' | 'pending' | 'error'.
     *
     * @return array{records: array, all_verified: bool}
     */
    public function verify(Domain $domain): array
    {
        $records  = $this->expectedRecords($domain);
        $verified = 0;
        $total    = 0;

        foreach ($records as &$record) {
            if ($record['status'] === 'waiting_cf') {
                // DKIM pas encore disponible avant connexion CF
                continue;
            }

            $total++;
            $record['status'] = match ($record['type']) {
                'MX'  => $this->checkMx($record['name'], $record['value'])  ? 'ok' : 'pending',
                'TXT' => $this->checkTxt($record['name'], $record['value']) ? 'ok' : 'pending',
                default => 'pending',
            };

            if ($record['status'] === 'ok') {
                $verified++;
            }
        }

        return [
            'records'      => $records,
            'all_verified' => $total > 0 && $verified >= $total,
        ];
    }

    // -------------------------------------------------------------------------

    private function checkMx(string $name, string $expected): bool
    {
        $results = @dns_get_record($name, DNS_MX) ?: [];
        foreach ($results as $r) {
            if (isset($r['target']) && strtolower($r['target']) === strtolower($expected)) {
                return true;
            }
        }
        return false;
    }

    private function checkTxt(string $name, string $expected): bool
    {
        $results = @dns_get_record($name, DNS_TXT) ?: [];
        foreach ($results as $r) {
            $txt = $r['txt'] ?? implode('', $r['entries'] ?? []);
            if (str_starts_with(trim($txt), explode(';', $expected)[0])) {
                return true;
            }
        }
        return false;
    }
}
