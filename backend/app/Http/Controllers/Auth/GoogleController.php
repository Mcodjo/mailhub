<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    public function callback(): JsonResponse
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'name'              => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'email_verified_at' => now(),
                // password reste null — compte Google uniquement
            ]
        );

        // Si un compte email existe déjà sans google_id, on le lie
        if (! $user->wasRecentlyCreated && is_null($user->google_id)) {
            $user->update(['google_id' => $googleUser->getId()]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('api')->plainTextToken;

        // Redirige le frontend avec le token en fragment
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }
}
