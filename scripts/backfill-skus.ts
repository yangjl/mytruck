import { db } from "../db/index";
import { inventoryItems } from "../db/schema";
import { eq } from "drizzle-orm";

async function generateUniqueSKU(name: string) {
  const slug = (name || "item")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 10);

  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();

  for (let i = 0; i < 20; i++) {
    const candidate = `${slug}-${rand()}`;
    const existing = await db.query.inventoryItems.findFirst({ where: eq(inventoryItems.sku, candidate) });
    if (!existing) return candidate;
  }

  return `${slug}-${Date.now().toString().slice(-6)}`;
}

async function backfill() {
  console.log("Starting SKU backfill...");

  const all = await db.select().from(inventoryItems);
  const items = all.filter((it) => !it.sku);
  console.log(`Found ${items.length} items without SKU`);

  for (const it of items) {
    const sku = await generateUniqueSKU(it.name || `item-${it.id}`);
    await db.update(inventoryItems).set({ sku }).where(eq(inventoryItems.id, it.id));
    console.log(`Updated item ${it.id} -> SKU ${sku}`);
  }

  console.log("Backfill complete.");
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
