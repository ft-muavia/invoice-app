import { useForm } from "@inertiajs/react";
import Layout from "../../Components/Layout";
export default function CreateItem() {
    const { data, setData, post, processing, errors } = useForm({
        item_name: "",
        qty: "",
        unit_price: "",
        tax: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("items.store"));
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Add New Item
                    </h1>
                    <a
                        href={route("items.index")}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        &larr; Back to Items
                    </a>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                        <ul className="text-sm text-red-600 list-disc list-inside">
                            {Object.values(errors).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.item_name}
                                onChange={(e) =>
                                    setData("item_name", e.target.value)
                                }
                                required
                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Qty{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.qty}
                                    onChange={(e) =>
                                        setData("qty", e.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit Price{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.unit_price}
                                    onChange={(e) =>
                                        setData("unit_price", e.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tax (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.tax}
                                    onChange={(e) =>
                                        setData("tax", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <a
                            href={route("items.index")}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Item"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
