<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Item;
use App\Models\Invoice;


class DashboardController extends Controller
{
    public function index()
    {
        $clientsCount = Client::where('user_id', auth()->id())->count();
        $itemsCount = Item::where('user_id', auth()->id())->count();
        $invoicesCount = Invoice::where('user_id', auth()->id())->count();

        return Inertia::render('Dashboard',props: [
            'clientsCount' => $clientsCount,
            'itemsCount' => $itemsCount,
            'invoicesCount' => $invoicesCount,
        ]);
    }
}
