import { db } from "../database/kysely";
import { sql } from "kysely";

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
  assigned_user_id,
}: {
  title: string;
  todo_description?: string;
  room_id: string;
  assigned_user_id?: string;
}) {
  return db
    .insertInto("todos")
    .values({
      title,
      todo_description,
      room_id,
      assigned_user_id,
      status: "pending",
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
    assigned_user_id,
    editing_user_id,
  }: {
    title?: string;
    todo_description?: string;
    status?: string;
    assigned_user_id?: string;
    editing_user_id?: string;
  }
) {
  return db
    .updateTable("todos")
    .set({
      title,
      todo_description,
      status,
      assigned_user_id,
      editing_user_id,
      updated_at: sql`now()`,
    })
    .where("todo_id", "=", todoId)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteTodo(todoId: number) {
  return db.deleteFrom("todos").where("todo_id", "=", todoId).execute();
}
