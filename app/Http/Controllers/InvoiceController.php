<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Sender;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['client', 'sender'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }
    public function create()
    {
        $items = Item::where('user_id', auth()->id())->get();
        $senders = Sender::where('user_id', auth()->id())->get();

        return Inertia::render('Invoices/Create', [
            'items' => $items,
            'senders' => $senders,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_type' => 'required|string',
            'invoice_number' => 'required|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'client_id' => 'nullable|exists:clients,id',
            'sender_id' => 'nullable|exists:senders,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.tax' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
        ]);
        $user_id = auth()->id();
        $invoice = Invoice::create([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'sender_id' => $validated['sender_id'] ?? null,
            'user_id' => $user_id,
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'item_id' => $item['item_id'],
                'qty' => $item['qty'],
                'unit_price' => $item['unit_price'],
                'tax' => $item['tax'] ?? 0,
                'total' => $item['total'],
            ]);
        }

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully.');
    }
     // Edit Page dikhane ke liye
    public function edit($id)
    {
        $invoice = Invoice::with(['items', 'client', 'sender'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $items = Item::where('user_id', auth()->id())->get();

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'items' => $items,
        ]);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'invoice_type' => 'required|string',
            'invoice_number' => 'required|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'client_id' => 'nullable|exists:clients,id',
            'sender_id' => 'nullable|exists:senders,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.tax' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
        ]);
        // صرف موجودہ user اپنا invoice update کر سکتا ہے
        $invoice = Invoice::where('user_id', auth()->id())
            ->findOrFail($id);
        $invoice->update([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'sender_id' => $validated['sender_id'] ?? null,
        ]);
        // پرانے invoice items delete کریں
        $invoice->items()->delete();
        // نئے items add کریں
        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'item_id' => $item['item_id'],
                'qty' => $item['qty'],
                'unit_price' => $item['unit_price'],
                'tax' => $item['tax'] ?? 0,
                'total' => $item['total'],
            ]);
        }
        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }
    public function show($id)
    {
        $invoice = Invoice::with(['items.item', 'client', 'sender'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);
        return Inertia::render('Invoices/View', [
            'invoice' => $invoice,
        ]);
    }

}
