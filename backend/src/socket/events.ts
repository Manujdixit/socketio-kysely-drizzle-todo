import { Server, Socket } from "socket.io";
import {
  getTodosByRoom,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { isUserInRoom } from "../services/roomService";

export function registerSocketEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    // Join room
    socket.on("join_room", async ({ roomId, userId }) => {
      if (!(await isUserInRoom(userId, roomId))) {
        socket.emit("error", { error: "User not in room" });
        return;
      }
      socket.join(roomId);
      socket.to(roomId).emit("user_joined", { userId });
    });

    // Leave room
    socket.on("leave_room", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", { userId });
    });

    // Create task
    socket.on("create_task", async (data, cb) => {
      try {
        const todo = await createTodo(data);
        io.to(data.room_id).emit("task_created", todo);
        cb?.(todo);
      } catch (err) {
        cb?.({ error: "Failed to create task" });
      }
    });

    // Update task
    socket.on("update_task", async (data, cb) => {
      try {
        const todo = await updateTodo(data.todo_id, data);
        io.to(data.room_id).emit("task_updated", todo);
        cb?.(todo);
      } catch (err) {
        cb?.({ error: "Failed to update task" });
      }
    });

    // Delete task
    socket.on("delete_task", async ({ todo_id, room_id }, cb) => {
      try {
        await deleteTodo(todo_id);
        io.to(room_id).emit("task_deleted", { todo_id });
        cb?.({ success: true });
      } catch (err) {
        cb?.({ error: "Failed to delete task" });
      }
    });

    // User presence
    socket.on("user_editing", ({ roomId, userId, todoId }) => {
      socket.to(roomId).emit("user_editing", { userId, todoId });
    });

    // Conflict resolution (basic broadcast)
    socket.on("conflict", ({ roomId, todoId, userId }) => {
      socket.to(roomId).emit("conflict", { todoId, userId });
    });
  });
}
