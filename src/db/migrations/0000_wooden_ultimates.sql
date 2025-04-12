CREATE TABLE "pd_likes" (
	"target_pd_id" integer PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repd_likes" (
	"target_repd_id" integer PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "repds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pd_id" integer NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pd_likes" ADD CONSTRAINT "pd_likes_target_pd_id_pds_id_fk" FOREIGN KEY ("target_pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repd_likes" ADD CONSTRAINT "repd_likes_target_repd_id_repds_id_fk" FOREIGN KEY ("target_repd_id") REFERENCES "public"."repds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repds" ADD CONSTRAINT "repds_pd_id_pds_id_fk" FOREIGN KEY ("pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;