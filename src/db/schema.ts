import { pgTable, serial, text, timestamp, bigint } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  telegramFileId: text('telegram_file_id').notNull(),
  telegramMessageId: bigint('telegram_message_id', { mode: 'number' }),
  fileName: text('file_name').notNull(),
  fileSize: text('file_size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;