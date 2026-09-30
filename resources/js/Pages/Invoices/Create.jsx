import { useState } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import {
    Image,
    Plus,
    Building2,
    User,
    FileText,
    DollarSign,
    Trash2,
    Save,
    ChevronDown,
} from "lucide-react";

export default function Create({ items = [], senders = [], clients = [] }) {
    // Form state with Inertia useForm at top level
    const { data, setData, processing, errors } = useForm({
        logo: null,
        invoice_type: "Invoice",
        invoice_number: `INV-${Date.now().toString().slice(-4)}`,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: "",
        client_id: "",
        sender_id: "",
        status: "pending",
        terms: "",
        description: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);

    // Select sender state
    const [selectedSender, setSelectedSender] = useState(null);

    const handleSelectSender = (sender) => {
        setSelectedSender(sender);
        setData("sender_id", sender.id);
        const modal = document.getElementById("sender-modal");
        if (modal) modal.close();
    };

    // Select client state
    const [selectedClient, setSelectedClient] = useState(null);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setData("client_id", client.id);
        const modal = document.getElementById("client-select-modal");
        if (modal) modal.close();
    };

    // Custom field State
    const [customFields, setCustomFields] = useState([]);
    const [newFieldLabel, setNewFieldLabel] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");
    const [newFieldLocation, setNewFieldLocation] =
        useState("below_company_info");

    const addCustomField = () => {
        if (!newFieldLabel.trim()) return;

        setCustomFields([
            ...customFields,
            {
                id: Date.now(),
                label: newFieldLabel,
                value: newFieldValue,
                location: newFieldLocation,
            },
        ]);

        // Reset form
        setNewFieldLabel("");
        setNewFieldValue("");
        const modal = document.getElementById("custom-field-modal");
        if (modal) modal.close();
    };

    const removeCustomField = (id) => {
        setCustomFields(customFields.filter((f) => f.id !== id));
    };

    const renderCustomFields = (location) => {
        return customFields
            .filter((f) => f.location === location)
            .map((f) => (
                <div
                    key={f.id}
                    className="flex justify-between items-center border rounded-lg p-3 mt-3 bg-gray-50"
                >
                    <div>
                        <p className="text-sm font-semibold text-gray-600">
                            {f.label}
                        </p>
                        <p className="text-gray-800">{f.value}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeCustomField(f.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                        Remove
                    </button>
                </div>
            ));
    };

    // Invoice items functionality - start with 1 item row
    const [invoiceItems, setInvoiceItems] = useState([
        {
            id: Date.now(),
            item_id: "",
            qty: 1,
            unit_price: "",
            tax: 0,
            total: 0,
        },
    ]);

    const addItem = () => {
        setInvoiceItems([
            ...invoiceItems,
            {
                id: Date.now(),
                item_id: "",
                qty: 1,
                unit_price: "",
                tax: 0,
                total: 0,
            },
        ]);
    };

    const deleteRow = (id) => {
        setInvoiceItems(invoiceItems.filter((row) => row.id !== id));
    };

    const calculateTotal = (qty, unit_price, tax) => {
        const subtotal = Number(qty) * Number(unit_price);
        const taxValue = Number(tax) || 0;
        return subtotal + (subtotal * taxValue) / 100;
    };

    const handleItemChange = (rowId, itemId) => {
        const selectedItem = (items || []).find((item) => item.id === Number(itemId));

        if (!selectedItem) return;

        setInvoiceItems(
            invoiceItems.map((row) => {
                if (row.id === rowId) {
                    const total = calculateTotal(
                        row.qty,
                        selectedItem.unit_price,
                        selectedItem.tax,
                    );

                    return {
                        ...row,
                        item_id: selectedItem.id,
                        unit_price: selectedItem.unit_price,
                        tax: selectedItem.tax || 0,
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
                    const total = calculateTotal(qty, row.unit_price, row.tax);

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

    // Summary calculations
    const subtotal = invoiceItems.reduce(
        (sum, row) => sum + Number(row.qty || 0) * Number(row.unit_price || 0),
        0,
    );

    const totalTax = invoiceItems.reduce((sum, row) => {
        const rowSubtotal = Number(row.qty || 0) * Number(row.unit_price || 0);
        return sum + (rowSubtotal * (Number(row.tax) || 0)) / 100;
    }, 0);

    const grandTotal = subtotal + totalTax;

    // sender info toggle
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);
    const [companyInfo, setCompanyInfo] = useState("");

    // client info toggle
    const [showClientInfo, setShowClientInfo] = useState(false);
    const [clientInfo, setClientInfo] = useState("");

    // description toggle
    const [showDescriptionInfo, setShowDescriptionInfo] = useState(false);
    const [DescriptionInfo, setDescriptionInfo] = useState("");

    // Payment functionality
    const [showPayment, setShowPayment] = useState(false);
    const [payment, setPayment] = useState("");

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const validItems = invoiceItems.filter((i) => i.item_id);
        if (validItems.length === 0) {
            alert("Please select at least one item for the invoice.");
            return;
        }

        router.post(
            route("invoices.store"),
            {
                ...data,
                description: DescriptionInfo || data.description,
                terms: data.terms,
                items: validItems.map((i) => ({
                    item_id: i.item_id,
                    qty: Number(i.qty),
                    unit_price: Number(i.unit_price),
                    tax: Number(i.tax || 0),
                })),
            },
            {
                forceFormData: true,
            },
        );
    };
    return (
        <Layout>
            <div className="flex justify-center gap-4">
                {/* LEFT */}
                <div className="w-[900px] p-4">
                    <div className="bg-white rounded-xl shadow border p-4">
                        {/* Top */}

                        <div className="flex gap-2 py-4 justify-between items-center">
                            {/* Logo */}
                            <div>
                                <input
                                    id="invoice-logo-input"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData("logo", file);
                                            setLogoPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <div
                                    onClick={() => document.getElementById("invoice-logo-input")?.click()}
                                    className="border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition min-w-[200px] min-h-[80px] group bg-gray-50/50 hover:bg-blue-50/20"
                                >
                                    {logoPreview ? (
                                        <div className="relative flex flex-col items-center">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="max-h-16 max-w-[180px] object-contain rounded"
                                            />
                                            <span className="text-[11px] text-blue-600 font-semibold mt-1 group-hover:underline">
                                                Click to change
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-500 group-hover:text-blue-600 transition">
                                            <Image size={28} />
                                            <span className="text-sm font-medium">
                                                Choose logo or drop it here
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData("logo", null);
                                            setLogoPreview(null);
                                            const input = document.getElementById("invoice-logo-input");
                                            if (input) input.value = "";
                                        }}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium mt-1 inline-block"
                                    >
                                        Remove logo
                                    </button>
                                )}
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
                                        setData("invoice_type", e.target.value)
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
                        <div className=" flex justify-end gap-6 py-2  ">
                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <label className="font-semibold w-24">
                                        Issue Date
                                    </label>

                                    <input
                                        type="date"
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-2"
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
                                        className="border-dashed border-2 border-gray-300 rounded-lg p-2"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData("due_date", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sender / Client */}

                        <div>
                            <div className="flex justify-center gap-2 mt-4">
                                {/* FROM */}

                                <div className="w-full border-dashed border-2 rounded-xl px-8 py-2">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5">
                                        From
                                    </h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={28} />
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold">
                                                {selectedSender?.sender_name ??
                                                    "Select a company"}
                                            </h2>

                                            <p className="text-gray-600">
                                                {selectedSender?.email ?? "-"}
                                            </p>

                                            <p className="text-gray-600">
                                                {selectedSender?.address_1 ??
                                                    "-"}
                                            </p>

                                            <button
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "sender-modal",
                                                        )
                                                        .showModal()
                                                }
                                                className=" text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                                            >
                                                <Building2 size={18} />
                                                Change Company
                                            </button>
                                            {/* Sender Selection Modal — same rahega */}
                                            <dialog
                                                id="sender-modal"
                                                className="rounded-lg p-0 backdrop:bg-black/40"
                                            >
                                                <div className="w-[450px] p-6">
                                                    <h3 className="text-xl font-bold mb-6">
                                                        Select Company
                                                    </h3>

                                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                        {senders?.length > 0 ? (
                                                            senders.map(
                                                                (sender) => (
                                                                    <button
                                                                        type="button"
                                                                        key={
                                                                            sender.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleSelectSender(
                                                                                sender,
                                                                            )
                                                                        }
                                                                        className={`w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition ${
                                                                            selectedSender?.id ===
                                                                            sender.id
                                                                                ? "border-blue-600 bg-blue-50"
                                                                                : "border-gray-200"
                                                                        }`}
                                                                    >
                                                                        <p className="font-semibold text-gray-800">
                                                                            {
                                                                                sender.sender_name
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">
                                                                            {
                                                                                sender.email
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">
                                                                            {
                                                                                sender.address_1
                                                                            }
                                                                        </p>
                                                                    </button>
                                                                ),
                                                            )
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">
                                                                No companies
                                                                found. Add one
                                                                first.
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end gap-3 mt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                document
                                                                    .getElementById(
                                                                        "sender-modal",
                                                                    )
                                                                    .close()
                                                            }
                                                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </dialog>
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
                                    {renderCustomFields("below_company_info")}
                                </div>

                                {/* TO */}

                                <div className="w-full border-dashed border-2 rounded-xl px-8 py-2">
                                    <h3 className="text-xl font-bold text-gray-800 mb-5">
                                        To
                                    </h3>

                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={28} />
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold">
                                                {selectedClient
                                                    ? (selectedClient.company_name ||
                                                       [selectedClient.first_name, selectedClient.last_name]
                                                           .filter(Boolean)
                                                           .join(" "))
                                                    : "Select a client"}
                                            </h2>

                                            <p className="text-gray-600">
                                                {selectedClient?.email ?? "-"}
                                            </p>

                                            <p className="text-gray-600">
                                                {[selectedClient?.address_line_1, selectedClient?.city, selectedClient?.country]
                                                    .filter(Boolean)
                                                    .join(", ") || "-"}
                                            </p>

                                            <div className="flex items-center gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const modal = document.getElementById("client-select-modal");
                                                        if (modal) modal.showModal();
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                                                >
                                                    <User size={18} />
                                                    {selectedClient ? "Change Client" : "Select Client"}
                                                </button>

                                                <Link
                                                    href={route("clients.create")}
                                                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                                                >
                                                    <Plus size={16} /> New Client
                                                </Link>
                                            </div>

                                            {/* Client Selection Modal */}
                                            <dialog
                                                id="client-select-modal"
                                                className="rounded-lg p-0 backdrop:bg-black/40"
                                            >
                                                <div className="w-[450px] p-6">
                                                    <h3 className="text-xl font-bold mb-6">
                                                        Select Client
                                                    </h3>

                                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                        {clients?.length > 0 ? (
                                                            clients.map((client) => (
                                                                <button
                                                                    type="button"
                                                                    key={client.id}
                                                                    onClick={() => handleSelectClient(client)}
                                                                    className={`w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition ${
                                                                        selectedClient?.id === client.id
                                                                            ? "border-blue-600 bg-blue-50"
                                                                            : "border-gray-200"
                                                                    }`}
                                                                >
                                                                    <p className="font-semibold text-gray-800">
                                                                        {client.company_name ||
                                                                            [client.first_name, client.last_name]
                                                                                .filter(Boolean)
                                                                                .join(" ")}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {client.email || "No email"}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {[client.city, client.country]
                                                                            .filter(Boolean)
                                                                            .join(", ")}
                                                                    </p>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-4">
                                                                <p className="text-gray-500 text-sm mb-3">
                                                                    No clients found.
                                                                </p>
                                                                <Link
                                                                    href={route("clients.create")}
                                                                    className="text-blue-600 hover:underline text-sm font-semibold"
                                                                >
                                                                    + Create a client
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end gap-3 mt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const modal = document.getElementById("client-select-modal");
                                                                if (modal) modal.close();
                                                            }}
                                                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                                        >
                                                            Close
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
                                    {renderCustomFields("below_client_info")}
                                </div>
                            </div>

                            {showDescriptionInfo && (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Enter description"
                                        value={DescriptionInfo}
                                        onChange={(e) =>
                                            setDescriptionInfo(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>
                            )}
                            {renderCustomFields("below_description")}
                        </div>

                        {/* Add Invoice Item */}
                        {/* Invoice Items */}

                        <div className="mt-8">
                            <div className="border rounded-xl overflow-hidden">
                                <table className="w-full border rounded-xl overflow-hidden">
                                    {/* Header */}
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

                                    {/* Row */}
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full border rounded-lg p-2"
                                                    >
                                                        <option value="">
                                                            Select Item
                                                        </option>

                                                        {(items || []).map((item) => (
                                                            <option
                                                                key={item.id}
                                                                value={String(
                                                                    item.id,
                                                                )}
                                                            >
                                                                {item.item_name} (${Number(item.unit_price).toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        value={row.qty}
                                                        onChange={(e) =>
                                                            handleQtyChange(
                                                                row.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-20 border rounded-lg p-2 text-center"
                                                    />
                                                </td>

                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        value={row.unit_price}
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
                                                    ${row.total}
                                                </td>

                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() =>
                                                            deleteRow(row.id)
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
                                onClick={addItem}
                                className="w-full flex justify-center items-center border-2 border-dashed border-gray-300 rounded-xl py-2 text-lg font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
                            >
                                <Plus size={22} />
                                Add New Invoice Item
                            </button>
                        </div>
                        {/* Summary */}

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
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-lg">
                                            <span>Tax</span>
                                            <span>${totalTax.toFixed(2)}</span>
                                        </div>

                                        <div id="payment-summary">
                                            {payment && (
                                                <div className="flex justify-between text-lg">
                                                    <span>Payment</span>
                                                    <span>${payment}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between text-2xl font-bold border-t pt-4">
                                            <span>Total</span>
                                            <span>
                                                ${grandTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {renderCustomFields("above_terms")}
                            {/* terms */}
                            <div className="mt-10">
                                <h2 className="text-2xl font-bold mb-4">
                                    Terms & Notes
                                </h2>
                                <textarea
                                    placeholder="Enter terms and conditions..."
                                    value={data.terms}
                                    onChange={(e) => setData("terms", e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-[350px] p-4">
                    <button
                        onClick={() =>
                            document
                                .getElementById("custom-field-modal")
                                .showModal()
                        }
                        className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                    >
                        + Add Custom Field
                    </button>
                    {/* Modal */}
                    <dialog
                        id="custom-field-modal"
                        className="rounded-lg p-0 backdrop:bg-black/40"
                    >
                        <div className="w-[400px] p-6">
                            <h3 className="text-xl font-bold mb-6">
                                Add Custom Field
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">
                                    Field Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PO Number"
                                    value={newFieldLabel}
                                    onChange={(e) =>
                                        setNewFieldLabel(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">
                                    Field Value
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PO-2024-001"
                                    value={newFieldValue}
                                    onChange={(e) =>
                                        setNewFieldValue(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">
                                    Show this field
                                </label>
                                <select
                                    value={newFieldLocation}
                                    onChange={(e) =>
                                        setNewFieldLocation(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="below_company_info">
                                        Below Company Info
                                    </option>
                                    <option value="below_client_info">
                                        Below Client Info
                                    </option>
                                    <option value="below_description">
                                        Below Description
                                    </option>
                                    <option value="above_terms">
                                        Above Terms & Conditions
                                    </option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "custom-field-modal",
                                            )
                                            .close()
                                    }
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={addCustomField}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Add Field
                                </button>
                            </div>
                        </div>
                    </dialog>

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
                        onClick={() =>
                            setShowDescriptionInfo(!showDescriptionInfo)
                        }
                        className="w-full border border-blue-600 text-blue-600 rounded-xl py-4 font-semibold mb-4"
                    >
                        📝 Add Description
                    </button>

                    <button
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

                    <Link
                        href={route("invoices.index")}
                        className="w-full flex justify-center bg-red-700 text-white rounded-xl py-4 font-semibold mb-4"
                    >
                        <span className="flex items-center gap-2">
                            <Trash2 />
                            Delete Invoice
                        </span>
                    </Link>
                    {/* <a
                        href={route("invoices.pdf", invoice.id)}
                        className="w-full flex justify-center bg-blue-700 text-white rounded-xl py-4 font-semibold"
                    >
                        <Download />
                        Download PDF
                    </a> */}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="w-full flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl py-4 font-semibold transition cursor-pointer"
                    >
                        <Save size={18} /> {processing ? "Saving..." : "Save Invoice"}
                    </button>

                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs space-y-1">
                            {Object.entries(errors).map(([key, err]) => (
                                <p key={key}>• {err}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
