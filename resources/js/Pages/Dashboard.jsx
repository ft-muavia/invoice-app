import Layout from "@/Components/Layout";

export default function Dashboard(props) {
    const { clientsCount, itemsCount, invoicesCount } = props;

    return (
        <Layout>

            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-5">

                <div className="bg-white rounded-lg shadow p-5">
                    <h2>Total Clients</h2>
                    <p className="text-3xl font-bold mt-3">{props.clientsCount}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-5">
                    <h2>Total Items</h2>
                    <p className="text-3xl font-bold mt-3">{itemsCount}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-5">
                    <h2>Total Invoices</h2>
                    <p className="text-3xl font-bold mt-3">{invoicesCount}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-5">
                    <h2>Revenue</h2>
                    <p className="text-3xl font-bold mt-3">$15,000</p>
                </div>

            </div>

        </Layout>
    );
}