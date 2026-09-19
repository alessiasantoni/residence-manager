import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = secretKey ? new TextEncoder().encode(secretKey) : null;

async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token || !encodedKey) return false;
  try {
    await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    // firma non valida, token scaduto o manomesso
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    const token = request.cookies.get("session")?.value;
    const valid = await hasValidSession(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
