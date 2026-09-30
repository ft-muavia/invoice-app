<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use App\Models\Sender;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;

class SenderController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Sender::class);

        $senders = Sender::with('user')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Senders/Index', [
            'senders' => $senders,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Sender::class);

        return Inertia::render('Senders/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Sender::class);

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
        $validateData['user_id'] = Auth::id();
        
        Sender::create($validateData);

        return inertia()->location(route('senders.index'));
    }

    public function edit($id)
    {
        $sender = Sender::with('user')->findOrFail($id);
        Gate::authorize('view', $sender);

        return Inertia::render('Senders/Edit', ['sender' => $sender]);
    }

    public function update(Request $request, $id)
    {
        $sender = Sender::with('user')->findOrFail($id);
        Gate::authorize('update', $sender);

        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'sender_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:senders,email,' . $sender->id,
            'phone_number' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'address_1' => 'nullable|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'tax_registration_number' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo from storage if it exists
            if ($sender->logo && Storage::disk('public')->exists($sender->logo)) {
                Storage::disk('public')->delete($sender->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $sender->update($validated);

        return redirect()->route('senders.index')->with('success', 'Sender updated successfully.');
    }

    public function destroy($id)
    {
        $sender = Sender::with('user')->findOrFail($id);
        Gate::authorize('delete', $sender);

        // Before deleting sender, ensure all associated invoices have a sender_info snapshot
        $invoices = Invoice::with('user')->where('sender_id', $sender->id)->get();
        foreach ($invoices as $inv) {
            if (empty($inv->sender_info)) {
                $inv->update([
                    'sender_info' => [
                        'id' => $sender->id,
                        'sender_name' => $sender->sender_name,
                        'first_name' => $sender->first_name,
                        'last_name' => $sender->last_name,
                        'name' => $sender->sender_name ?: trim(($sender->first_name ?? '') . ' ' . ($sender->last_name ?? '')),
                        'email' => $sender->email,
                        'phone_number' => $sender->phone_number,
                        'address_1' => $sender->address_1,
                        'address_2' => $sender->address_2,
                        'city' => $sender->city,
                        'postal_code' => $sender->postal_code,
                        'country' => $sender->country,
                        'tax_registration_number' => $sender->tax_registration_number,
                    ],
                ]);
            }
        }

        // Clean up logo from storage
        if ($sender->logo && Storage::disk('public')->exists($sender->logo)) {
            Storage::disk('public')->delete($sender->logo);
        }

        $sender->delete();

        return redirect()->route('senders.index')->with('success', 'Sender deleted successfully.');
    }
}
