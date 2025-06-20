/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'pd_likes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "pd_likes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'repd_likes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "repd_likes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "pd_likes" ADD CONSTRAINT "pd_likes_target_pd_id_user_id_pk" PRIMARY KEY("target_pd_id","user_id");--> statement-breakpoint
ALTER TABLE "repd_likes" ADD CONSTRAINT "repd_likes_target_repd_id_user_id_pk" PRIMARY KEY("target_repd_id","user_id");