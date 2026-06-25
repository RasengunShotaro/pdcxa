CREATE TABLE "notification_seen" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"last_notifications_seen_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pd_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "repd_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;