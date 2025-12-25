Backfill SKUs

This script populates missing `sku` values for rows in the `inventory_items` table.

Run locally with:

```bash
# from repository root
pnpm ts-node scripts/backfill-skus.ts
# or
npx ts-node scripts/backfill-skus.ts
```

Notes
- The script uses the same SKU generation strategy as `addInventoryItem`.
- It updates rows where `sku IS NULL`.
- Make sure your `.env.local` has `DATABASE_URL` set and accessible.
