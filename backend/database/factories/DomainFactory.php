<?php

namespace Database\Factories;

use App\Models\Domain;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Domain> */
class DomainFactory extends Factory
{
    protected $model = Domain::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'domain'      => $this->faker->unique()->domainName(),
            'status'      => 'active',
            'worker_status' => 'deployed',
        ];
    }
}
