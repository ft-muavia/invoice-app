import Layout from "../../Components/Layout";
import { Link, router } from "@inertiajs/react";
import {
    Building2,
    User,
    Trash2,
    Download,
    Pencil,
    ArrowLeft,
} from "lucide-react";

export default function View({ invoice }) {
    const subtotal = invoice.items?.reduce(
        (sum, row) => sum + Number(row.qty) * Number(row.unit_price || 0),
        0
    ) ?? 0;

    const taxTotal = invoice.items?.reduce((sum, row) => {
        const rowSubtotal = Number(row.qty) * Number(row.unit_price || 0);
        return sum + (rowSubtotal * (Number(row.tax) || 0)) / 100;
    }, 0) ?? 0;

    const grandTotal = subtotal - taxTotal + Number(invoice.payment || 0);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            router.delete(route("invoices.destroy", invoice.id));
        }
    };

    return (
        <Layout>
            <div className="flex justify-center gap-4">
                {/* LEFT */}
                <div className="w-[900px] p-4">
                    <Link
                        href={route("invoices.index")}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 font-semibold"
                    >
                        <ArrowLeft size={18} />
                        Back to Invoices
                    </Link>

                    <div className="bg-white rounded-xl shadow border p-4">
                        {/* Top */}
                        <div className="flex gap-2 py-4 justify-between items-center">
                            {/* Logo */}
                            <div>
                                {invoice.logo ? (
                                    <img
                                        src={invoice.logo}
                                        alt="Company Logo"
                                        className="h-16 object-contain"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                        No Logo
                                    </div>
                                )}
                            </div>

                            {/* Invoice Type */}
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">
                                    Invoice Type
                                </p>
                                <p className="text-lg font-bold">
                                    {invoice.invoice_type}
                                </p>
                            </div>

                            {/* Invoice Number */}
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">
                                    Invoice Number
                                </p>
                                <p className="text-lg font-bold">
                                    {invoice.invoice_number}
                                </p>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex justify-end gap-10 py-2">
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">
                                    Issue Date
                                </p>
                                <p className="font-semibold">
                                    {invoice.issue_date}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-semibold">
                                    Due Date
                                </p>
                                <p className="font-semibold">
                                    {invoice.due_date}
                                </p>
                            </div>
                        </div>

                        {/* From / To */}
                        <div className="flex justify-center gap-2 mt-4">
                            {/* FROM */}
                            <div className="w-full border-dashed border rounded-xl px-8 py-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-5">
                                    From
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Building2 size={28} />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">
                                            {invoice.sender?.name ?? "Syed Muavia"}
                                        </h2>

                                        <p className="text-gray-600">
                                            {invoice.sender?.email ?? "smuavia17@gmail.com"}
                                        </p>

                                        <p className="text-gray-600">
                                            {invoice.sender?.address ?? "Lahore, Pakistan"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* TO */}
                            <div className="w-full border-dashed border rounded-xl px-8 py-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-5">
                                    To
                                </h3>

                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {invoice.client?.name ?? "Recipient name"}
                                        </h2>

                                        <p className="text-gray-500 font-semibold">
                                            {invoice.client?.email ?? "Recipient email"}
                                        </p>

                                        <p className="text-gray-500 font-semibold">
                                            {invoice.client?.city ?? "Recipient City Name, Country"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="mt-8">
                            <div className="border rounded-xl overflow-hidden">
                                <table className="w-full border rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-100 font-semibold">
                                            <th className="p-4 text-left">Item</th>
                                            <th className="p-4 text-center">Qty</th>
                                            <th className="p-4 text-center">Price</th>
                                            <th className="p-4 text-center">Tax</th>
                                            <th className="p-4 text-center">Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {invoice.items?.map((row) => (
                                            <tr key={row.id} className="border-t">
                                                <td className="p-3">
                                                    {row.item?.item_name ?? "—"}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {row.qty}
                                                </td>

                                                <td className="p-3 text-center">
                                                    ${Number(row.unit_price).toFixed(2)}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {row.tax ? `${row.tax}%` : "-"}
                                                </td>

                                                <td className="p-3 text-center font-semibold">
                                                    ${Number(row.total).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="border-t py-8">
                            <div className="flex justify-end p-4">
                                <div className="w-[340px] space-y-4">
                                    <h2 className="text-3xl font-black mb-4">
                                        Summary
                                    </h2>

                                    <div className="flex justify-between text-lg">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between text-lg">
                                        <span>Tax</span>
                                        <span>${taxTotal.toFixed(2)}</span>
                                    </div>

                                    {invoice.payment && (
                                        <div className="flex justify-between text-lg">
                                            <span>Payment</span>
                                            <span>${invoice.payment}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-2xl font-bold border-t pt-4">
                                        <span>Total</span>
                                        <span>${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            {invoice.terms && (
                                <div className="mt-10">
                                    <h2 className="text-2xl font-bold mb-4">
                                        Terms & Notes
                                    </h2>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {invoice.terms}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-[350px] p-4">
                    <Link
                        href={route("invoices.edit", invoice.id)}
                        className="w-full flex justify-center items-center gap-2 bg-blue-700 text-white rounded-xl py-4 font-semibold mb-4 hover:bg-blue-800"
                    >
                        <Pencil size={18} />
                        Edit Invoice
                    </Link>

                    <button
                        type="button"
                        className="w-full flex justify-center items-center gap-2 border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                    >
                        <Download size={18} />
                        Download Invoice
                    </button>

                    <hr className="my-8" />

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full flex justify-center items-center gap-2 bg-red-700 text-white rounded-xl py-4 font-semibold"
                    >
                        <Trash2 size={18} />
                        Delete Invoice
                    </button>
                </div>
            </div>
        </Layout>
    );
}