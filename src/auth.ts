import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = ["agentperrow@gmail.com", "mperrow@gmail.com"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
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
