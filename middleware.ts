import { NextResponse } from "next/server";
import { auth } from "@/auth";

const SESSION_COOKIE_NAMES = [
  "authjs.quiz-session-token",
  "__Secure-authjs.quiz-session-token",
];

const PUBLIC_PATHS = ["/", "/signin", "/signup", "/pending"];

const SAFE_NEXT_PATHS = [
  "/participate",
  "/vote",
  "/referrals",
  "/rewards",
];

function withClearedStaleSession(
  req: { auth?: unknown; cookies: { has: (name: string) => boolean } },
  response: NextResponse,
) {
  if (req.auth) {
    return response;
  }

  for (const name of SESSION_COOKIE_NAMES) {
    if (req.cookies.has(name)) {
      response.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
  }

  return response;
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
}

function getSafeNext(value: string | null) {
  if (value && SAFE_NEXT_PATHS.includes(value)) {
    return value;
  }
  return "/participate";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname === "/") {
    if (isLoggedIn) {
      return withClearedStaleSession(
        req,
        NextResponse.redirect(new URL("/participate", req.url)),
      );
    }
    return withClearedStaleSession(req, NextResponse.next());
  }

  if (pathname === "/quiz") {
    return withClearedStaleSession(
      req,
      NextResponse.redirect(
        new URL(isLoggedIn ? "/participate" : "/signin?next=/participate", req.url),
      ),
    );
  }

  if (!isLoggedIn && !isPublicPath(pathname)) {
    const nextQuery = SAFE_NEXT_PATHS.includes(pathname)
      ? `?next=${encodeURIComponent(pathname)}`
      : "";
    return withClearedStaleSession(
      req,
      NextResponse.redirect(new URL(`/signin${nextQuery}`, req.url)),
    );
  }

  if (isLoggedIn && (pathname === "/signin" || pathname === "/signup")) {
    const next = getSafeNext(req.nextUrl.searchParams.get("next"));
    return withClearedStaleSession(
      req,
      NextResponse.redirect(new URL(next, req.url)),
    );
  }

  return withClearedStaleSession(req, NextResponse.next());
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg|logo.png).*)"],
};
