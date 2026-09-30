<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Item;
use App\Models\Invoice;


class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        $clientsCount = Client::where('user_id', $userId)->count();
        $itemsCount = Item::where('user_id', $userId)->count();
        $invoicesCount = Invoice::where('user_id', $userId)->count();

        // Calculate revenue
        // Total approved revenue
        $approvedRevenue = (float) Invoice::where('user_id', $userId)
            ->where('status', 'approved')
            ->sum('total');

        // Total pending amount
        $pendingRevenue = (float) Invoice::where('user_id', $userId)
            ->where('status', 'pending')
            ->sum('total');

        // Total all invoices revenue
        $totalRevenue = (float) Invoice::where('user_id', $userId)
            ->sum('total');

        // Counts per status
        $pendingCount = Invoice::where('user_id', $userId)->where('status', 'pending')->count();
        $approvedCount = Invoice::where('user_id', $userId)->where('status', 'approved')->count();
        $rejectedCount = Invoice::where('user_id', $userId)->where('status', 'rejected')->count();

        // Status filter for recent invoices table
        $statusFilter = $request->query('status');
        $invoicesQuery = Invoice::with(['client', 'sender'])
            ->where('user_id', $userId);

        if (in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
            $invoicesQuery->where('status', $statusFilter);
        }

        $recentInvoices = $invoicesQuery
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'clientsCount' => $clientsCount,
            'itemsCount' => $itemsCount,
            'invoicesCount' => $invoicesCount,
            'approvedRevenue' => round($approvedRevenue, 2),
            'pendingRevenue' => round($pendingRevenue, 2),
            'totalRevenue' => round($totalRevenue, 2),
            'statusCounts' => [
                'pending' => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
            ],
            'recentInvoices' => $recentInvoices,
            'currentFilter' => $statusFilter,
        ]);
    }
}
