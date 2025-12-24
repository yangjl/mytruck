"use server";

import { db } from "@/db";
import { maintenanceLogs, users, trucks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) {
    return parseInt(session.user.id);
  }
  return null;
}

export async function logMaintenance(data: {
  truckId: number;
  date: Date;
  type: string;
  cost: number;
  vendor?: string;
  notes?: string;
  attachmentUrl?: string;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(maintenanceLogs).values({
    userId,
    truckId: data.truckId,
    date: data.date,
    type: data.type,
    cost: data.cost,
    vendor: data.vendor,
    notes: data.notes,
    attachmentUrl: data.attachmentUrl,
  });

  revalidatePath("/dashboard/maintenance");
}

export async function getMaintenanceLogs() {
  return await db.select({
    id: maintenanceLogs.id,
    date: maintenanceLogs.date,
    type: maintenanceLogs.type,
    cost: maintenanceLogs.cost,
    vendor: maintenanceLogs.vendor,
    notes: maintenanceLogs.notes,
    truckName: trucks.name,
    userName: users.name,
  })
  .from(maintenanceLogs)
  .leftJoin(trucks, eq(maintenanceLogs.truckId, trucks.id))
  .leftJoin(users, eq(maintenanceLogs.userId, users.id))
  .orderBy(desc(maintenanceLogs.date));
}
