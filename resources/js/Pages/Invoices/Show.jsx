import React from "react";
import Layout from "@/Components/Layout";
import { Link, router } from "@inertiajs/react";
import {
    Building2,
    User,
    Trash2,
    Download,
    Pencil,
    ArrowLeft,
    Calendar,
    FileText,
} from "lucide-react";

export default function Show({ invoice }) {
    // Calculate subtotal from items if not present
    const subtotal =
        invoice.items?.reduce(
            (sum, row) => sum + Number(row.qty || 0) * Number(row.unit_price || 0),
            0
        ) ?? 0;

    // Calculate tax from items
    const taxTotal =
        invoice.items?.reduce((sum, row) => {
            const rowSubtotal = Number(row.qty || 0) * Number(row.unit_price || 0);
            return sum + (rowSubtotal * (Number(row.tax) || 0)) / 100;
        }, 0) ?? 0;

    // Calculate grand total (subtotal + taxTotal)
    const grandTotal =
        invoice.total != null && Number(invoice.total) > 0
            ? Number(invoice.total)
            : subtotal + taxTotal;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            router.delete(route("invoices.destroy", invoice.id));
        }
    };

    // Prefer stored historical snapshot over live relation
    const clientData =
        invoice.client_info ||
        (invoice.client
            ? {
                  name:
                      [invoice.client.first_name, invoice.client.last_name]
                          .filter(Boolean)
                          .join(" ") || invoice.client.company_name,
                  first_name: invoice.client.first_name,
                  last_name: invoice.client.last_name,
                  company_name: invoice.client.company_name,
                  email: invoice.client.email,
                  phone: invoice.client.phone,
                  address_line_1: invoice.client.address_line_1,
                  city: invoice.client.city,
                  postal_code: invoice.client.postal_code,
                  country: invoice.client.country,
              }
            : {});

    const senderData =
        invoice.sender_info ||
        (invoice.sender
            ? {
                  name:
                      invoice.sender.sender_name ||
                      [invoice.sender.first_name, invoice.sender.last_name]
                          .filter(Boolean)
                          .join(" "),
                  sender_name: invoice.sender.sender_name,
                  email: invoice.sender.email,
                  phone_number: invoice.sender.phone_number,
                  address_1: invoice.sender.address_1,
                  city: invoice.sender.city,
                  postal_code: invoice.sender.postal_code,
                  country: invoice.sender.country,
                  tax_registration_number: invoice.sender.tax_registration_number,
              }
            : {});

    const senderDisplayName =
        senderData.sender_name ||
        senderData.name ||
        [senderData.first_name, senderData.last_name]
            .filter(Boolean)
            .join(" ") ||
        "Sender / Business";

    const senderAddressParts = [
        senderData.address_1 || senderData.address_line_1,
        senderData.city,
        senderData.postal_code,
        senderData.country,
    ].filter(Boolean);

    const clientDisplayName =
        clientData.name ||
        [clientData.first_name, clientData.last_name].filter(Boolean).join(" ") ||
        clientData.company_name ||
        "Client / Recipient";

    const clientAddressParts = [
        clientData.address_line_1,
        clientData.city,
        clientData.postal_code,
        clientData.country,
    ].filter(Boolean);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href={route("invoices.index")}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
                    >
                        <ArrowLeft size={18} />
                        Back to Invoices
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Invoice Preview Document (Main Canvas) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-8 space-y-8">
                        {/* Header: Logo, Type, Number, Dates */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-200 pb-6">
                            <div>
                                {invoice.logo ? (
                                    <img
                                        src={invoice.logo}
                                        alt="Company Logo"
                                        className="h-14 object-contain mb-3"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-3">
                                        <FileText size={26} />
                                        <span>{invoice.invoice_type || "Invoice"}</span>
                                    </div>
                                )}
                                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                    {invoice.invoice_type || "INVOICE"}
                                </h1>
                                <p className="text-sm font-semibold text-gray-500 mt-1">
                                    Invoice No:{" "}
                                    <span className="text-gray-800 font-bold">
                                        {invoice.invoice_number}
                                    </span>
                                </p>
                            </div>

                            <div className="text-left sm:text-right space-y-1">
                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase mb-2">
                                    <Calendar size={13} />
                                    <span>Issued: {invoice.issue_date || "—"}</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <span className="text-gray-400">Due Date:</span>{" "}
                                    <strong className="text-gray-800">
                                        {invoice.due_date || "—"}
                                    </strong>
                                </p>
                            </div>
                        </div>

                        {/* From & To Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                            {/* FROM */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                    <Building2 size={16} /> From
                                </h3>
                                <p className="text-base font-bold text-gray-900">
                                    {senderDisplayName}
                                </p>
                                {senderData.email && (
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {senderData.email}
                                    </p>
                                )}
                                {senderData.phone_number && (
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {senderData.phone_number}
                                    </p>
                                )}
                                {senderAddressParts.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {senderAddressParts.join(", ")}
                                    </p>
                                )}
                                {senderData.tax_registration_number && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Tax ID: {senderData.tax_registration_number}
                                    </p>
                                )}
                            </div>

                            {/* TO */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                    <User size={16} /> Bill To
                                </h3>
                                <p className="text-base font-bold text-gray-900">
                                    {clientDisplayName}
                                </p>
                                {clientData.company_name &&
                                    clientData.company_name !== clientDisplayName && (
                                        <p className="text-sm font-medium text-gray-700">
                                            {clientData.company_name}
                                        </p>
                                    )}
                                {clientData.email && (
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {clientData.email}
                                    </p>
                                )}
                                {clientData.phone && (
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {clientData.phone}
                                    </p>
                                )}
                                {clientAddressParts.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {clientAddressParts.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider">
                                        <th className="p-3.5">Item / Description</th>
                                        <th className="p-3.5 text-center">Qty</th>
                                        <th className="p-3.5 text-right">Price</th>
                                        <th className="p-3.5 text-center">Tax</th>
                                        <th className="p-3.5 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-sm">
                                    {invoice.items && invoice.items.length > 0 ? (
                                        invoice.items.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50">
                                                <td className="p-3.5 font-medium text-gray-800">
                                                    {row.item?.item_name ??
                                                        row.description ??
                                                        "Item"}
                                                </td>
                                                <td className="p-3.5 text-center text-gray-600">
                                                    {row.qty}
                                                </td>
                                                <td className="p-3.5 text-right text-gray-600">
                                                    ${Number(row.unit_price).toFixed(2)}
                                                </td>
                                                <td className="p-3.5 text-center text-gray-600">
                                                    {row.tax ? `${row.tax}%` : "—"}
                                                </td>
                                                <td className="p-3.5 text-right font-semibold text-gray-900">
                                                    ${Number(row.total).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-6 text-center text-gray-400"
                                            >
                                                No items on this invoice.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Section */}
                        <div className="flex justify-end pt-2">
                            <div className="w-full sm:w-72 space-y-2.5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span className="font-semibold text-gray-800">
                                        ${taxTotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                                    <span>Total</span>
                                    <span className="text-blue-600">
                                        ${grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Notes */}
                        {invoice.terms && (
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Terms & Notes
                                </h4>
                                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                    {invoice.terms}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions Sidebar */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-800 pb-2 border-b">
                            Actions
                        </h2>

                        {/* Primary Action: Download PDF */}
                        <a
                            href={route("invoices.pdf", invoice.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-semibold text-sm shadow transition"
                        >
                            <Download size={18} />
                            Download PDF
                        </a>

                        {/* Edit Invoice */}
                        <Link
                            href={route("invoices.edit", invoice.id)}
                            className="w-full inline-flex justify-center items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-3 px-4 font-semibold text-sm transition"
                        >
                            <Pencil size={18} />
                            Edit Invoice
                        </Link>

                        <div className="pt-4 border-t border-gray-100">
                            {/* Delete Invoice */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full inline-flex justify-center items-center gap-2 text-red-600 hover:bg-red-50 rounded-lg py-2.5 px-4 font-medium text-sm transition"
                            >
                                <Trash2 size={16} />
                                Delete Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
