import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicExact = new Set(["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/accept-invite"]);
const publicPrefixes = ["/api/auth", "/book"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicExact.has(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
