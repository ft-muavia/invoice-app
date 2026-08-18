<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{

    public function index()
    {
        $items = Item::latest()->get();

        return Inertia::render('Items/Index', [
            'items' => $items,
        ]);
    }

    public function create()
    {
        return Inertia::render('Items/Create');
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'item_name' => 'required|string|max:255',
            'qty' => 'nullable|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
        ]);

        $validateData['user_id'] = auth()->id();
        
        Item::create($validateData);

        return inertia()->location(route('items.index'));
    }
}
