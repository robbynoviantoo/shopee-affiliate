import { NextResponse } from "next/server";

const COOKIE_NAME = "affiliate_admin";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin", request.url), {
    status: 303,
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set(COOKIE_NAME, "", { ...cookieOptions, path: "/" });
  response.cookies.set(COOKIE_NAME, "", { ...cookieOptions, path: "/admin" });

  return response;
}
