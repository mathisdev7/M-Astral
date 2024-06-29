import { env } from "@/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { Session } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();
const prismaAdapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prismaAdapter,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.username = user.username;
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      token.id = user.id;
      token.role = user.role;
      token.username = user.username;
      return token;
    },
  },
});

prisma.$disconnect();
