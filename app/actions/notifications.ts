"use server";

import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.select()
    .from(notifications)
    .where(eq(notifications.userId, parseInt(session.user.id)))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  await db.update(notifications)
    .set({ read: true })
    .where(and(
      eq(notifications.id, id),
      eq(notifications.userId, parseInt(session.user.id))
    ));

  revalidatePath("/dashboard");
}

export async function createLowStockNotification(itemName: string, itemId: number) {
  // Find all managers
  const managers = await db.select().from(users).where(eq(users.role, "manager"));
  const admins = await db.select().from(users).where(eq(users.role, "admin"));
  
  const recipients = [...managers, ...admins];
  // Deduplicate by ID
  const uniqueRecipients = Array.from(new Map(recipients.map(item => [item.id, item])).values());

  for (const recipient of uniqueRecipients) {
    await db.insert(notifications).values({
      userId: recipient.id,
      title: "Low Stock Alert",
      message: `Item "${itemName}" is running low on stock.`,
      type: "low_stock",
      relatedId: itemId,
    });
  }
}
