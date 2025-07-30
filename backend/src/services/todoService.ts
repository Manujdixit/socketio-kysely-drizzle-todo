import { db } from "../database/kysely";
import { sql } from "kysely";
import { verifyToken } from "../utils/auth";

export async function getTodosByRoom(roomId: string) {
  return db
    .selectFrom("todos")
    .selectAll()
    .where("room_id", "=", roomId)
    .execute();
}

export async function createTodo({
  title,
  todo_description,
  room_id,
  user_id,
  last_time,
}: {
  title: string;
  todo_description?: string;
  room_id?: string;
  user_id: string;
  last_time?: Date;
}) {
  user_id = verifyToken(user_id).user_id;
  return db
    .insertInto("todos")
    .values({
      title,
      todo_description,
      room_id,
      user_id,
      status: "pending",
      last_time,
    })
    .returningAll()
    .executeTakeFirst();
}

export async function updateTodo(
  todoId: number,
  {
    title,
    todo_description,
    status,
    last_time,
  }: {
    title?: string;
    todo_description?: string;
    status?: string;
    last_time: Date;
  }
) {
  return db
    .updateTable("todos")
    .set({
      title,
      todo_description,
      status,
      last_time,
      updated_at: sql`now()`,
    })
    .where("todo_id", "=", todoId)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteTodo(todoId: number) {
  return db.deleteFrom("todos").where("todo_id", "=", todoId).execute();
}
