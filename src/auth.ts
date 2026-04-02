import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = ["agentperrow@gmail.com", "mperrow@gmail.com"];

const hasAuthConfig = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const authConfig = hasAuthConfig
  ? NextAuth({
      trustHost: true,
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
    })
  : {
      handlers: { GET: () => new Response("Auth not configured", { status: 503 }), POST: () => new Response("Auth not configured", { status: 503 }) },
      signIn: async () => {},
      signOut: async () => {},
      auth: async () => null,
    };

export const { handlers, signIn, signOut, auth } = authConfig as any;
