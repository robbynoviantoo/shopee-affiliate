import { NextResponse } from "next/server";

const COOKIE_NAME = "affiliate_admin";

function clearAdminCookies(response: NextResponse) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set(COOKIE_NAME, "", { ...cookieOptions, path: "/" });
  response.cookies.set(COOKIE_NAME, "", { ...cookieOptions, path: "/admin" });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  return response;
}

export async function GET(request: Request) {
  return clearAdminCookies(
    NextResponse.redirect(new URL("/admin?logged_out=1", request.url), {
      status: 303,
    }),
  );
}

export async function POST(request: Request) {
  return clearAdminCookies(
    NextResponse.redirect(new URL("/admin?logged_out=1", request.url), {
      status: 303,
    }),
  );
}
