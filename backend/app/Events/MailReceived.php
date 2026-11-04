<?php

namespace App\Events;

use App\Models\Email;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Diffusé sur le canal privé de l'utilisateur quand un mail est reçu.
 * Canal : private-user.{user_id}  (Reverb / fallback polling /api/emails/unread-count)
 */
class MailReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Email $email) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('user.' . $this->email->user_id);
    }

    public function broadcastAs(): string
    {
        return 'mail.received';
    }

    /** Données minimales exposées au frontend — jamais le corps complet */
    public function broadcastWith(): array
    {
        return [
            'id'          => $this->email->id,
            'alias_id'    => $this->email->alias_id,
            'from_email'  => $this->email->from_email,
            'from_name'   => $this->email->from_name,
            'subject'     => $this->email->subject,
            'is_read'     => false,
            'received_at' => $this->email->received_at->toISOString(),
        ];
    }
}
