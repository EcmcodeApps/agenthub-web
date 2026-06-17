import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/registro",
  "/onboarding",
  "/politica-privacidad",
  "/precios",
  "/industrias",
  "/contacto",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/");

  if (isPublic) return NextResponse.next();

  // Auth guard is handled client-side in app/app/layout.tsx
  // Firebase Auth uses localStorage, not cookies, so middleware cannot check it here
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
