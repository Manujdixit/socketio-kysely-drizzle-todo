import { db } from "../database/kysely";
import { v4 as uuidv4 } from "uuid";

export async function getRoomsForUser(userId: string) {
  // Returns all rooms the user is a member of
  return db
    .selectFrom("roomsUsers")
    .innerJoin("rooms", "rooms.room_id", "roomsUsers.room_id")
    .select([
      "rooms.room_id",
      "rooms.room_name",
      "rooms.created_at",
      "rooms.updated_at",
    ])
    .where("roomsUsers.user_id", "=", userId)
    .execute();
}

export async function createRoom(room_name: string, userId: string) {
  const room_id = uuidv4();
  // Create room
  const room = await db
    .insertInto("rooms")
    .values({
      room_id,
      room_name,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning(["room_id", "room_name", "created_at", "updated_at"])
    .executeTakeFirstOrThrow();
  // Add creator as member
  await db
    .insertInto("roomsUsers")
    .values({
      room_id,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .execute();
  return room;
}

export async function addUserToRoom(userId: string, roomId: string) {
  // Add user to room membership
  await db
    .insertInto("roomsUsers")
    .values({
      room_id: roomId,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .execute();
}
export async function isUserInRoom(userId: string, roomId: string) {
  const membership = await db
    .selectFrom("roomsUsers")
    .select(["user_id"])
    .where("user_id", "=", userId)
    .where("room_id", "=", roomId)
    .executeTakeFirst();
  return !!membership;
}
