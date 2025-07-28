import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  room_id: uuid("room_id").primaryKey(),
  room_name: varchar("room_name", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  user_id: uuid("user_id").primaryKey(),
  user_name: varchar("user_name", { length: 100 }).notNull(),
  user_socket: varchar("user_socket", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const todos = pgTable("todos", {
  todo_id: serial("todo_id").primaryKey(),
  todo_title: varchar("title", { length: 100 }).notNull(),
  room_id: uuid("room_id").notNull(),
  todo_description: varchar("todo_description", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  assigned_user_id: uuid("assigned_user_id"),
  editing_user_id: uuid("editing_user_id"),
  last_edited_at: timestamp("last_edited_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const roomsUsers = pgTable(
  "roomsUsers",
  {
    room_id: uuid("room_id").notNull(),
    user_id: uuid("user_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.user_id, table.room_id],
    }),
  ]
);

// User sessions for presence tracking
export const userSessions = pgTable("user_sessions", {
  session_id: uuid("session_id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  room_id: uuid("room_id").notNull(),
  socket_id: varchar("socket_id", { length: 100 }).notNull(),
  is_active: boolean("is_active").notNull().default(true),
  last_activity: timestamp("last_activity").notNull().defaultNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Task edit locks for conflict resolution
export const taskLocks = pgTable("task_locks", {
  todo_id: integer("todo_id").notNull(),
  user_id: uuid("user_id").notNull(),
  locked_at: timestamp("locked_at").notNull().defaultNow(),
  expires_at: timestamp("expires_at").notNull(),
}, (table) => [
  primaryKey({
    columns: [table.todo_id],
  }),
]);
