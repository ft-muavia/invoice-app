<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'user_id', 'logo', 'company_name', 'country', 'first_name', 'last_name',
        'email', 'phone', 'address_line_1', 'address_line_2', 'postal_code',
        'city', 'website', 'invoice_currency', 'additional_info',
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}
}
