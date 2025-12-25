import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

function makeSKU(name: string) {
  const slug = (name || "item")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 10);
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${slug}-${rand()}`;
}

async function uniqueSKU(name: string) {
  for (let i = 0; i < 20; i++) {
    const candidate = makeSKU(name);
    const r: any = await sql.query(`SELECT 1 FROM inventory_items WHERE sku = $1 LIMIT 1`, [candidate]);
    if (!r || (Array.isArray(r) && r.length === 0)) return candidate;
  }
  return `${(name || 'ITEM').toUpperCase().slice(0,6)}-${Date.now().toString().slice(-6)}`;
}

async function backfill() {
  console.log("Starting SKU backfill via neon...");
  const rows: any[] = await sql.query(`SELECT id, name FROM inventory_items WHERE sku IS NULL OR sku = ''`);
  console.log(`Found ${rows.length} items without SKU`);
  for (const r of rows) {
    const sku = await uniqueSKU(r.name || `item-${r.id}`);
    await sql.query(`UPDATE inventory_items SET sku = $1 WHERE id = $2`, [sku, r.id]);
    console.log(`Updated item ${r.id} -> SKU ${sku}`);
  }
  console.log("Backfill complete.");
}

backfill().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
