CREATE TABLE "food_item" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"calories" integer,
	"protein" real,
	"carbs" real,
	"fat" real,
	"total_grams" real,
	"price" real,
	"checked" boolean DEFAULT false NOT NULL,
	"category" text DEFAULT 'Other' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_macros" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"daily_calories" integer NOT NULL,
	"daily_protein" integer NOT NULL,
	"daily_carbs" integer NOT NULL,
	"daily_fat" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "food_item" ADD CONSTRAINT "food_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_macros" ADD CONSTRAINT "user_macros_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;