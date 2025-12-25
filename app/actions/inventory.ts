"use server";

import { db } from "@/db";
import { inventoryItems } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function generateUniqueSKU(name: string) {
  const slug = (name || "item")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 10);

  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();

  for (let i = 0; i < 10; i++) {
    const candidate = `${slug}-${rand()}`;
    const existing = await db.query.inventoryItems.findFirst({ where: eq(inventoryItems.sku, candidate) });
    if (!existing) return candidate;
  }

  // fallback
  return `${slug}-${Date.now().toString().slice(-6)}`;
}

async function checkManager() {
  const session = await auth();
  if (!session?.user || session.user.role !== "manager" && session.user.role !== "admin") {
    throw new Error("Unauthorized: Managers only");
  }
  return session.user;
}

export async function getInventoryItems() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
    // Return empty or throw? Let's return empty for safety in UI, but UI should block it too.
    return [];
  }

  return await db.select().from(inventoryItems).orderBy(
    asc(sql`(CASE WHEN quantity <= ${inventoryItems.minQuantity} THEN 0 ELSE 1 END)`),
    asc(inventoryItems.name)
  );
}

export async function addInventoryItem(data: {
  name: string;
  sku?: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location?: string;
  category?: string;
}) {
  await checkManager();

  const sku = data.sku && data.sku.trim() !== "" ? data.sku : await generateUniqueSKU(data.name);

  await db.insert(inventoryItems).values({
    ...data,
    sku,
    lastUpdated: new Date(),
  });

  revalidatePath("/dashboard/inventory");
}

import { createLowStockNotification } from "./notifications";

export async function updateInventoryItem(id: number, data: {
  name?: string;
  sku?: string;
  quantity?: number;
  minQuantity?: number;
  unit?: string;
  location?: string;
  category?: string;
}) {
  await checkManager();

  const currentItem = await db.query.inventoryItems.findFirst({
    where: eq(inventoryItems.id, id),
  });

  if (!currentItem) throw new Error("Item not found");

  await db.update(inventoryItems)
    .set({
      ...data,
      lastUpdated: new Date(),
    })
    .where(eq(inventoryItems.id, id));

  // Check for low stock transition
  if (data.quantity !== undefined && data.quantity <= (data.minQuantity ?? currentItem.minQuantity)) {
    // Only notify if it wasn't already low stock? Or always?
    // Let's notify if it wasn't low before, or if we are just updating quantity and it is now low.
    // Simple logic: if new quantity is low, and old quantity was not low, notify.
    if (currentItem.quantity > currentItem.minQuantity) {
       await createLowStockNotification(data.name ?? currentItem.name, id);
    }
  }

  revalidatePath("/dashboard/inventory");
}

export async function deleteInventoryItem(id: number) {
  await checkManager();

  await db.delete(inventoryItems).where(eq(inventoryItems.id, id));

  revalidatePath("/dashboard/inventory");
}
