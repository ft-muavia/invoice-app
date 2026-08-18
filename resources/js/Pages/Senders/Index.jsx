import React from "react";
import Layout from "../../Components/Layout";
import { Link } from "@inertiajs/react";

export default function index({ senders }) {
    console.log(senders);
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Senders</h1>

                <Link
                    href="/senders/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Sender
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-5 py-3">Name</th>
                            <th className="text-left px-5 py-3">Sender Name</th>
                            <th className="text-left px-5 py-3">Email</th>
                            <th className="text-left px-5 py-3">Phone</th>
                            <th className="text-left px-5 py-3">Country</th>
                            <th className="text-center px-5 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {senders?.length > 0 ? (
                            senders.map((sender) => (
                                <tr
                                    key={sender.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-5 py-3">
                                        {sender.first_name} {sender.last_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {sender.sender_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {sender.email}
                                    </td>

                                    <td className="px-5 py-3">
                                        {sender.phone_number}
                                    </td>

                                    <td className="px-5 py-3">
                                        {sender.country}
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/senders/${sender.id}/edit`}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button className="bg-red-600 text-white px-3 py-1 rounded">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Senders Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
