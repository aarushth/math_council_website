import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {prisma} from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    id: number;
    admin: boolean;
  }

  interface Session {
    user: {
      id: number;
      name: string | null;
      email: string | null;
      admin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    admin: boolean;
  }
}
export default NextAuth({
    // Define the authentication providers
    providers: [
        GoogleProvider({
            // Set the Google client ID and client secret from environment variables
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    // Define callback functions to manage session and token
    callbacks: {
        // Modify the session object before it is returned to the client
        async signIn({ user }) {
            if (!user.email) return false;

            let existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });

            // Create user if none exists
            if (!existingUser) {
                existingUser = await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name || "",
                },
                });
            }

            // Attach Prisma user ID to the token in jwt() callback
            return true;
        },

        /** Attaches Prisma user data to JWT */
        async jwt({ token, user }) {
            // On first sign-in, user exists; on subsequent requests it does not
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.admin = dbUser.admin;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                }
            }
            return token;
        },

        /** Makes Prisma user fields available in the session returned to the client */
        async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as number;
            session.user.admin = token.admin as boolean;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
        }
        return session;
        },
    },
});