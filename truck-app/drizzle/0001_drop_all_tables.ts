import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  await db.execute(sql`DROP TABLE IF EXISTS "maintenance_logs" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "time_logs" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "trucks" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);
}

export async function down(db: any) {
  // No down migration needed as we are dropping tables
}
