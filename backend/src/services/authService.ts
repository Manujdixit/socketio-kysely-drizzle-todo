import { db } from "../database/kysely";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { expressionBuilder, sql } from "kysely";

export async function registerUser({
  user_name,
  email,
  password,
}: {
  user_name: string;
  email: string;
  password: string;
}) {
  // Validation
  if (!user_name || !email || !password) {
    throw {
      status: 400,
      error: "Missing required fields",
      details: "user_name, email, and password are required",
    };
  }
  if (password.length < 6) {
    throw {
      status: 400,
      error: "Password too short",
      details: "Password must be at least 6 characters long",
    };
  }
  if (user_name.length < 2 || user_name.length > 100) {
    throw {
      status: 400,
      error: "Invalid username length",
      details: "Username must be between 2 and 100 characters",
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw { status: 400, error: "Invalid email format" };
  }
  // Check if user already exists
  const existingUser = await db
    .selectFrom("users")
    .select(["user_id"])
    .where("email", "=", email.toLowerCase())
    .executeTakeFirst();
  if (existingUser) {
    throw {
      status: 400,
      error: "User already exists",
      details: "A user with this email already exists",
    };
  }
  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const userId = uuidv4();
  const newUser = await db
    .insertInto("users")
    .values({
      user_id: userId,
      user_name: user_name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning(["user_id", "user_name", "email", "created_at"])
    .executeTakeFirstOrThrow();
  // Generate JWT token
  const token = generateToken({
    user_id: newUser.user_id,
    email: newUser.email,
    user_name: newUser.user_name,
  });
  return { user: newUser, token };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || !password) {
    throw {
      status: 400,
      error: "Missing credentials",
      details: "Email and password are required",
    };
  }
  const user = await db
    .selectFrom("users")
    .select(["user_id", "user_name", "email", "password_hash", "created_at"])
    .where("email", "=", email.toLowerCase().trim())
    .executeTakeFirst();
  if (!user) {
    throw {
      status: 401,
      error: "Invalid credentials",
      details: "Email or password is incorrect",
    };
  }
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw {
      status: 401,
      error: "Invalid credentials",
      details: "Email or password is incorrect",
    };
  }
  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    user_name: user.user_name,
  });
  await db
    .updateTable("users")
    .set({ updated_at: new Date() })
    .where("user_id", "=", user.user_id)
    .execute();
  const { password_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function getUserProfile(user_id: string) {
  const user = await db
    .selectFrom("users")
    .select(["user_id", "user_name", "email", "created_at", "updated_at"])
    .where("user_id", "=", user_id)
    .executeTakeFirst();
  if (!user) {
    throw {
      status: 404,
      error: "User not found",
      details: "User profile could not be found",
    };
  }
  return user;
}

export async function getAllTodosForMe(user_id: string, date?: Date) {
  // Room todos: tasks where user is a member of the room
  let roomTodosQuery = db
    .selectFrom("roomsUsers")
    .innerJoin("todos", "roomsUsers.room_id", "todos.room_id")
    .innerJoin("rooms", "rooms.room_id", "roomsUsers.room_id")
    .select([
      "todos.todo_id",
      "todos.title",
      "todos.room_id",
      "todos.user_id",
      "todos.todo_description",
      "todos.status",
      "todos.last_time",
      "todos.created_at",
      "todos.updated_at",
      "rooms.room_name",
    ])
    .where("roomsUsers.user_id", "=", user_id);

  let privateTodosQuery = db
    .selectFrom("todos")
    .selectAll()
    .where("user_id", "=", user_id)
    .where("room_id", "is", null);

  const roomTodos = await roomTodosQuery.execute();
  const privateTodos = await privateTodosQuery.execute();

  return [...roomTodos, ...privateTodos];
}
