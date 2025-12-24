import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const { db } = await import('./index');
  const { sql } = await import('drizzle-orm');

  console.log('Dropping all tables...');
  
  try {
    await db.execute(sql`DROP TABLE IF EXISTS "maintenance_logs" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "time_logs" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "trucks" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
  
  process.exit(0);
}

main();
