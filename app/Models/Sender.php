<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sender extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'sender_name',
        'email',
        'address_1',
        'address_2',
        'tax_registration_number',
        'postal_code',
        'city',
        'country',
        'phone_number',
        'website',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}