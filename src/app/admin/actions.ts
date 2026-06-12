"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, isAdminAuthenticated, verifyPassword } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

function requireString(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

export async function loginAction(formData: FormData) {
  const password = requireString(formData, "password");
  if (!verifyPassword(password)) {
    redirect("/admin?error=Password%20salah");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin");
}

export async function saveProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const id = requireString(formData, "id");
  const payload = productSchema.parse({
    name: requireString(formData, "name"),
    description: requireString(formData, "description") || undefined,
    price: requireString(formData, "price") || undefined,
    category: requireString(formData, "category"),
    imageUrl: requireString(formData, "imageUrl"),
    affiliateUrl: requireString(formData, "affiliateUrl"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    sortOrder: requireString(formData, "sortOrder") || "0",
  });

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const { prisma } = await import("@/lib/prisma");

  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const { prisma } = await import("@/lib/prisma");
  const id = requireString(formData, "id");
  if (id) await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

