<?php

namespace Tests\Feature;

use App\Models\Alias;
use App\Models\Domain;
use App\Models\Email;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Vérifie l'isolation stricte des données entre utilisateurs.
 * Un utilisateur ne doit JAMAIS voir les emails d'un autre.
 */
class EmailIsolationTest extends TestCase
{
    use RefreshDatabase;

    private function makeUserWithEmail(): array
    {
        $user   = User::factory()->create();
        $domain = Domain::factory()->create(['user_id' => $user->id, 'status' => 'active']);
        $alias  = Alias::factory()->create(['domain_id' => $domain->id]);
        $email  = Email::factory()->create([
            'user_id'  => $user->id,
            'alias_id' => $alias->id,
        ]);

        return [$user, $email];
    }

    public function test_user_cannot_list_another_users_emails(): void
    {
        [, $emailA] = $this->makeUserWithEmail();
        [$userB]    = $this->makeUserWithEmail();

        $tokenB = $userB->createToken('api')->plainTextToken;

        $response = $this->withToken($tokenB)->getJson('/api/emails');
        $response->assertOk();

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($emailA->id, $ids, 'User B should not see User A emails');
    }

    public function test_user_cannot_read_another_users_email(): void
    {
        [$userA, $emailA] = $this->makeUserWithEmail();
        [$userB]          = $this->makeUserWithEmail();

        $tokenB = $userB->createToken('api')->plainTextToken;

        $this->withToken($tokenB)
            ->getJson("/api/emails/{$emailA->id}")
            ->assertStatus(403);
    }

    public function test_user_cannot_delete_another_users_email(): void
    {
        [$userA, $emailA] = $this->makeUserWithEmail();
        [$userB]          = $this->makeUserWithEmail();

        $tokenB = $userB->createToken('api')->plainTextToken;

        $this->withToken($tokenB)
            ->deleteJson("/api/emails/{$emailA->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('emails', ['id' => $emailA->id]);
    }

    public function test_unread_count_counts_only_own_emails(): void
    {
        // User A a 1 email non lu — User B n'a aucun email
        $this->makeUserWithEmail();
        $userB = User::factory()->create();

        $tokenB = $userB->createToken('api')->plainTextToken;

        $this->withToken($tokenB)
            ->getJson('/api/emails/unread-count')
            ->assertOk()
            ->assertJson(['unread_count' => 0]);
    }
}
