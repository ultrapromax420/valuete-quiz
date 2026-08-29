import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    } & DefaultSession["user"];
  }
}

const useSecureCookies = (
  process.env.AUTH_URL ||
  process.env.NEXTAUTH_URL ||
  ""
).startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const csrfPrefix = useSecureCookies ? "__Host-" : "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  useSecureCookies,
  secret: process.env.AUTH_SECRET,
  // localhost cookies are shared across ports, so quiz must not reuse
  // valuete-web's `authjs.session-token` or signing in here logs the web app out.
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.quiz-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.quiz-callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${csrfPrefix}authjs.quiz-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  logger: {
    error(error) {
      const err = error as {
        type?: string;
        name?: string;
        message?: string;
        cause?: { message?: string };
      };
      const haystack = [
        err?.type,
        err?.name,
        err?.message,
        err?.cause?.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (
        err?.type === "JWTSessionError" ||
        haystack.includes("jwtsessionerror") ||
        haystack.includes("no matching decryption secret")
      ) {
        return;
      }
      console.error("[auth][error]", error);
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/quiz/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            },
          );

          const data = await response.json();
          if (!data?.data?.token) {
            return null;
          }

          return data.data;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: any;
      user?: any;
    }) {
      if (user) {
        token.token = user.token;
        token.id = user.user.id;
        token.email = user.user.email;
        token.name = user.user.name;
        token.role = user.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.token = token.token as string;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: "/signin" },
});
