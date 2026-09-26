import { useState } from "react";
import Layout from "../../Components/Layout";
import { useForm } from "@inertiajs/react";
import {
    Image,
    Plus,
    Building2,
    User,
    FileText,
    DollarSign,
    Trash2,
    Download,
    Save,
    ChevronDown,
} from "lucide-react";

export default function Edit({ invoice, items }) {
    // Prefill invoice items from old data
    const [invoiceItems, setInvoiceItems] = useState(
        invoice.items?.map((item) => ({
            id: item.id,
            item_id: item.item_id,
            qty: item.qty,
            unit_price: item.unit_price,
            tax: item.tax,
            total: item.total,
        })) ?? [],
    );

    const addItem = () => {
        setInvoiceItems([
            ...invoiceItems,
            {
                id: Date.now(),
                item_id: "",
                qty: 1,
                unit_price: "",
                tax: "",
                total: 0,
            },
        ]);
    };

    const handleItemChange = (rowId, itemId) => {
        const selectedItem = items.find((item) => item.id === Number(itemId));

        if (!selectedItem) return;

        setInvoiceItems(
            invoiceItems.map((row) => {
                if (row.id === rowId) {
                    const total = row.qty * selectedItem.unit_price;

                    return {
                        ...row,
                        item_id: selectedItem.id,
                        unit_price: selectedItem.unit_price,
                        tax: selectedItem.tax,
                        total: total,
                    };
                }

                return row;
            }),
        );
    };

    const handleQtyChange = (rowId, qty) => {
        setInvoiceItems(
            invoiceItems.map((row) => {
                if (row.id === rowId) {
                    const subtotal = qty * row.unit_price;
                    const tax = Number(row.tax) || 0;
                    const total = subtotal - (subtotal * tax) / 100;

                    return {
                        ...row,
                        qty: qty,
                        total: total,
                    };
                }

                return row;
            }),
        );
    };

    // sender info
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);
    const [companyInfo, setCompanyInfo] = useState("");

    // client info
    const [showClientInfo, setShowClientInfo] = useState(false);
    const [clientInfo, setClientInfo] = useState("");

    // Payment functionality — prefill agar pehle se payment mojood hai
    const [showPayment, setShowPayment] = useState(!!invoice.payment);
    const [payment, setPayment] = useState(invoice.payment ?? "");

    // Prefill main form data from old invoice
    const { data, setData, put, processing, errors } = useForm({
        invoice_type: invoice.invoice_type ?? "Invoice",
        invoice_number: invoice.invoice_number ?? "0001",
        issue_date: invoice.issue_date ?? "",
        due_date: invoice.due_date ?? "",
        client_id: invoice.client_id ?? "",
        terms: invoice.terms ?? "",
        payment: invoice.payment ?? "",
    });

    // Summary calculations
    const subtotal = invoiceItems.reduce(
        (sum, row) => sum + Number(row.qty) * Number(row.unit_price || 0),
        0,
    );

    const taxTotal = invoiceItems.reduce((sum, row) => {
        const rowSubtotal = Number(row.qty) * Number(row.unit_price || 0);
        return sum + (rowSubtotal * (Number(row.tax) || 0)) / 100;
    }, 0);

    const grandTotal = subtotal - taxTotal + Number(payment || 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("invoices.update", invoice.id), {
            data: {
                ...data,
                payment: payment,
                items: invoiceItems,
            },
        });
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-4">
                    {/* LEFT */}
                    <div className="w-[900px] p-4">
                        <div className="bg-white rounded-xl shadow border p-4">
                            {/* Top */}
                            <div className="flex gap-2 py-4 justify-between items-center">
                                {/* Logo */}
                                <div>
                                    <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-blue-500">
                                        {invoice.logo ? (
                                            <img
                                                src={invoice.logo}
                                                alt="Company Logo"
                                                className="h-16 object-contain"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Image size={28} />
                                                <span className="text-sm">
                                                    Choose logo or drop it here
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Invoice Type */}
                                <div className="flex items-center gap-2">
                                    <label className="inline-block mb-2 font-semibold whitespace-nowrap">
                                        Invoice Type
                                    </label>

                                    <select
                                        className="w-full border-2 border-dashed rounded-lg p-3 hover:border-blue-500 border-gray-300"
                                        value={data.invoice_type}
                                        onChange={(e) =>
                                            setData(
                                                "invoice_type",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option>Invoice</option>
                                        <option>Receipt</option>
                                        <option>Quotation</option>
                                    </select>
                                </div>
                                {/* Invoice Number */}
                                <div className="flex items-center gap-2">
                                    <label className="block mb-2 font-semibold whitespace-nowrap">
                                        Invoice Number
                                    </label>

                                    <input
                                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-500"
                                        value={data.invoice_number}
                                        onChange={(e) =>
                                            setData(
                                                "invoice_number",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex justify-end gap-6 py-2">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <label className="font-semibold w-24">
                                            Issue Date
                                        </label>

                                        <input
                                            type="date"
                                            className="border rounded-lg p-2"
                                            value={data.issue_date}
                                            onChange={(e) =>
                                                setData(
                                                    "issue_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="font-semibold w-24">
                                            Due Date
                                        </label>

                                        <input
                                            type="date"
                                            className="border rounded-lg p-2"
                                            value={data.due_date}
                                            onChange={(e) =>
                                                setData(
                                                    "due_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* From / To */}
                            <div className="flex justify-center gap-2 mt-4">
                                {/* FROM */}
                                <div className="w-full border-dashed border rounded-xl px-8 py-2">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5">
                                        From
                                    </h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={28} />
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold">
                                                {invoice.sender?.name ??
                                                    "Syed Muavia"}
                                            </h2>

                                            <p className="text-gray-600">
                                                {invoice.sender?.email ??
                                                    "smuavia17@gmail.com"}
                                            </p>

                                            <p className="text-gray-600">
                                                {invoice.sender?.address ??
                                                    "Lahore, Pakistan"}
                                            </p>

                                            <button
                                                type="button"
                                                className="mt-5 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                                            >
                                                <Building2 size={18} />
                                                Change Company
                                            </button>
                                        </div>
                                    </div>
                                    {/* Company Info input — yahan show hoga jab right side ka button click hoga */}
                                    {showCompanyInfo && (
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                placeholder="Enter company info"
                                                value={companyInfo}
                                                onChange={(e) =>
                                                    setCompanyInfo(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg p-3"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* TO — prefilled from invoice.client agar mojood ho */}
                                <div className="w-full border-dashed border rounded-xl px-8 py-2">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5">
                                        To
                                    </h3>

                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={28} />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl text-gray-800 font-semibold">
                                                {invoice.client?.name ??
                                                    "Recipient name"}
                                            </h2>

                                            <p className="text-gray-500 font-semibold">
                                                {invoice.client?.email ??
                                                    "Recipient email"}
                                            </p>

                                            <p className="text-gray-500 font-semibold">
                                                {invoice.client?.city ??
                                                    "Recipient City Name, Country"}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "client-modal",
                                                        )
                                                        .showModal()
                                                }
                                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                                            >
                                                <Plus size={18} />
                                                {invoice.client
                                                    ? "Change Client"
                                                    : "Add Client"}
                                            </button>

                                            {/* Modal */}
                                            <dialog
                                                id="client-modal"
                                                className="rounded-lg p-0 backdrop:bg-black/40"
                                            >
                                                <div className="w-[400px] p-6">
                                                    <h3 className="text-xl font-bold mb-6">
                                                        {invoice.client
                                                            ? "Edit Client"
                                                            : "Add New Client"}
                                                    </h3>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Client Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter client name"
                                                            defaultValue={
                                                                invoice.client
                                                                    ?.name
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            placeholder="Enter email Address"
                                                            defaultValue={
                                                                invoice.client
                                                                    ?.email
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            City
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter City Name"
                                                            defaultValue={
                                                                invoice.client
                                                                    ?.city
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                document
                                                                    .getElementById(
                                                                        "client-modal",
                                                                    )
                                                                    .close()
                                                            }
                                                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                document
                                                                    .getElementById(
                                                                        "client-modal",
                                                                    )
                                                                    .close()
                                                            }
                                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            Save Client
                                                        </button>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </div>
                                    </div>
                                    {/* Client Info input — yahan show hoga jab right side ka button click hoga */}
                                    {showClientInfo && (
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                placeholder="Enter client info"
                                                value={clientInfo}
                                                onChange={(e) =>
                                                    setClientInfo(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg p-3"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Invoice Items — prefilled */}
                            <div className="mt-8">
                                <div className="border rounded-xl overflow-hidden">
                                    <table className="w-full border rounded-xl overflow-hidden">
                                        <thead>
                                            <tr className="bg-gray-100 font-semibold">
                                                <th className="p-4 text-left">
                                                    Item
                                                </th>
                                                <th className="p-4 text-center">
                                                    Qty
                                                </th>
                                                <th className="p-4 text-center">
                                                    Price
                                                </th>
                                                <th className="p-4 text-center">
                                                    Tax
                                                </th>
                                                <th className="p-4 text-center">
                                                    Total
                                                </th>
                                                <th className="p-4 text-center">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {invoiceItems.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="border-t"
                                                >
                                                    <td className="p-3">
                                                        <select
                                                            value={String(
                                                                row.item_id,
                                                            )}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    row.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full border rounded-lg p-2"
                                                        >
                                                            <option value="">
                                                                Select Item
                                                            </option>

                                                            {items.map(
                                                                (item) => (
                                                                    <option
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={String(
                                                                            item.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.item_name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={row.qty}
                                                            onChange={(e) =>
                                                                handleQtyChange(
                                                                    row.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-20 border rounded-lg p-2 text-center"
                                                        />
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={
                                                                row.unit_price
                                                            }
                                                            readOnly
                                                            className="w-full border rounded-lg p-2 text-center bg-gray-100"
                                                        />
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={row.tax}
                                                            readOnly
                                                            className="w-full border rounded-lg p-2 text-center bg-gray-100"
                                                        />
                                                    </td>

                                                    <td className="p-3 text-center font-semibold">
                                                        $
                                                        {Number(
                                                            row.total,
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="p-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteRow(
                                                                    row.id,
                                                                )
                                                            }
                                                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="w-full flex justify-center items-center border-2 border-dashed border-gray-300 rounded-xl py-2 text-lg font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
                                >
                                    <Plus size={22} />
                                    Add New Invoice Item
                                </button>
                            </div>

                            {/* Summary — dynamic ab, hardcoded nahi */}
                            <div className="border-t py-8">
                                <div className="flex justify-end p-4">
                                    <div className="w-[340px]">
                                        <div className="flex items-center gap-3 justify-between mb-6">
                                            <h2 className="text-3xl font-black">
                                                Summary
                                            </h2>

                                            <select className="border rounded-xl px-16 py-2">
                                                <option>USD</option>
                                                <option>PKR</option>
                                                <option>EUR</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-lg">
                                                <span>Subtotal</span>
                                                <span>
                                                    ${subtotal.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-lg">
                                                <span>Tax</span>
                                                <span>
                                                    ${taxTotal.toFixed(2)}
                                                </span>
                                            </div>

                                            {payment && (
                                                <div className="flex justify-between text-lg">
                                                    <span>Payment</span>
                                                    <span>${payment}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between text-2xl font-bold border-t pt-4">
                                                <span>Total</span>
                                                <span>
                                                    ${grandTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <h2 className="text-2xl font-bold mb-4">
                                        Terms & Notes
                                    </h2>
                                    <textarea
                                        placeholder="Enter terms and conditions..."
                                        className="w-full border rounded-lg p-2"
                                        rows="4"
                                        value={data.terms}
                                        onChange={(e) =>
                                            setData("terms", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="w-[350px] p-4">
                        <button
                            type="button"
                            className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                        >
                            + Add Custom Field
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowCompanyInfo(!showCompanyInfo)}
                            className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                        >
                            📄 Add Company Info
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowClientInfo(!showClientInfo)}
                            className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                        >
                            👤 Add Client Info
                        </button>

                        <button
                            type="button"
                            className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                        >
                            📝 Add Description
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowPayment(!showPayment)}
                            className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                        >
                            💲 Add Payment
                        </button>
                        {showPayment && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter Payment"
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>
                        )}

                        <hr className="my-8" />

                        <button
                            type="button"
                            className="w-full flex justify-center bg-red-700 text-white rounded-xl py-4 font-semibold mb-4"
                        >
                            <span className="flex items-center gap-2">
                                <Trash2 /> Delete Invoice
                            </span>
                        </button>

<a
href={route("invoices.pdf", invoice.id)}
className="w-full flex justify-center bg-blue-700 text-white rounded-xl py-4 font-semibold mb-4"
>
    <Download />
    Download PDF
</a>

                        <a
                            href={route("invoices.update", invoice.id)}
                            disabled={processing}
                            className="w-full flex justify-center bg-blue-700 text-white rounded-xl py-4 font-semibold disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2">
                                <Save />{" "}
                                {processing ? "Updating..." : "Update Invoice"}
                            </span>
                        </a>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
