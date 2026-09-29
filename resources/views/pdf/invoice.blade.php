<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 25px 30px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #2d3748;
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table {
            margin-bottom: 25px;
        }
        .invoice-title {
            font-size: 26px;
            font-weight: bold;
            color: #1a202c;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0;
        }
        .meta-text {
            color: #718096;
            font-size: 12px;
            margin-top: 4px;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            background-color: #ebf8ff;
            color: #2b6cb0;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .parties-table {
            margin-bottom: 25px;
        }
        .parties-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 16px;
            vertical-align: top;
        }
        .parties-card h3 {
            margin: 0 0 8px 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #4a5568;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }
        .party-name {
            font-size: 14px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 3px;
        }
        .party-detail {
            color: #4a5568;
            font-size: 12px;
            margin: 2px 0;
        }
        .items-table {
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #2b6cb0;
            color: #ffffff;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
            padding: 9px 12px;
            text-align: left;
        }
        .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
        }
        .items-table tr:nth-child(even) td {
            background-color: #fcfdfd;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .summary-container {
            width: 100%;
            margin-top: 15px;
        }
        .summary-table {
            width: 280px;
            float: right;
            margin-bottom: 20px;
        }
        .summary-table td {
            padding: 6px 10px;
            font-size: 13px;
        }
        .summary-table .total-row td {
            font-size: 15px;
            font-weight: bold;
            border-top: 2px solid #2b6cb0;
            color: #1a202c;
            padding-top: 8px;
        }
        .notes-section {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            clear: both;
        }
        .notes-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #4a5568;
            margin-bottom: 6px;
        }
        .notes-text {
            color: #718096;
            font-size: 12px;
            white-space: pre-line;
            line-height: 1.5;
        }
        .footer {
            margin-top: 35px;
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            border-top: 1px solid #edf2f7;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    @php
        $calcSubtotal = 0;
        $calcTax = 0;
        foreach ($invoice->items as $itemRow) {
            $rowSub = (float)$itemRow->qty * (float)$itemRow->unit_price;
            $calcSubtotal += $rowSub;
            $calcTax += ($rowSub * (float)($itemRow->tax ?? 0)) / 100;
        }
        $subtotal = !is_null($invoice->subtotal) ? (float)$invoice->subtotal : $calcSubtotal;
        $taxTotal = !is_null($invoice->tax) ? (float)$invoice->tax : $calcTax;
        $grandTotal = !is_null($invoice->total) ? (float)$invoice->total : ($subtotal + $taxTotal);

        $senderName = $invoice->sender?->sender_name 
            ?: trim(($invoice->sender?->first_name ?? '') . ' ' . ($invoice->sender?->last_name ?? ''))
            ?: 'Business Sender';

        $clientName = trim(($invoice->client?->first_name ?? '') . ' ' . ($invoice->client?->last_name ?? ''))
            ?: ($invoice->client?->company_name ?? 'Client / Recipient');
    @endphp

    {{-- Header --}}
    <table class="header-table">
        <tr>
            <td style="width: 55%; vertical-align: top;">
                <div class="invoice-title">{{ $invoice->invoice_type ?: 'INVOICE' }}</div>
                <div class="meta-text">
                    <strong>Invoice #:</strong> {{ $invoice->invoice_number }}
                </div>
            </td>
            <td style="width: 45%; text-align: right; vertical-align: top;">
                <div class="meta-text"><strong>Issue Date:</strong> {{ $invoice->issue_date }}</div>
                <div class="meta-text"><strong>Due Date:</strong> {{ $invoice->due_date }}</div>
                @if($invoice->status)
                    <div style="margin-top: 5px;">
                        <span class="badge">{{ $invoice->status }}</span>
                    </div>
                @endif
            </td>
        </tr>
    </table>

    {{-- Sender & Client Cards --}}
    <table class="parties-table">
        <tr>
            <td class="parties-card" style="width: 48%;">
                <h3>From (Sender)</h3>
                <div class="party-name">{{ $senderName }}</div>
                @if($invoice->sender?->email)
                    <div class="party-detail">{{ $invoice->sender->email }}</div>
                @endif
                @if($invoice->sender?->phone_number)
                    <div class="party-detail">Phone: {{ $invoice->sender->phone_number }}</div>
                @endif
                @if($invoice->sender?->address_1)
                    <div class="party-detail">{{ $invoice->sender->address_1 }}</div>
                @endif
                @if($invoice->sender?->city || $invoice->sender?->country)
                    <div class="party-detail">
                        {{ implode(', ', array_filter([$invoice->sender?->city, $invoice->sender?->postal_code, $invoice->sender?->country])) }}
                    </div>
                @endif
                @if($invoice->sender?->tax_registration_number)
                    <div class="party-detail">Tax ID: {{ $invoice->sender->tax_registration_number }}</div>
                @endif
            </td>

            <td style="width: 4%;"></td>

            <td class="parties-card" style="width: 48%;">
                <h3>Bill To (Client)</h3>
                <div class="party-name">{{ $clientName }}</div>
                @if($invoice->client?->company_name && $invoice->client?->company_name !== $clientName)
                    <div class="party-detail"><strong>{{ $invoice->client->company_name }}</strong></div>
                @endif
                @if($invoice->client?->email)
                    <div class="party-detail">{{ $invoice->client->email }}</div>
                @endif
                @if($invoice->client?->phone)
                    <div class="party-detail">Phone: {{ $invoice->client->phone }}</div>
                @endif
                @if($invoice->client?->address_line_1)
                    <div class="party-detail">{{ $invoice->client->address_line_1 }}</div>
                @endif
                @if($invoice->client?->city || $invoice->client?->country)
                    <div class="party-detail">
                        {{ implode(', ', array_filter([$invoice->client?->city, $invoice->client?->postal_code, $invoice->client?->country])) }}
                    </div>
                @endif
            </td>
        </tr>
    </table>

    {{-- Line Items --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 45%;">Item / Description</th>
                <th class="text-center" style="width: 12%;">Qty</th>
                <th class="text-right" style="width: 15%;">Unit Price</th>
                <th class="text-center" style="width: 12%;">Tax</th>
                <th class="text-right" style="width: 16%;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @forelse($invoice->items as $row)
                <tr>
                    <td>
                        <strong>{{ $row->item?->item_name ?? ($row->description ?: 'Item') }}</strong>
                        @if($row->description && $row->item?->item_name)
                            <div style="font-size: 11px; color: #718096;">{{ $row->description }}</div>
                        @endif
                    </td>
                    <td class="text-center">{{ $row->qty }}</td>
                    <td class="text-right">${{ number_format((float)$row->unit_price, 2) }}</td>
                    <td class="text-center">{{ $row->tax ? $row->tax . '%' : '—' }}</td>
                    <td class="text-right">${{ number_format((float)$row->total, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="color: #a0aec0; padding: 20px;">
                        No items found on this invoice.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Financial Summary --}}
    <div class="summary-container">
        <table class="summary-table">
            <tr>
                <td style="color: #718096;">Subtotal</td>
                <td class="text-right">${{ number_format($subtotal, 2) }}</td>
            </tr>
            <tr>
                <td style="color: #718096;">Tax</td>
                <td class="text-right">${{ number_format($taxTotal, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Total</td>
                <td class="text-right">${{ number_format($grandTotal, 2) }}</td>
            </tr>
        </table>
    </div>

    {{-- Terms & Notes --}}
    @if($invoice->terms)
        <div class="notes-section">
            <div class="notes-title">Terms & Notes</div>
            <div class="notes-text">{{ $invoice->terms }}</div>
        </div>
    @endif

    <div class="footer">
        Thank you for your business!
    </div>

</body>
</html>