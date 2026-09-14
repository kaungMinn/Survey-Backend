import { relations } from 'drizzle-orm/_relations';
import { pgTable, serial, text, timestamp, bigint, uniqueIndex, integer } from 'drizzle-orm/pg-core';

export const gameCategories = pgTable("game_categories", {
  id: serial('id').primaryKey(),
  title: text("title").notNull(),
  description: text('description'),
  titleMM: text("title_mm"),
  descriptionMM: text("description_mm"),
});

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  // title: text('title').notNull(),
  // titleMM: text('title_mm'),
  // description: text('description'),
  // descriptionMM: text("description_mm"),
  // categoryId: integer('category_id').references(() => gameCategories.id, { onDelete: 'set null' }),
  telegramFileId: text('telegram_file_id').notNull(),
  telegramMessageId: bigint('telegram_message_id', { mode: 'number' }),
  fileName: text('file_name').notNull(),
  fileSize: text('file_size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex("file_lookup_idx").on(table.fileName, table.fileSize)
]);

export const gameImages = pgTable("game_images", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull()
});

// RELATIONS

export const gameCategoriesRelations = relations(gameCategories, ({ many }) => ({
  games: many(games),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  // category: one(gameCategories, {
  //   fields: [games.categoryId],
  //   references: [gameCategories.id],
  // }),
  images: many(gameImages),
}));

export const gameImagesRelations = relations(gameImages, ({ one }) => ({
  game: one(games, {
    fields: [gameImages.gameId],
    references: [games.id],
  }),
}));

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameCategories = typeof gameCategories.$inferInsert;
export type GameImages = typeof gameImages.$inferInsert;