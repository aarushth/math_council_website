import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)'],
                mono: ['var(--font-mono)'],
            },
        },
    },
    darkMode: 'class',
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        primary: {
                            50: '#004743',
                            100: '#007169',
                            200: '#009a90',
                            300: '#00c4b7',
                            400: '#00edde',
                            500: '#2df0e4',
                            600: '#59f3ea',
                            700: '#86f6ef',
                            800: '#b3faf5',
                            900: '#dffdfb',
                            foreground: '#000',
                            DEFAULT: '#00edde',
                        },

                        background: '#ffffff',
                        foreground: '#000000',
                        content1: {
                            DEFAULT: '#ffffff',
                            foreground: '#000',
                        },
                        content2: {
                            DEFAULT: '#f4f4f5',
                            foreground: '#000',
                        },
                        content3: {
                            DEFAULT: '#e4e4e7',
                            foreground: '#000',
                        },
                        content4: {
                            DEFAULT: '#d4d4d8',
                            foreground: '#000',
                        },
                        focus: '#006FEE',
                        overlay: '#ffffff',
                    },
                },
                dark: {
                    colors: {
                        primary: {
                            50: '#004743',
                            100: '#007169',
                            200: '#009a90',
                            300: '#00c4b7',
                            400: '#00edde',
                            500: '#2df0e4',
                            600: '#59f3ea',
                            700: '#86f6ef',
                            800: '#b3faf5',
                            900: '#dffdfb',
                            foreground: '#000',
                            DEFAULT: '#00edde',
                        },
                        background: '#000000',
                        foreground: '#ffffff',
                        content1: {
                            DEFAULT: '#18181b',
                            foreground: '#fff',
                        },
                        content2: {
                            DEFAULT: '#27272a',
                            foreground: '#fff',
                        },
                        content3: {
                            DEFAULT: '#3f3f46',
                            foreground: '#fff',
                        },
                        content4: {
                            DEFAULT: '#52525b',
                            foreground: '#fff',
                        },
                        focus: '#006FEE',
                        overlay: '#000000',
                    },
                },
            },
            layout: {
                disabledOpacity: '0.5',
            },
        }),
    ],
}

module.exports = config
