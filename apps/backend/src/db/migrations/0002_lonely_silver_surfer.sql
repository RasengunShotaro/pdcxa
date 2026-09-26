CREATE TABLE "pd_bookmarks" (
	"target_pd_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pd_bookmarks_target_pd_id_user_id_pk" PRIMARY KEY("target_pd_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "pds" ADD COLUMN "quoted_pd_id" uuid;--> statement-breakpoint
ALTER TABLE "pd_bookmarks" ADD CONSTRAINT "pd_bookmarks_target_pd_id_pds_id_fk" FOREIGN KEY ("target_pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pd_bookmarks_user_id_saved_idx" ON "pd_bookmarks" USING btree ("user_id","created_at" DESC NULLS FIRST,"target_pd_id" DESC NULLS FIRST);--> statement-breakpoint
ALTER TABLE "pds" ADD CONSTRAINT "pds_quoted_pd_id_pds_id_fk" FOREIGN KEY ("quoted_pd_id") REFERENCES "public"."pds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pds_quoted_pd_id_idx" ON "pds" USING btree ("quoted_pd_id");