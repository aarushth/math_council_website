"use client";
import { signOut } from "next-auth/react";
function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/Login" })}
      className="px-8 py-2 self-center text-white border rounded-lg text-xl text-heading font-semibold whitespace-nowrap"
    >
      Logout
    </button>
  );
}
export default LogoutButton;