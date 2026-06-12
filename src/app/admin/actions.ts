"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, isAdminAuthenticated, verifyPassword } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

function requireString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function getPrisma() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return (await import("@/lib/prisma")).prisma;
}

async function ensureCategory(name: string, sortOrder = 0) {
  const prisma = await getPrisma();
  const existingCategory = await prisma.category.findUnique({ where: { name } });

  if (existingCategory) {
    if (sortOrder !== existingCategory.sortOrder) {
      await prisma.category.update({ where: { id: existingCategory.id }, data: { sortOrder } });
    }
    return existingCategory;
  }

  return prisma.category.create({ data: { name, sortOrder } });
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

export async function saveCategoryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const name = requireString(formData, "categoryName");
  const sortOrder = Number(requireString(formData, "categorySortOrder") || "0");
  if (!name) redirect("/admin");

  await ensureCategory(name, sortOrder);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteCategoryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const id = requireString(formData, "id");
  if (!id) return;

  const prisma = await getPrisma();
  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin");
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

  const prisma = await getPrisma();
  await ensureCategory(payload.category);

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
  const prisma = await getPrisma();
  const id = requireString(formData, "id");
  if (id) await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
