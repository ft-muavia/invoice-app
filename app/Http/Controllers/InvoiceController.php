<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Sender;
use App\Models\Client;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
{

    public function index()
    {
        Gate::authorize('viewAny', Invoice::class);

        $invoices = Invoice::with(['client', 'sender'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Invoice::class);

        $items = Item::where('user_id', Auth::id())->get();
        $senders = Sender::where('user_id', Auth::id())->get();
        $clients = Client::where('user_id', Auth::id())->get();

        return Inertia::render('Invoices/Create', [
            'items' => $items,
            'senders' => $senders,
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Invoice::class);

        $userId = Auth::id();

        $validated = $request->validate([
            'invoice_type' => 'required|string',
            'invoice_number' => 'required|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'client_id' => [
                'nullable',
                Rule::exists('clients', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'sender_id' => [
                'nullable',
                Rule::exists('senders', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'status' => 'nullable|string|in:pending,approved,rejected',
            'terms' => 'nullable|string',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => [
                'required',
                Rule::exists('items', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        $calcSubtotal = 0;
        $calcTax = 0;
        $calcTotal = 0;
        $processedItems = [];

        foreach ($validated['items'] as $item) {
            $qty = (float)$item['qty'];
            $unitPrice = (float)$item['unit_price'];
            $taxRate = (float)($item['tax'] ?? 0);

            $lineSubtotal = round($qty * $unitPrice, 2);
            $lineTax = round(($lineSubtotal * $taxRate) / 100, 2);
            $lineTotal = round($lineSubtotal + $lineTax, 2);

            $calcSubtotal += $lineSubtotal;
            $calcTax += $lineTax;
            $calcTotal += $lineTotal;

            $processedItems[] = [
                'item_id' => $item['item_id'],
                'qty' => $qty,
                'unit_price' => $unitPrice,
                'tax' => $taxRate,
                'description' => $item['description'] ?? null,
                'subtotal' => $lineSubtotal,
                'total' => $lineTotal,
            ];
        }

        $clientInfo = null;
        if (!empty($validated['client_id'])) {
            $client = Client::where('user_id', $userId)->find($validated['client_id']);
            if ($client) {
                $clientInfo = [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => trim(($client->first_name ?? '') . ' ' . ($client->last_name ?? '')),
                    'company_name' => $client->company_name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'address_line_1' => $client->address_line_1,
                    'address_line_2' => $client->address_line_2,
                    'city' => $client->city,
                    'postal_code' => $client->postal_code,
                    'country' => $client->country,
                ];
            }
        }

        $senderInfo = null;
        if (!empty($validated['sender_id'])) {
            $sender = Sender::where('user_id', $userId)->find($validated['sender_id']);
            if ($sender) {
                $senderInfo = [
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
                ];
            }
        }

        $invoice = Invoice::create([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'client_info' => $clientInfo,
            'sender_id' => $validated['sender_id'] ?? null,
            'sender_info' => $senderInfo,
            'terms' => $validated['terms'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'pending',
            'user_id' => $userId,
            'subtotal' => round($calcSubtotal, 2),
            'tax' => round($calcTax, 2),
            'total' => round($calcTotal, 2),
        ]);

        foreach ($processedItems as $itemData) {
            $invoice->items()->create($itemData);
        }

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully.');
    }

    // Edit Page dikhane ke liye
    public function edit($id)
    {
        $invoice = Invoice::with(['items', 'client', 'sender'])->findOrFail($id);
        Gate::authorize('view', $invoice);

        $items = Item::where('user_id', Auth::id())->get();
        $senders = Sender::where('user_id', Auth::id())->get();
        $clients = Client::where('user_id', Auth::id())->get();

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'items' => $items,
            'senders' => $senders,
            'clients' => $clients,
        ]);
    }

    public function show($id)
    {
        $invoice = Invoice::with(['items.item', 'client', 'sender'])->findOrFail($id);
        Gate::authorize('view', $invoice);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'invoice_type' => 'required|string',
            'invoice_number' => 'required|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'client_id' => [
                'nullable',
                Rule::exists('clients', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'sender_id' => [
                'nullable',
                Rule::exists('senders', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'status' => 'nullable|string|in:pending,approved,rejected',
            'terms' => 'nullable|string',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => [
                'required',
                Rule::exists('items', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        $invoice = Invoice::with(['client', 'sender'])->findOrFail($id);
        Gate::authorize('update', $invoice);

        $calcSubtotal = 0;
        $calcTax = 0;
        $calcTotal = 0;
        $processedItems = [];

        foreach ($validated['items'] as $item) {
            $qty = (float)$item['qty'];
            $unitPrice = (float)$item['unit_price'];
            $taxRate = (float)($item['tax'] ?? 0);

            $lineSubtotal = round($qty * $unitPrice, 2);
            $lineTax = round(($lineSubtotal * $taxRate) / 100, 2);
            $lineTotal = round($lineSubtotal + $lineTax, 2);

            $calcSubtotal += $lineSubtotal;
            $calcTax += $lineTax;
            $calcTotal += $lineTotal;

            $processedItems[] = [
                'item_id' => $item['item_id'],
                'qty' => $qty,
                'unit_price' => $unitPrice,
                'tax' => $taxRate,
                'description' => $item['description'] ?? null,
                'subtotal' => $lineSubtotal,
                'total' => $lineTotal,
            ];
        }

        $clientInfo = $invoice->client_info;
        if (!empty($validated['client_id'])) {
            $client = Client::where('user_id', $userId)->find($validated['client_id']);
            if ($client) {
                $clientInfo = [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => trim(($client->first_name ?? '') . ' ' . ($client->last_name ?? '')),
                    'company_name' => $client->company_name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'address_line_1' => $client->address_line_1,
                    'address_line_2' => $client->address_line_2,
                    'city' => $client->city,
                    'postal_code' => $client->postal_code,
                    'country' => $client->country,
                ];
            }
        } elseif (array_key_exists('client_id', $validated) && is_null($validated['client_id'])) {
            $clientInfo = null;
        }

        $senderInfo = $invoice->sender_info;
        if (!empty($validated['sender_id'])) {
            $sender = Sender::where('user_id', $userId)->find($validated['sender_id']);
            if ($sender) {
                $senderInfo = [
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
                ];
            }
        } elseif (array_key_exists('sender_id', $validated) && is_null($validated['sender_id'])) {
            $senderInfo = null;
        }

        $invoice->update([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'client_info' => $clientInfo,
            'sender_id' => $validated['sender_id'] ?? null,
            'sender_info' => $senderInfo,
            'terms' => $validated['terms'] ?? $invoice->terms,
            'description' => $validated['description'] ?? $invoice->description,
            'status' => $validated['status'] ?? $invoice->status ?? 'pending',
            'subtotal' => round($calcSubtotal, 2),
            'tax' => round($calcTax, 2),
            'total' => round($calcTotal, 2),
        ]);

        $invoice->items()->delete();

        foreach ($processedItems as $itemData) {
            $invoice->items()->create($itemData);
        }

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }
    public function destroy($id)
    {
        $invoice = Invoice::with(['items'])->findOrFail($id);
        Gate::authorize('delete', $invoice);

        if ($invoice->logo && Storage::disk('public')->exists($invoice->logo)) {
            Storage::disk('public')->delete($invoice->logo);
        }

        $invoice->items()->delete();
        $invoice->delete();

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $invoice = Invoice::findOrFail($id);
        Gate::authorize('updateStatus', $invoice);

        $invoice->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Invoice status updated to ' . ucfirst($validated['status']));
    }

    public function downloadPdf($id)
    {
        $invoice = Invoice::with([
            'client',
            'sender',
            'items.item'
        ])->findOrFail($id);

        Gate::authorize('downloadPdf', $invoice);

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice
        ]);

        return $pdf->download(
            'invoice-'.$invoice->invoice_number.'.pdf'
        );
    }

}
