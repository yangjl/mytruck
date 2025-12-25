"use server";

import { db } from "@/db";
import { procurementOrders, inventoryItems, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkManager() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
    throw new Error("Unauthorized: Managers only");
  }
  return session.user;
}

export async function getProcurementOrders() {
  await checkManager();

  return await db.select({
    id: procurementOrders.id,
    status: procurementOrders.status,
    quantity: procurementOrders.quantity,
    notes: procurementOrders.notes,
    createdAt: procurementOrders.createdAt,
    updatedAt: procurementOrders.updatedAt,
    itemName: inventoryItems.name,
    itemUnit: inventoryItems.unit,
    assignedUser: users.name,
  })
    .from(procurementOrders)
    .leftJoin(inventoryItems, eq(procurementOrders.inventoryItemId, inventoryItems.id))
    .leftJoin(users, eq(procurementOrders.assignedUserId, users.id))
    .orderBy(desc(procurementOrders.createdAt));
}

export async function createProcurementOrder(data: {
  inventoryItemId: number;
  assignedUserId?: number;
  quantity: number;
  notes?: string;
}) {
  await checkManager();

  await db.insert(procurementOrders).values({
    ...data,
    status: "Pending",
  });

  revalidatePath("/dashboard/inventory");
}

export async function updateProcurementStatus(id: number, status: string) {
  await checkManager();

  const order = await db.query.procurementOrders.findFirst({
    where: eq(procurementOrders.id, id),
  });

  if (!order) throw new Error("Order not found");

  await db.update(procurementOrders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(procurementOrders.id, id));

  // If status is Restocked, update inventory
  if (status === "Restocked") {
    const item = await db.query.inventoryItems.findFirst({
      where: eq(inventoryItems.id, order.inventoryItemId),
    });

    if (item) {
      await db.update(inventoryItems)
        .set({
          quantity: item.quantity + order.quantity,
          lastUpdated: new Date(),
        })
        .where(eq(inventoryItems.id, order.inventoryItemId));
    }
  }

  revalidatePath("/dashboard/inventory");
}

export async function getEmployees() {
  await checkManager();
  return await db.select().from(users);
}
