ALTER TABLE "games" DROP CONSTRAINT "games_category_id_game_categories_id_fkey";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "title_mm";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "description_mm";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "category_id";