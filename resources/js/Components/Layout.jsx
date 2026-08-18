import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        // <div className="flex bg-gray-100">

        //     <Sidebar />

        //     <div className="flex-1">

        //         <Navbar />

        //         <main className="p-6">
        //             {children}
        //         </main>

        //     </div>

        // </div>

        <>
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-6">{children}</main>
            </div>
        </>
    );
}
