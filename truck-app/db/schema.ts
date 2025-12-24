import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').notNull().default('user'), // user, admin
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trucks = pgTable('trucks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull().default('active'), // active, maintenance, out_of_service
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const timeLogs = pgTable('time_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  breakDuration: integer('break_duration').default(0), // in minutes
  notes: text('notes'),
  status: text('status').notNull().default('active'), // active, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const maintenanceLogs = pgTable('maintenance_logs', {
  id: serial('id').primaryKey(),
  truckId: integer('truck_id').references(() => trucks.id),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  type: text('type').notNull(), // maintenance, inspection, wash
  cost: integer('cost').notNull().default(0), // in cents
  vendor: text('vendor'),
  notes: text('notes'),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
