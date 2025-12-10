import type { Metadata } from "next";
import "@/app/globals.css";
import ClientProvider from "@/components/ClientProvider";
import Navbar from "@/components/Navbar";
import { Poppins } from 'next/font/google';
import { createTheme, ThemeProvider } from "flowbite-react";

const customTheme = createTheme({
  floatingLabel:{
    "input": {
      "default": {
        "filled": {
          "sm": "peer block w-full appearance-none rounded-lg border-0 border-b-2 border-cyan-500 bg-gray-50 px-2.5 pb-2.5 pt-5 text-xs text-cyan-600 focus:border-primary-600 focus:outline-none focus:ring-0 dark:border-cyan-600 dark:bg-cyan-400/70 dark:text-cyan-900 dark:focus:border-cyan-600",
          "md": "peer block w-full appearance-none rounded-lg border-0 border-b-2 border-cyan-500 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-cyan-600 focus:border-primary-600 focus:outline-none focus:ring-0 dark:border-cyan-600 dark:bg-cyan-100 dark:text-cyan-900 dark:focus:border-cyan-600"
        },
      },
    },
    "label": {
      "default": {
        "filled": {
          "sm": "absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-xs text-cyan-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-cyan-600 dark:text-cyan-600 peer-focus:dark:text-cyan-600",
          "md": "absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-sm text-cyan-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-cyan-600 dark:text-cyan-600 peer-focus:dark:text-cyan-600"
        }
      },
    }
  }
});



const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Recommended for optimal font loading
  variable: '--font-poppins', // Defines a CSS variable for easy use
  weight: ['400', '700'], // Specify desired weights
});

export const metadata: Metadata = {
  title: "Math Council website",
  description: "The Official website for Eastlake Math Council Website",
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
            <ThemeProvider theme={customTheme}>
                <Navbar/>
                {children}
            </ThemeProvider>
          </ClientProvider>
        </body>
      </html>
  );
}
