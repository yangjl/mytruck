import { pgTable, text, timestamp, integer, boolean, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'), // hashed password (optional for MVP)
  name: text('name'),
  role: text('role').notNull().default('employee'), // employee, manager, admin
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

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku'),
  quantity: integer('quantity').notNull().default(0),
  minQuantity: integer('min_quantity').notNull().default(0),
  unit: text('unit').notNull().default('pcs'),
  category: text('category'),
  location: text('location'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false).notNull(),
  type: text('type').notNull(), // 'low_stock', etc.
  relatedId: integer('related_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const procurementOrders = pgTable('procurement_orders', {
  id: serial('id').primaryKey(),
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
  assignedUserId: integer('assigned_user_id').references(() => users.id),
  status: text('status').notNull().default('Pending'), // Pending, Ordered, Restocked
  quantity: integer('quantity').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

