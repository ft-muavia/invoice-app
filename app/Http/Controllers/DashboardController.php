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
        $clientsCount = Client::count();
        $itemsCount = Item::count();
        $invoicesCount = Invoice::count();

        return Inertia::render('Dashboard',props: [
            'clientsCount' => Client::count(),
            'itemsCount' => Item::count(),
            'invoicesCount' => Invoice::count(),
        ]);
    }
}
