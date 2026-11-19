<?php

namespace Database\Factories;

use App\Models\Alias;
use App\Models\Email;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Email> */
class EmailFactory extends Factory
{
    protected $model = Email::class;

    public function definition(): array
    {
        return [
            'user_id'    => User::factory(),
            'alias_id'   => Alias::factory(),
            'message_id' => '<' . $this->faker->uuid() . '@example.com>',
            'from_email' => $this->faker->email(),
            'from_name'  => $this->faker->name(),
            'subject'    => $this->faker->sentence(5),
            'body_text'  => $this->faker->paragraph(),
            'headers'    => [],
            'is_read'    => false,
            'received_at'=> now(),
        ];
    }
}
