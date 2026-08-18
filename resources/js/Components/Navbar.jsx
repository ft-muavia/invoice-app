import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="h-16 bg-white shadow px-6 flex items-center justify-between">

            <div className="relative w-80">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border rounded-lg py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center gap-5">

                <Bell className="cursor-pointer" size={22} />

                <div className="flex items-center gap-2 cursor-pointer">

                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <User size={18} />
                    </div>

                    <div>
                        <h1 className="font-semibold">Admin</h1>
                        <p className="text-sm text-gray-500">
                            Administrator
                        </p>
                    </div>

                </div>

            </div>

        </nav>
    );
}