<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SenderController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\InvoiceController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // clients route
    Route::resource('clients', ClientController::class)->except('show');
    // sender route
    Route::resource('senders', SenderController::class)->except('show');
    // items route
    Route::resource('items', ItemController::class)->except('show');
    // invoices route
    Route::resource('invoices', InvoiceController::class);
    Route::get('/invoices/{id}/pdf', [InvoiceController::class,'downloadPdf'])->name('invoices.pdf');
});

require __DIR__.'/auth.php';
