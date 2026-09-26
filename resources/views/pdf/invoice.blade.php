<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <title>Invoice</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            font-size: 14px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .box {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
            width: 45%;
        }

        h1 {
            font-size: 28px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }

        table th {
            background: #f3f3f3;
        }

        table th,
        table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }

        .summary {
            width: 300px;
            margin-left: auto;
            margin-top: 30px;
        }

        .summary div {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }

        .total {
            font-size: 18px;
            font-weight: bold;
            border-top: 1px solid #333;
        }

        .terms {
            margin-top: 30px;
        }

    </style>

</head>

<body>


<div class="header">

    <div>
        <h1>{{ $invoice->invoice_type }}</h1>

        <p>
            Invoice No:
            <strong>{{ $invoice->invoice_number }}</strong>
        </p>

        <p>
            Issue Date:
            {{ $invoice->issue_date }}
        </p>

        <p>
            Due Date:
            {{ $invoice->due_date }}
        </p>

    </div>


</div>



<div class="header">


    <div class="box">

        <h3>From</h3>

        @if($invoice->sender)

            <strong>
                {{ $invoice->sender->sender_name }}
            </strong>

            <p>
                {{ $invoice->sender->email }}
            </p>

            <p>
                {{ $invoice->sender->address_line_1 }}
            </p>

            <p>
                {{ $invoice->sender->city }}
            </p>

        @endif

    </div>



    <div class="box">

        <h3>To</h3>

        @if($invoice->client)

            <strong>
                {{ $invoice->client->name ?? '' }}
            </strong>

            <p>
                {{ $invoice->client->email ?? '' }}
            </p>

            <p>
                {{ $invoice->client->city ?? '' }}
            </p>

        @endif

    </div>


</div>



<table>

<thead>

<tr>

<th>
Item
</th>


<th>
Qty
</th>


<th>
Price
</th>


<th>
Tax
</th>


<th>
Total
</th>


</tr>

</thead>


<tbody>


@foreach($invoice->items as $row)


<tr>

<td>

{{ $row->item->item_name ?? '' }}

</td>


<td>

{{ $row->qty }}

</td>


<td>

${{ $row->unit_price }}

</td>


<td>

{{ $row->tax }} %

</td>


<td>

${{ $row->total }}

</td>


</tr>


@endforeach


</tbody>


</table>




<div class="summary">


<div>

<span>
Subtotal
</span>

<span>
${{ $invoice->subtotal }}
</span>

</div>



<div>

<span>
Tax
</span>

<span>
${{ $invoice->tax }}
</span>

</div>



<div class="total">

<span>
Total
</span>

<span>
${{ $invoice->total }}
</span>

</div>


</div>



@if($invoice->terms)

<div class="terms">

<h3>
Terms & Notes
</h3>

<p>
{{ $invoice->terms }}
</p>

</div>

@endif



</body>
</html>