'use client';

import Link from 'next/link';
import { useSession } from "next-auth/react";
import SignInButton from "@/components/SignInButton";
import LogoutButton from "@/components/LogoutButton";

const Navbar = () => {
    const { data: session, status } = useSession();

    const user = session?.user;

    return (
    <nav className="w-full px-24 py-6 bg-primary text flex justify-between items-center">
        <div className="flex gap-30">
            <Link className="text-white text-xl" href="/">Home</Link>
            <Link className="text-white text-xl" href="/events">Registrations</Link>
        </div>

        <div className="flex gap-4">
        {!user ? (
            <SignInButton/>
        ) : (
            <LogoutButton/>
        )}
        </div>
    </nav>
    );
}

export default Navbar;