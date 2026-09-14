CREATE TABLE "game_categories" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text,
	"title_mm" text,
	"description_mm" text
);
--> statement-breakpoint
CREATE TABLE "game_images" (
	"id" serial PRIMARY KEY,
	"game_id" integer NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"title_mm" text,
	"description" text,
	"description_mm" text,
	"category_id" integer,
	"telegram_file_id" text NOT NULL,
	"telegram_message_id" bigint,
	"file_name" text NOT NULL,
	"file_size" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "file_lookup_idx" ON "games" ("file_name","file_size");--> statement-breakpoint
ALTER TABLE "game_images" ADD CONSTRAINT "game_images_game_id_games_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_category_id_game_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "game_categories"("id") ON DELETE SET NULL;