<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Sender;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{

    public function index()
    {
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
        $items = Item::with(['user'])->where('user_id', Auth::id())->get();
        $senders = Sender::with(['user'])->where('user_id', Auth::id())->get();

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
            'terms' => 'nullable|string',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
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

        $user_id = Auth::id();
        $invoice = Invoice::create([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'sender_id' => $validated['sender_id'] ?? null,
            'terms' => $validated['terms'] ?? null,
            'description' => $validated['description'] ?? null,
            'user_id' => $user_id,
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
        $invoice = Invoice::with(['items', 'client', 'sender'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        $items = Item::with(['user'])->where('user_id', Auth::id())->get();

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'items' => $items,
        ]);
    }

    public function show($id)
    {
        $invoice = Invoice::with(['items.item', 'client', 'sender'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
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
            'terms' => 'nullable|string',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        $invoice = Invoice::with(['client', 'sender'])->where('user_id', Auth::id())->findOrFail($id);

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

        $invoice->update([
            'invoice_type' => $validated['invoice_type'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'client_id' => $validated['client_id'] ?? null,
            'sender_id' => $validated['sender_id'] ?? null,
            'terms' => $validated['terms'] ?? $invoice->terms,
            'description' => $validated['description'] ?? $invoice->description,
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
        $invoice = Invoice::with(['items'])->where('user_id', Auth::id())->findOrFail($id);

        $invoice->items()->delete();

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    public function downloadPdf($id)
    {
        $invoice = Invoice::with([
            'client',
            'sender',
            'items.item'
        ])
        ->where('user_id', Auth::id())
        ->findOrFail($id);


        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice
        ]);


        return $pdf->download(
            'invoice-'.$invoice->invoice_number.'.pdf'
        );
    }

}
