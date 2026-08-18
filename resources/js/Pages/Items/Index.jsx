import React from "react";
import { Link } from "@inertiajs/react";
import Layout from "../../Components/Layout";

export default function Index({ items }) {
    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Items</h1>

                <Link
                    href="/items/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Item
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-5 py-3">Item Name</th>
                            <th className="text-left px-5 py-3">Quantity</th>
                            <th className="text-left px-5 py-3">Unit Price</th>
                            <th className="text-left px-5 py-3">Tax (%)</th>
                            <th className="text-center px-5 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items?.length > 0 ? (
                            items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-5 py-3">
                                        {item.item_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.qty}
                                    </td>

                                    <td className="px-5 py-3">
                                        ${item.unit_price}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.tax}%
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex justify-center gap-2">

                                            <Link
                                                href={`/items/${item.id}/edit`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No Items Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}