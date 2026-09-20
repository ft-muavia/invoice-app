<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'user_id',
        'item_name',
        'qty',
        'unit_price',
        'tax',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
