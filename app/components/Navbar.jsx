"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar(){
    const router = useRouter()

    const links = [
        {href: "/dashboard", label: "Dashboard"},
        {href: "/vault", label: "Vault"},
        {href: "/settings", label: "Settings"},
        {href: "/profile", label: "Profile"},
    ]

    return(
        <div className="fixed bottom-0 bg-red-500 flex items-center p-4 w-full">
            asdasd
        </div>
    )
}