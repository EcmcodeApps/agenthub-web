import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/politica-privacidad"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith("/api/")
  );
  if (isPublic) return NextResponse.next();

  const isProtected =
    pathname.startsWith("/app") || pathname.startsWith("/admin");
  if (!isProtected) return NextResponse.next();

  // Auth check disabled in development — re-enable before production
  if (process.env.NODE_ENV === "production") {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
