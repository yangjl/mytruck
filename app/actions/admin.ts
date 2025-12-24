"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function getUsers() {
  await ensureAdmin();
  return await db.select().from(users).orderBy(users.createdAt);
}

export async function createUser(data: { email: string; name?: string; role?: string }) {
  await ensureAdmin();
  const { email, name = "", role = "employee" } = data;
  await db.insert(users).values({ email, name, role });
  revalidatePath("/dashboard/admin");
}

export async function updateUserRole(id: number, role: string) {
  await ensureAdmin();
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/dashboard/admin");
}

export async function deleteUser(id: number) {
  await ensureAdmin();
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/dashboard/admin");
}
