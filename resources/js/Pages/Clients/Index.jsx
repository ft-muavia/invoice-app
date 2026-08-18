import React from "react";
import Layout from "../../Components/Layout";
import { Link, router } from "@inertiajs/react";

export default function Index({ clients }) {
    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this client? This action cannot be undone.",
            )
        ) {
            router.delete(route("clients.destroy", id));
        }
    };
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Clients</h1>

                <Link
                    href="/clients/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Client
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-5 py-3">Logo</th>
                            <th className="text-left px-5 py-3">Name</th>
                            <th className="text-left px-5 py-3">Company</th>
                            <th className="text-left px-5 py-3">Email</th>
                            <th className="text-left px-5 py-3">Phone</th>
                            <th className="text-left px-5 py-3">Address</th>
                            <th className="text-center px-5 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-5 py-3">
                                        {client.logo ? (
                                            <img
                                                src={`/storage/${client.logo}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                                {client.first_name.charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-5 py-3">
                                        {client.first_name} {client.last_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {client.company_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {client.email}
                                    </td>

                                    <td className="px-5 py-3">
                                        {client.phone}
                                    </td>

                                    <td className="px-5 py-3">
                                        {client.address_line_1}
                                        {client.address_line_2 && <br />}
                                        {client.city}, {client.postal_code}
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/clients/${client.id}/edit`}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button onClick={() => handleDelete(client.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
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
                                    colSpan="7"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Clients Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
