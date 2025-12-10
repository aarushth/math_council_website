"use client";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
 
function SignInButton() {
  return (
    <button
      onClick={() => {
        console.log("Initiating Google sign-in");
        signIn("google", { prompt: "select_account" , callbackUrl: "https://silver-sniffle-6wv6gjj9wxgh4gvv-3001.app.github.dev"})
    }}
      className="flex items-center text-white justify-center px-4 py-2 rounded border-white border hover:bg-white hover:text-primary">
      <FaGoogle className="mr-2" />
      Sign in with Google
    </button>
  );
}
export default SignInButton;