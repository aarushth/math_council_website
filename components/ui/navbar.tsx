'use client'
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarMenuItem,
    Link,
    link,
} from '@heroui/react'
import clsx from 'clsx'
import { TbMathSymbols } from 'react-icons/tb'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/ui/buttons/ThemeSwitchButton'
import SignInButton from '@/components/ui/buttons/SignInButton'
import SignOutButton from '@/components/ui/buttons/SignOutButton'

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
            height={100}
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            position="sticky"
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <TbMathSymbols className="size-10 text-primary-300 mt-auto mb-5" />
                <NavbarBrand as="li" className="gap-8 max-w-fit mt-auto mb-6 ">
                    <Link
                        className={clsx(
                            link({ color: 'foreground' }),
                            'text-xl lg:text-xl underline-hover-active'
                        )}
                        href="/"
                    >
                        <p className="font-bold text-primary-300 mb-2 sm:mb-0 text-sm sm:text-xl">
                            EHS Math Council
                        </p>
                    </Link>
                </NavbarBrand>
                <ul className="hidden mt-auto mb-6 lg:flex gap-8 justify-start ml-2">
                    {navbarItems.map((item) => (
                        <Link
                            key={item.href}
                            className={clsx(
                                link({ color: 'foreground' }),
                                'underline-hover-active'
                            )}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
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
                                className="mb-3 underline-hover-active"
                                color="foreground"
                                href={item.href}
                                size="lg"
                                onPress={() => setIsMenuOpen(false)}
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
