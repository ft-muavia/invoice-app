import React from "react";
import Layout from "@/Components/Layout";
import { Link, router } from "@inertiajs/react";
import {
    Users,
    Package,
    FileText,
    DollarSign,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Download,
    Pencil,
    Filter,
    PlusCircle,
    ArrowUpRight,
} from "lucide-react";

export default function Dashboard(props) {
    const {
        clientsCount = 0,
        itemsCount = 0,
        invoicesCount = 0,
        approvedRevenue = 0,
        pendingRevenue = 0,
        totalRevenue = 0,
        statusCounts = { pending: 0, approved: 0, rejected: 0 },
        recentInvoices = [],
        currentFilter = null,
    } = props;

    const handleStatusChange = (invoiceId, newStatus) => {
        router.patch(
            route("invoices.status", invoiceId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleFilterChange = (status) => {
        if (currentFilter === status) {
            router.get(route("dashboard"), {}, { preserveScroll: true });
        } else {
            router.get(
                route("dashboard"),
                { status: status },
                { preserveScroll: true }
            );
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(val || 0);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Approved
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle size={13} className="text-rose-500" />
                        Rejected
                    </span>
                );
            case "pending":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={13} className="text-amber-500" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Overview of your invoices, status performance, and live revenue.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route("invoices.create")}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow transition"
                        >
                            <PlusCircle size={18} />
                            Create Invoice
                        </Link>
                    </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Approved Revenue (Live) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-emerald-300 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                                Realized Revenue
                            </span>
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                <DollarSign size={22} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-3">
                            {formatCurrency(approvedRevenue)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            From approved invoices
                        </p>
                    </div>

                    {/* Pending Amount */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-amber-300 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                                Pending Pipeline
                            </span>
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                                <Clock size={22} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-3">
                            {formatCurrency(pendingRevenue)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Awaiting approval
                        </p>
                    </div>

                    {/* Total Invoices */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                                Total Invoices
                            </span>
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText size={22} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-3">
                            {invoicesCount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Gross: {formatCurrency(totalRevenue)}
                        </p>
                    </div>

                    {/* Total Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-300 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                                Total Clients
                            </span>
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Users size={22} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-3">
                            {clientsCount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Catalog items: {itemsCount}
                        </p>
                    </div>
                </div>

                {/* Status Filter Cards */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <Filter size={15} />
                            Filter By Invoice Status
                        </h2>
                        {currentFilter && (
                            <button
                                onClick={() => handleFilterChange(currentFilter)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Pending Option Card */}
                        <button
                            type="button"
                            onClick={() => handleFilterChange("pending")}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                                currentFilter === "pending"
                                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/30"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">
                                        Pending
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Awaiting review or decision
                                    </p>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-amber-600">
                                {statusCounts.pending}
                            </span>
                        </button>

                        {/* Approved Option Card */}
                        <button
                            type="button"
                            onClick={() => handleFilterChange("approved")}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                                currentFilter === "approved"
                                    ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">
                                        Approved
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Accepted & billable revenue
                                    </p>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-emerald-600">
                                {statusCounts.approved}
                            </span>
                        </button>

                        {/* Rejected Option Card */}
                        <button
                            type="button"
                            onClick={() => handleFilterChange("rejected")}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                                currentFilter === "rejected"
                                    ? "bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50/30"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                                    <XCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">
                                        Rejected
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Declined / cancelled
                                    </p>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-rose-600">
                                {statusCounts.rejected}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Invoices List with Quick Status Switcher */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/60">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Invoices Management
                                {currentFilter && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        (Filtered by{" "}
                                        <span className="capitalize font-semibold text-gray-800">
                                            {currentFilter}
                                        </span>
                                        )
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Change invoice status instantly between Pending, Approved, or Rejected.
                            </p>
                        </div>

                        <Link
                            href={route("invoices.index")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                            View All Invoices
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                    <th className="py-3 px-4">Invoice #</th>
                                    <th className="py-3 px-4">Client</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Total</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Update Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {recentInvoices && recentInvoices.length > 0 ? (
                                    recentInvoices.map((inv) => {
                                        const clientName =
                                            inv.client_info?.name ||
                                            [
                                                inv.client?.first_name,
                                                inv.client?.last_name,
                                            ]
                                                .filter(Boolean)
                                                .join(" ") ||
                                            inv.client?.company_name ||
                                            inv.client_info?.company_name ||
                                            "Client";

                                        return (
                                            <tr
                                                key={inv.id}
                                                className="hover:bg-gray-50/70 transition"
                                            >
                                                <td className="py-3.5 px-4 font-semibold text-gray-900 whitespace-nowrap">
                                                    {inv.invoice_number}
                                                </td>

                                                <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                                                    {clientName}
                                                </td>

                                                <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-xs">
                                                    {inv.issue_date || "—"}
                                                </td>

                                                <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                                                    ${Number(inv.total || 0).toFixed(2)}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {getStatusBadge(inv.status)}
                                                </td>

                                                {/* 3 Status Options: Pending, Approved, Rejected */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs shadow-inner">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    inv.id,
                                                                    "pending"
                                                                )
                                                            }
                                                            className={`px-2.5 py-1 rounded-md font-medium transition ${
                                                                (inv.status || "pending") ===
                                                                "pending"
                                                                    ? "bg-white text-amber-700 shadow-sm font-bold"
                                                                    : "text-gray-500 hover:text-amber-700"
                                                            }`}
                                                            title="Mark as Pending"
                                                        >
                                                            Pending
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    inv.id,
                                                                    "approved"
                                                                )
                                                            }
                                                            className={`px-2.5 py-1 rounded-md font-medium transition ${
                                                                inv.status === "approved"
                                                                    ? "bg-white text-emerald-700 shadow-sm font-bold"
                                                                    : "text-gray-500 hover:text-emerald-700"
                                                            }`}
                                                            title="Mark as Approved"
                                                        >
                                                            Approved
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    inv.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                            className={`px-2.5 py-1 rounded-md font-medium transition ${
                                                                inv.status === "rejected"
                                                                    ? "bg-white text-rose-700 shadow-sm font-bold"
                                                                    : "text-gray-500 hover:text-rose-700"
                                                            }`}
                                                            title="Mark as Rejected"
                                                        >
                                                            Rejected
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Link
                                                            href={route(
                                                                "invoices.show",
                                                                inv.id
                                                            )}
                                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                                                            title="View Invoice"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>

                                                        <a
                                                            href={route(
                                                                "invoices.pdf",
                                                                inv.id
                                                            )}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition"
                                                            title="Download PDF"
                                                        >
                                                            <Download size={16} />
                                                        </a>

                                                        <Link
                                                            href={route(
                                                                "invoices.edit",
                                                                inv.id
                                                            )}
                                                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
                                                            title="Edit Invoice"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-10 text-center text-gray-400"
                                        >
                                            No invoices found for this criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}