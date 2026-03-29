import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Hardcoded fallback if DB is not set up perfectly yet
          if (
            credentials.email === (process.env.ADMIN_EMAIL || "admin@admin.com") &&
            credentials.password === (process.env.ADMIN_PASSWORD || "admin")
          ) {
            return { id: "1", email: credentials.email, name: "Admin" };
          }

          // DB fallback check
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);

          if (user.length > 0) {
            const isValid = await bcrypt.compare(credentials.password, user[0].password);
            if (isValid) {
              return { id: user[0].id, email: user[0].email, name: "Admin" };
            }
          }
          return null;
        } catch (e) {
          console.error("Auth error", e);
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
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
};
