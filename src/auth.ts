import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = ["agentperrow@gmail.com", "mperrow@gmail.com"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session }) {
      if (session.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        (session as any).isAdmin = true;
      }
      return session;
    },
  },
});
