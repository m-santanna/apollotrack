CREATE TABLE "user_food" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"food_id" text NOT NULL,
	"checked" boolean DEFAULT false NOT NULL,
	"price" real DEFAULT -1,
	"total_grams" real DEFAULT -1
);
--> statement-breakpoint
ALTER TABLE "user_food" ADD CONSTRAINT "user_food_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_food" ADD CONSTRAINT "user_food_food_id_food_product_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food_product"("id") ON DELETE cascade ON UPDATE no action;