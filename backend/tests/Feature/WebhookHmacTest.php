<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Vérifie la protection HMAC-SHA256 du webhook /api/inbound-mail.
 */
class WebhookHmacTest extends TestCase
{
    use RefreshDatabase;

    private string $secret = 'test-webhook-secret-32-chars-long!';

    private function payload(): array
    {
        return [
            'message_id'  => '<test-' . uniqid() . '@example.com>',
            'from_email'  => 'sender@example.com',
            'from_name'   => 'Test Sender',
            'to'          => 'contact@unknowndomain.example',
            'subject'     => 'Test webhook',
            'body_text'   => 'Hello',
            'headers'     => [],
            'received_at' => now()->toISOString(),
        ];
    }

    private function sign(string $body, int $timestamp): string
    {
        return 'sha256=' . hash_hmac('sha256', $timestamp . '.' . $body, $this->secret);
    }

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.cloudflare.webhook_secret' => $this->secret]);
    }

    public function test_webhook_with_valid_signature_is_accepted(): void
    {
        $body      = json_encode($this->payload());
        $timestamp = time();

        $this->call(
            'POST',
            '/api/inbound-mail',
            [],
            [],
            [],
            [
                'CONTENT_TYPE'                     => 'application/json',
                'HTTP_ACCEPT'                      => 'application/json',
                'HTTP_X_MAILPROHUB_SIGNATURE'      => $this->sign($body, $timestamp),
                'HTTP_X_MAILPROHUB_TIMESTAMP'      => (string) $timestamp,
            ],
            $body,
        )->assertStatus(202); // 202 car l'alias n'existe pas — alias_not_found
    }

    public function test_webhook_without_signature_is_rejected(): void
    {
        $this->postJson('/api/inbound-mail', $this->payload())
            ->assertStatus(403);
    }

    public function test_webhook_with_wrong_signature_is_rejected(): void
    {
        $body      = json_encode($this->payload());
        $timestamp = time();

        $this->call(
            'POST',
            '/api/inbound-mail',
            [],
            [],
            [],
            [
                'CONTENT_TYPE'                     => 'application/json',
                'HTTP_ACCEPT'                      => 'application/json',
                'HTTP_X_MAILPROHUB_SIGNATURE'      => 'sha256=invalidsignature',
                'HTTP_X_MAILPROHUB_TIMESTAMP'      => (string) $timestamp,
            ],
            $body,
        )->assertStatus(403);
    }

    public function test_webhook_with_old_timestamp_is_rejected(): void
    {
        $body      = json_encode($this->payload());
        $timestamp = time() - 400; // > 300s skew

        $this->call(
            'POST',
            '/api/inbound-mail',
            [],
            [],
            [],
            [
                'CONTENT_TYPE'                     => 'application/json',
                'HTTP_ACCEPT'                      => 'application/json',
                'HTTP_X_MAILPROHUB_SIGNATURE'      => $this->sign($body, $timestamp),
                'HTTP_X_MAILPROHUB_TIMESTAMP'      => (string) $timestamp,
            ],
            $body,
        )->assertStatus(403);
    }
}
