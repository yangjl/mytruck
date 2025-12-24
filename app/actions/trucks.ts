"use server";

import { db } from "@/db";
import { trucks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTrucks() {
  return await db.select().from(trucks).orderBy(desc(trucks.createdAt));
}

export async function addTruck(name: string, status: string = "active", notes?: string) {
  await db.insert(trucks).values({
    name,
    status,
    notes,
  });
  revalidatePath("/dashboard/trucks");
}

export async function updateTruckStatus(id: number, status: string) {
  await db.update(trucks).set({ status }).where(eq(trucks.id, id));
  revalidatePath("/dashboard/trucks");
}
