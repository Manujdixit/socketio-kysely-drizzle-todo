CREATE TABLE "rooms" (
	"room_id" uuid PRIMARY KEY NOT NULL,
	"room_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roomsUsers" (
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roomsUsers_user_id_room_id_pk" PRIMARY KEY("user_id","room_id")
);
--> statement-breakpoint
CREATE TABLE "task_locks" (
	"todo_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"locked_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "task_locks_todo_id_pk" PRIMARY KEY("todo_id")
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"todo_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"room_id" uuid NOT NULL,
	"todo_description" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"assigned_user_id" uuid,
	"editing_user_id" uuid,
	"last_edited_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"room_id" uuid NOT NULL,
	"socket_id" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"user_socket" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
