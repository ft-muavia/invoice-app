<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;
     protected $fillable = [
        'user_id',
        'logo',
        'invoice_type',
        'invoice_number',
        'issue_date',
        'due_date',
        'sender_id',
        'sender_info',
        'client_id',
        'client_info',
        'description',
        'item_id',
        'item_description',
        'currency',
        'subtotal',
        'tax',
        'total',
        'terms',
    ];

    public function sender()
    {
        return $this->belongsTo(Sender::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
