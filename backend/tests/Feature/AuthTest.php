<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_user_and_returns_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Alice Dupont',
            'email'                 => 'alice@example.com',
            'password'              => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

        $this->assertDatabaseHas('users', ['email' => 'alice@example.com']);
    }

    public function test_register_rejects_weak_password(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Bob',
            'email'                 => 'bob@example.com',
            'password'              => 'allowercase',
            'password_confirmation' => 'allowercase',
        ])->assertStatus(422);
    }

    public function test_login_returns_token(): void
    {
        $user = User::factory()->create(['password' => bcrypt('Password123')]);

        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'Password123',
        ])->assertOk()->assertJsonStructure(['token']);
    }

    public function test_login_rejects_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('Password123')]);

        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'WrongPassword1',
        ])->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
    }

    public function test_logout_revokes_token(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        // Le token est supprimé de la base — plus aucun jeton pour cet utilisateur
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
