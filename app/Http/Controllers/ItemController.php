<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{

    public function index()
    {
        Gate::authorize('viewAny', Item::class);

        $items = Item::with('user')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Items/Index', [
            'items' => $items,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Item::class);

        return Inertia::render('Items/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Item::class);

        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'qty' => 'nullable|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
        ]);

        $validated['user_id'] = Auth::id();

        Item::create($validated);

        return redirect()->route('items.index')->with('success', 'Item created successfully.');
    }

    public function edit($id)
    {
        $item = Item::findOrFail($id);
        Gate::authorize('view', $item);

        return Inertia::render('Items/Edit', [
            'item' => $item,
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        Gate::authorize('update', $item);

        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'qty' => 'nullable|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
        ]);

        $item->update($validated);

        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        Gate::authorize('delete', $item);

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }
}
