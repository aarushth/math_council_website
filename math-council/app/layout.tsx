import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import Navbar from "@/components/Navbar";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Recommended for optimal font loading
  variable: '--font-poppins', // Defines a CSS variable for easy use
  weight: ['400', '700'], // Specify desired weights
});

export const metadata: Metadata = {
  title: "Math Council website",
  description: "Eastlake's Official Math Council Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="bg-back">
        <ClientProvider>
            <Navbar/>
            {children}
        </ClientProvider>
      </body>
    </html>
  );
}
