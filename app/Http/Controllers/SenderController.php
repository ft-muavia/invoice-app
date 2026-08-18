<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sender;

class SenderController extends Controller
{
    public function index()
    {
        $senders = Sender::latest()->get();

        return Inertia::render('Senders/Index', [
            'senders' => $senders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Senders/Create');
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'sender_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:senders,email',
            'phone' => 'nullable|string|max:20',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'invoice_currency' => 'nullable|string|max:255',
            'additional_info' => 'nullable|string',
        ]);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validateData['logo'] = $logoPath;
        }
        $validateData['user_id'] = auth()->id();
        
        Sender::create($validateData);

        return inertia()->location(route('senders.index'));
    }

    public function edit($id){
        $sender = Sender::findOrFail($id);
        return Inertia::render('Senders/Edit',['sender' => $sender,]);
    }

    public function update(Request $request, $id)
{
    $sender = Sender::findOrFail($id);

    $validated = $request->validate([
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'sender_name' => 'nullable|string',
        'email' => 'nullable|email',
        'phone_number' => 'nullable|string',
        'country' => 'nullable|string',
    ]);

    $sender->update($validated);

    return redirect()->route('senders.index')->with('success', 'Sender updated successfully.');
}
}
