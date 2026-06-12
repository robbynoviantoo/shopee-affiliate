import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "affiliate_admin";

function secret() {
  return process.env.SESSION_SECRET || "dev-secret-change-this-before-production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  if (passwordBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(passwordBuffer, expectedBuffer);
}

export async function createAdminSession() {
  const value = `admin.${Date.now()}`;
  const token = `${value}.${sign(value)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const expiredCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
  };

  cookieStore.set(COOKIE_NAME, "", { ...expiredCookie, path: "/admin" });
  cookieStore.set(COOKIE_NAME, "", { ...expiredCookie, path: "/" });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length < 3) return false;
  const value = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];
  return sign(value) === signature;
}

