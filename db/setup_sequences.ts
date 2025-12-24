import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const { db } = await import('./index');

  console.log('Creating sequences and setting defaults...');

  const tables = ['users', 'trucks', 'time_logs', 'maintenance_logs'];

  for (const t of tables) {
    try {
      await db.execute(`CREATE SEQUENCE IF NOT EXISTS "${t}_id_seq"`);
      await db.execute(`ALTER TABLE "${t}" ALTER COLUMN id SET DEFAULT nextval('${t}_id_seq')`);
      // set sequence to max(id) or 1
      await db.execute(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM "${t}"), 1))`);
      console.log(`Sequence and default set for ${t}`);
    } catch (err) {
      console.error(`Failed for ${t}:`, err);
    }
  }

  console.log('Done');
  process.exit(0);
}

main();
