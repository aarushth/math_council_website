'use client'

import type { ThemeProviderProps } from 'next-themes'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastProvider } from '@heroui/toast'
import { HeroUIProvider } from '@heroui/system'

export interface ProvidersProps {
    children: React.ReactNode
    themeProps?: ThemeProviderProps
}

declare module '@react-types/shared' {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>['push']>[1]
        >
    }
}

export function UIProviders({ children, themeProps }: ProvidersProps) {
    const router = useRouter()

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ToastProvider
                    placement="top-center"
                    toastProps={{
                        timeout: 4000,
                        shouldShowTimeoutProgress: true,
                        color: 'danger',
                    }}
                />
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    )
}
