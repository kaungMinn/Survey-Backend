import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const surveysTable = mysqlTable('surveys', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  phone_number: varchar({ length: 50 }).notNull(),
  company_name: varchar({ length: 255 }).notNull(),
  designation: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 6 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
});


