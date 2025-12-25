"use server";

import { db } from "@/db";
import { timeLogs } from "@/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) {
    return parseInt(session.user.id);
  }
  return null;
}

export async function clockIn(notes?: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  // Check if already clocked in
  const activeLog = await db.query.timeLogs.findFirst({
    where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
  });

  if (activeLog) {
    throw new Error("Already clocked in");
  }

  await db.insert(timeLogs).values({
    userId,
    startTime: new Date(),
    notes,
    status: "active",
  });

  revalidatePath("/dashboard/time");
}

export async function clockOut(notes?: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const activeLog = await db.query.timeLogs.findFirst({
    where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
  });

  if (!activeLog) {
    throw new Error("Not clocked in");
  }

  await db.update(timeLogs)
    .set({
      endTime: new Date(),
      status: "completed",
      notes: notes ? `${activeLog.notes ? activeLog.notes + '\n' : ''}${notes}` : activeLog.notes,
    })
    .where(eq(timeLogs.id, activeLog.id));

  revalidatePath("/dashboard/time");
}

export async function getMyTimeLogs() {
  const userId = await getUserId();
  if (!userId) return [];

  return await db.select()
    .from(timeLogs)
    .where(eq(timeLogs.userId, userId))
    .orderBy(desc(timeLogs.startTime));
}

export async function getActiveTimeLog() {
  const userId = await getUserId();
  if (!userId) return null;

  return await db.query.timeLogs.findFirst({
    where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
  });
}

export async function logTimeManually(data: {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const startDateTime = new Date(`${data.date}T${data.startTime}`);
  let endDateTime = new Date(`${data.date}T${data.endTime}`);

  // Handle overnight shifts
  if (endDateTime < startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  await db.insert(timeLogs).values({
    userId,
    startTime: startDateTime,
    endTime: endDateTime,
    notes: data.notes,
    status: "completed",
  });

  revalidatePath("/dashboard/time");
}
