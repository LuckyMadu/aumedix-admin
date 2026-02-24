import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "medix-admin-dev-secret-change-in-production",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dev credentials bypass — remove in production
        if (
          credentials.email === "admin@aumedix.com" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "dev-admin-001",
            email: "admin@aumedix.com",
            name: "Dev Admin",
            role: "super_admin",
            accessToken: "dev-token-placeholder",
          };
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/prod/v1/admin/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) return null;

          const data = await res.json();
          return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            accessToken: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
};

export function auth() {
  return getServerSession(authOptions);
}
