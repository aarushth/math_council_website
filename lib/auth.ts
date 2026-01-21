import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { prisma } from '@/prisma/prisma'

declare module 'next-auth' {
    interface User {
        id: number
        admin: boolean
    }

    interface Session {
        user: {
            id: number
            name: string | null
            email: string | null
            admin: boolean
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number
        admin: boolean
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'select_account',
                    response_type: 'code',
                },
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false

            let existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            })

            if (!existingUser) {
                existingUser = await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name || '',
                        admin: false,
                        picture: user.image,
                    },
                })
            }

            return true
        },

        async jwt({ token, user }) {
            if (!token.id && user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                })

                if (dbUser) {
                    token.id = dbUser.id
                    token.admin = dbUser.admin
                    token.email = dbUser.email
                    token.name = dbUser.name
                }

                return token
            }

            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id },
                })

                if (dbUser) {
                    token.admin = dbUser.admin
                }
            }

            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as number
                session.user.admin = token.admin as boolean
                session.user.name = token.name as string
                session.user.email = token.email as string
            }

            return session
        },
    },
}
