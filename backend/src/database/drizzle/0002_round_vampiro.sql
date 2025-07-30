ALTER TABLE "todos" ALTER COLUMN "room_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "assigned_user_id";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "editing_user_id";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "last_edited_at";