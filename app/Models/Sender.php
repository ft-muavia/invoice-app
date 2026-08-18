<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sender extends Model
{
    protected $fillable = [
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
}