import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";

const allowEmailLogin =
  process.env.AUTH_ALLOW_EMAIL_LOGIN === "true" ||
  process.env.NODE_ENV !== "production";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "Pulseboard <onboarding@resend.dev>",
    }),
  );
}

if (allowEmailLogin) {
  providers.push(
    Credentials({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        intent: { label: "Intent", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const intent = String(credentials?.intent ?? "signin");
        const name = String(credentials?.name ?? "").trim();
        if (!email.includes("@")) return null;

        if (intent === "signup") {
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) return null;
          const user = await prisma.user.create({
            data: {
              email,
              name: name || email.split("@")[0],
            },
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  );
}

const useAdapter = Boolean(
  process.env.GOOGLE_CLIENT_ID || process.env.RESEND_API_KEY,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: useAdapter ? PrismaAdapter(prisma) : undefined,
  providers,
});

export const authFlags = {
  google: Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  ),
  resend: Boolean(process.env.RESEND_API_KEY),
  emailLogin: allowEmailLogin,
};
