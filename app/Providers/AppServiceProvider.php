<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\Invoice;
use App\Models\Client;
use App\Models\Sender;
use App\Models\Item;
use App\Policies\InvoicePolicy;
use App\Policies\ClientPolicy;
use App\Policies\SenderPolicy;
use App\Policies\ItemPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(Client::class, ClientPolicy::class);
        Gate::policy(Sender::class, SenderPolicy::class);
        Gate::policy(Item::class, ItemPolicy::class);
    }
}
