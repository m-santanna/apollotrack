ALTER TABLE "food_item" DROP CONSTRAINT "food_item_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "food_item" ALTER COLUMN "calories" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "food_item" ALTER COLUMN "calories" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food_item" ALTER COLUMN "protein" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food_item" ALTER COLUMN "carbs" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food_item" ALTER COLUMN "fat" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food_item" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "food_item" DROP COLUMN "total_grams";--> statement-breakpoint
ALTER TABLE "food_item" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "food_item" DROP COLUMN "checked";