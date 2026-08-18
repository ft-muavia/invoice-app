import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    FileText,
    PlusCircle,
    LogOut,
} from "lucide-react";

export default function Sidebar() {
    const linkClass = (isActive) =>
        `flex items-center gap-3 px-6 py-3 transition ${
            isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 text-slate-300"
        }`;

    return (
        <aside className="fixed top-0 left-0 w-64 h-screen bg-black text-white border-r z-50">
            <div className="text-2xl font-bold p-6 border-b border-slate-700">
                Invoice App
            </div>

            <nav className="mt-5">
                <Link
                    href="/dashboard"
                    className={linkClass(route().current("dashboard"))}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    href="/clients"
                    className={linkClass(route().current("clients.*"))}
                >
                    <Users size={20} />
                    Clients
                </Link>

                <Link
                    href="/senders"
                    className={linkClass(route().current("senders.*"))}
                >
                    <Truck size={20} />
                    Senders
                </Link>

                <Link
                    href="/items"
                    className={linkClass(route().current("items.*"))}
                >
                    <Package size={20} />
                    Items
                </Link>

                <Link
                    href="/invoices"
                    className={linkClass(route().current("invoices.*") && !route().current("invoices.create"))}
                >
                    <FileText size={20} />
                    Invoices
                </Link>

                <Link
                    href="/invoices/create"
                    className={linkClass(route().current("invoices.create"))}
                >
                    <PlusCircle size={20} />
                    Create Invoice
                </Link>
            </nav>

            <div className="text-2xl font-bold border-t absolute bottom-0 w-full border-slate-700">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-red-600 transition w-full text-left"
                >
                    Logout
                    <LogOut size={20} />
                </Link>
            </div>
        </aside>
    );
}