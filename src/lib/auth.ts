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
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.warn("Authorize missing credentials");
          return null;
        }

        try {
          // Hardcoded fallback if DB is not set up perfectly yet
          const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
          const adminPass = process.env.ADMIN_PASSWORD || "admin";

          if (
            credentials.email === adminEmail &&
            credentials.password === adminPass
          ) {
            console.log("Authorize successful via fallback/env");
            return { id: "1", email: credentials.email, name: "Admin" };
          }

          if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is missing, cannot check DB");
            return null;
          }

          // DB fallback check
          console.log("Checking DB for user:", credentials.email);
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);

          if (user.length > 0) {
            const isValid = await bcrypt.compare(credentials.password, user[0].password);
            if (isValid) {
              console.log("Authorize successful via DB");
              return { id: user[0].id, email: user[0].email, name: "Admin" };
            }
          }
          console.warn("Authorize failed: invalid credentials");
          return null;
        } catch (e) {
          console.error("Authorize error caught:", e);
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
