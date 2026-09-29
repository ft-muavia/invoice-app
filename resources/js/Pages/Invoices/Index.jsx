import React from "react";
import Layout from "@/Components/Layout";
import { Link, router } from "@inertiajs/react";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";

export default function Index({ invoices }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            router.delete(route("invoices.destroy", id));
        }
    };
    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Invoices</h1>

                <Link
                    href="/invoices/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Create Invoice
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {invoices?.length > 0 ? (
                    invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {invoice.invoice_number}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {invoice.invoice_type}
                                    </p>
                                </div>

                                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                                    Pending
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-sm text-gray-700">

                                <p>
                                    <strong>Client:</strong>{" "}
                                    {invoice.client_info?.name ||
                                        [
                                            invoice.client?.first_name,
                                            invoice.client?.last_name,
                                        ]
                                            .filter(Boolean)
                                            .join(" ") ||
                                        invoice.client?.company_name ||
                                        invoice.client_info?.company_name ||
                                        "Client (Deleted)"}
                                </p>

                                <p>
                                    <strong>Sender:</strong>{" "}
                                    {invoice.sender_info?.sender_name ||
                                        invoice.sender?.sender_name ||
                                        invoice.sender_info?.name ||
                                        [
                                            invoice.sender?.first_name,
                                            invoice.sender?.last_name,
                                        ]
                                            .filter(Boolean)
                                            .join(" ") ||
                                        "—"}
                                </p>

                                <p>
                                    <strong>Issue:</strong>{" "}
                                    {invoice.issue_date}
                                </p>

                                <p>
                                    <strong>Due:</strong>{" "}
                                    {invoice.due_date}
                                </p>

                                <p className="text-lg font-bold text-blue-600">
                                    ${invoice.total}
                                </p>

                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-5">
                                <Link
                                    href={`/invoices/${invoice.id}`}
                                    className="flex-1 inline-flex justify-center items-center gap-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                                >
                                    <Eye size={16} /> View
                                </Link>

                                <a
                                    href={route("invoices.pdf", invoice.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex justify-center items-center gap-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
                                >
                                    <Download size={16} /> PDF
                                </a>

                                <Link
                                    href={`/invoices/${invoice.id}/edit`}
                                    className="p-2 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </Link>

                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No Invoices Found
                    </div>
                )}
            </div>
        </Layout>
    );
}