import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const analyticsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("visit"),
    path: z.string().min(1).max(500),
    referrer: z.string().max(1000).optional().nullable(),
  }),
  z.object({
    type: z.literal("product_click"),
    productId: z.string().min(1).max(200),
    productName: z.string().min(1).max(300),
    targetUrl: z.string().url().max(1200),
    path: z.string().max(500).optional().nullable(),
    referrer: z.string().max(1000).optional().nullable(),
  }),
]);

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function parseUserAgent(userAgent: string | null) {
  const value = userAgent || "";
  const lowerValue = value.toLowerCase();

  const device = /mobile|android|iphone|ipod/.test(lowerValue) ? "Mobile" : /ipad|tablet/.test(lowerValue) ? "Tablet" : "Desktop";
  const browser = lowerValue.includes("edg/")
    ? "Edge"
    : lowerValue.includes("chrome/")
      ? "Chrome"
      : lowerValue.includes("safari/")
        ? "Safari"
        : lowerValue.includes("firefox/")
          ? "Firefox"
          : "Unknown";
  const os = lowerValue.includes("windows")
    ? "Windows"
    : lowerValue.includes("android")
      ? "Android"
      : lowerValue.includes("iphone") || lowerValue.includes("ipad") || lowerValue.includes("ios")
        ? "iOS"
        : lowerValue.includes("mac os")
          ? "macOS"
          : lowerValue.includes("linux")
            ? "Linux"
            : "Unknown";

  return { device, browser, os };
}

export async function POST(request: Request) {
  try {
    const body = analyticsSchema.parse(await request.json());
    const headerStore = await headers();
    const userAgent = headerStore.get("user-agent");
    const ipAddress =
      firstHeaderValue(headerStore.get("x-forwarded-for")) ||
      headerStore.get("x-real-ip") ||
      headerStore.get("cf-connecting-ip") ||
      headerStore.get("x-vercel-forwarded-for") ||
      null;
    const country = headerStore.get("x-vercel-ip-country") || null;
    const city = headerStore.get("x-vercel-ip-city") || null;
    const parsedUserAgent = parseUserAgent(userAgent);
    const { prisma } = await import("@/lib/prisma");

    if (body.type === "visit") {
      await prisma.visit.create({
        data: {
          path: body.path,
          referrer: body.referrer || null,
          ipAddress,
          userAgent,
          country,
          city,
          ...parsedUserAgent,
        },
      });
    } else {
      await prisma.productClick.create({
        data: {
          productId: body.productId,
          productName: body.productName,
          targetUrl: body.targetUrl,
          path: body.path || null,
          referrer: body.referrer || null,
          ipAddress,
          userAgent,
          country,
          city,
          ...parsedUserAgent,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
