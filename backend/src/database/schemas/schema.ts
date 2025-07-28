import {
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
