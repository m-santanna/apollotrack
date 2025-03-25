CREATE TABLE "food_product" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"calories" real,
	"protein" real,
	"carbs" real,
	"fat" real,
	"category" text DEFAULT 'Other' NOT NULL
);
--> statement-breakpoint
DROP TABLE "food_item" CASCADE;