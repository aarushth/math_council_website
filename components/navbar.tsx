'use client'
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenuItem,
} from '@heroui/navbar'

import { Link, Image } from '@heroui/react'
import { link as linkStyles } from '@heroui/theme'
import NextLink from 'next/link'
import clsx from 'clsx'

import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/theme-switch'
import { TbMathSymbols } from 'react-icons/tb'
import { useSession } from 'next-auth/react'
import SignInButton from '@/components/SignInButton'
import SignOutButton from '@/components/LogoutButton'
import { useState } from 'react'

export const Navbar = () => {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = session?.user
    const navbarItems = [
        ...siteConfig.navItems,
        ...(user?.admin ? [{ label: 'Admin', href: '/admin' }] : []),
    ]
    return (
        <HeroUINavbar
            maxWidth="xl"
            height={100}
            position="sticky"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <TbMathSymbols className="size-10 text-primary-300 mt-auto mb-5" />
                <NavbarBrand as="li" className="gap-8 max-w-fit mt-auto mb-6 ">
                    <NextLink
                        href="/"
                        className={clsx(
                            linkStyles({ color: 'foreground' }),
                            'text-xl lg:text-xl underline-hover-active'
                        )}
                    >
                        <p className="font-bold text-primary-300 text-lg sm:text-base">
                            EHS Math Council
                        </p>
                    </NextLink>
                </NavbarBrand>
                <ul className="hidden mt-auto mb-6 lg:flex gap-8 justify-start ml-2">
                    {navbarItems.map((item) => (
                        <NextLink
                            href={item.href}
                            key={item.href}
                            className={clsx(
                                linkStyles({ color: 'foreground' }),
                                'underline-hover-active'
                            )}
                        >
                            {item.label}
                        </NextLink>
                    ))}
                </ul>
            </NavbarContent>

            <NavbarContent
                className="hidden lg:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                {!user ? <SignInButton /> : <SignOutButton />}
                <ThemeSwitch />
            </NavbarContent>

            <NavbarContent
                className="hidden md:flex lg:hidden basis-1 pl-4"
                justify="end"
            >
                {!user ? <SignInButton /> : <SignOutButton />}
                <ThemeSwitch />
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent
                className="flex md:hidden basis-1 pl-4"
                justify="end"
            >
                <ThemeSwitch />
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarMenu>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {navbarItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                color="foreground"
                                href={item.href}
                                size="lg"
                                onPress={() => setIsMenuOpen(false)}
                                className="mb-3 underline-hover-active"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                    {user ? <SignOutButton /> : <SignInButton />}
                </div>
            </NavbarMenu>
        </HeroUINavbar>
    )
}
