import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import bcrypt from 'bcryptjs';

async function main() {
  const { db } = await import('./index');
  const { users, trucks } = await import('./schema');
  const { eq } = await import('drizzle-orm');

  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const usersToCreate = [
    {
      email: 'admin@mytruck.com',
      name: 'Admin User',
      role: 'admin',
      password: hashedPassword,
    },
    {
      email: 'manager@mytruck.com',
      name: 'Manager User',
      role: 'manager',
      password: hashedPassword,
    },
    {
      email: 'employee@mytruck.com',
      name: 'Employee User',
      role: 'employee',
      password: hashedPassword,
    },
  ];

  for (const user of usersToCreate) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser) {
      await db.insert(users).values(user);
      console.log(`Created user: ${user.email}`);
    } else {
      await db.update(users).set({ password: user.password }).where(eq(users.email, user.email));
      console.log(`Updated user password: ${user.email}`);
    }
  }

  // Create Trucks
  const trucksToCreate = [
    { name: 'Truck #101', status: 'active', notes: '2020 Freightliner' },
    { name: 'Truck #102', status: 'active', notes: '2021 Volvo' },
    { name: 'Truck #103', status: 'maintenance', notes: 'Needs oil change' },
  ];

  for (const truck of trucksToCreate) {
    const existingTruck = await db.query.trucks.findFirst({
      where: eq(trucks.name, truck.name),
    });

    if (!existingTruck) {
      await db.insert(trucks).values(truck);
      console.log(`Created truck: ${truck.name}`);
    } else {
      console.log(`Truck already exists: ${truck.name}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
