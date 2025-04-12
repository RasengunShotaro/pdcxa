CREATE TABLE "pd_likes" (
	"target_pd_id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repd_likes" (
	"target_repd_id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pd_id" uuid NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pd_likes" ADD CONSTRAINT "pd_likes_target_pd_id_pds_id_fk" FOREIGN KEY ("target_pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repd_likes" ADD CONSTRAINT "repd_likes_target_repd_id_repds_id_fk" FOREIGN KEY ("target_repd_id") REFERENCES "public"."repds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repds" ADD CONSTRAINT "repds_pd_id_pds_id_fk" FOREIGN KEY ("pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;