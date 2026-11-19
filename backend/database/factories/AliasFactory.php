<?php

namespace Database\Factories;

use App\Models\Alias;
use App\Models\Domain;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Alias> */
class AliasFactory extends Factory
{
    protected $model = Alias::class;

    public function definition(): array
    {
        return [
            'domain_id'  => Domain::factory(),
            'local_part' => $this->faker->randomElement(['contact', 'info', 'support', 'hello']),
            'is_primary' => true,
        ];
    }
}
