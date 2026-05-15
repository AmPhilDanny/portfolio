/**
 * NovaxFolio Authentication Configuration
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

/**
 * Main Next-Auth Options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Hardcoded fallback/env check
          const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
          const adminPass = process.env.ADMIN_PASSWORD || "admin";

          if (credentials.email === adminEmail && credentials.password === adminPass) {
            return { id: "admin-env-id", email: credentials.email, name: "Admin" };
          }

          const db = await getDb();
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return { id: user._id.toString(), email: user.email, name: "Admin" };
            }
          }
          return null;
        } catch (e) {
          console.error("Authorize error:", e);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
