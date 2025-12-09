"use client";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
 
function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { prompt: "select_account" })}
      className="flex items-center text-white justify-center px-4 py-2 rounded border-white border hover:bg-white hover:text-primary"
    >
      <FaGoogle className="mr-2" />
      Sign in with Google
    </button>
  );
}
export default SignInButton;