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
          "md": "rounded-lg dark:border-cyan-600 dark:bg-cyan-100 dark:text-cyan-600 dark:focus:border-cyan-800 border-cyan-600 bg-cyan-100 text-cyan-600 focus:border-cyan-800"
        },
      },
    },
    "label": {
      "default": {
        "filled": {
          "md": "text-cyan-600 peer-focus:text-cyan-600 dark:text-cyan-600 peer-focus:dark:text-cyan-600"
        }
      },
    }
  },
  dropdown:{
	"floating": {
		"base": "py-0",
		"hidden": "py-0",
		"item": {
			"container": "py-0",
			"base": "bg-cyan-100 text-cyan-800 hover:bg-cyan-800 hover:text-cyan-100 focus:bg-cyan-800 focus:text-cyan-100 dark:bg-cyan-100 dark:text-cyan-800 dark:hover:bg-cyan-800 dark:hover:text-cyan-100 dark:focus:bg-cyan-800 dark:focus:text-cyan-100",
		},
		"style": {
			"dark": "bg-cyan-100 dark:bg-cyan-100 text-white dark:bg-gray-700",
			"light": "border border-gray-200 bg-white text-gray-900",
			"auto": "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
		},
		"target": "text-cyan-600 w-fit bg-cyan-100 border-none border-b-100 border-cyan-600 py-0"
	},
	"inlineWrapper": "flex items-center"
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
