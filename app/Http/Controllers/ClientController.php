<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Invoice;
use Inertia\Inertia;


class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('user')
            ->withCount('invoices')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'company_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
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
        
        Client::create($validateData);

        return inertia()->location(route('clients.index'));
    }

    public function edit($id)
    {
        $client = Client::findOrFail($id);

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validateData = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'company_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email,' . $client->id,
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

        $client->update($validateData);

        return inertia()->location(route('clients.index'));
    }

    public function destroy($id)
    {
        $client = Client::where('user_id', auth()->id())->findOrFail($id);

        // Before deleting the client, ensure all associated invoices have a client_info snapshot
        $invoices = Invoice::where('client_id', $client->id)->get();
        foreach ($invoices as $inv) {
            if (empty($inv->client_info)) {
                $inv->update([
                    'client_info' => [
                        'id' => $client->id,
                        'first_name' => $client->first_name,
                        'last_name' => $client->last_name,
                        'name' => trim($client->first_name . ' ' . $client->last_name),
                        'company_name' => $client->company_name,
                        'email' => $client->email,
                        'phone' => $client->phone,
                        'address_line_1' => $client->address_line_1,
                        'address_line_2' => $client->address_line_2,
                        'city' => $client->city,
                        'postal_code' => $client->postal_code,
                        'country' => $client->country,
                    ],
                ]);
            }
        }

        $client->delete();

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }
}
