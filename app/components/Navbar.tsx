"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

export default function Navbar() {
    const path = usePathname();

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Chat", href: "/chat" },
        { name: "Translator", href: "/translator" },
        { name: "Settings", href: "/settings" },
        { name: "Missing", href: "/missing" },
    ];

    return (
        <div className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-14">
                <Link href="/" className="font-bold text-lg">Anuvaad</Link>

                <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm ${path === item.href ? "text-black font-semibold" : "text-gray-500"
                                } hover:text-black`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <LangSwitcher />
                </div>
            </div>
        </div>
    );
}
