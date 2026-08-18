import React from "react";
import Layout from "@/Components/Layout";
import { Link } from "@inertiajs/react";

export default function Index({ invoices }) {
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
                                    {invoice.client?.first_name}{" "}
                                    {invoice.client?.last_name}
                                </p>

                                <p>
                                    <strong>Sender:</strong>{" "}
                                    {invoice.sender?.sender_name}
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
                                    className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                                >
                                    View
                                </Link>

                                <Link
                                    href={`/invoices/${invoice.id}/edit`}
                                    className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                                >
                                    Edit
                                </Link>

                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                                    Delete
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