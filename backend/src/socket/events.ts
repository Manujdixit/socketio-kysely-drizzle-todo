import { Server, Socket } from "socket.io";
// Map userId to Set of socket ids
const userSockets = new Map();
import {
  getTodosByRoom,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { isUserInRoom } from "../services/roomService";

export function registerSocketEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("[Socket] Client connected:", socket.id);
    // Track userId for this socket (assume frontend emits 'identify' after connect)
    socket.on("identify", (userId) => {
      console.log(
        `[Socket] Received identify for userId=${userId}, socketId=${socket.id}`
      );
      socket.data.userId = userId;
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);
    });

    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        if (userSockets.get(userId).size === 0) userSockets.delete(userId);
      }
    });

    // Join room
    socket.on("join_room", async ({ roomId, userId }, cb) => {
      console.log(
        `[Socket] join_room called with userId=${userId}, roomId=${roomId}`
      );
      const inRoom = await isUserInRoom(userId, roomId);
      console.log(`[Socket] isUserInRoom result:`, inRoom);
      if (!inRoom) {
        socket.emit("error", { error: "User not in room" });
        cb?.({ success: false, message: "User not in room" });
        return;
      }
      socket.join(roomId);
      socket.to(roomId).emit("user_joined", { userId });
      cb?.({ success: true });
    });

    // Leave room
    socket.on("leave_room", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", { userId });
    });

    // Create task
    socket.on("create_task", async (data, cb) => {
      console.log("[Socket] Received create_task event with data:", data);
      try {
        const todo = await createTodo(data);
        console.log("[Socket] Created todo:", todo);
        if (data.room_id) {
          io.to(data.room_id).emit("task_created", todo);
        } else {
          // Private: emit only to all sockets of this user
          const userId = socket.data.userId;
          console.log(
            `[Socket] Preparing to emit private task_created for userId=${userId}, sockets=${
              userSockets.get(userId)
                ? Array.from(userSockets.get(userId)).join(",")
                : "none"
            }`
          );
          if (userId && userSockets.has(userId)) {
            for (const sid of userSockets.get(userId)) {
              console.log(
                `[Socket] Emitting task_created to userId=${userId}, socketId=${sid}`,
                todo
              );
              io.to(sid).emit("task_created", todo);
            }
          } else {
            socket.emit("task_created", todo);
          }
        }
        cb?.(todo);
      } catch (err) {
        console.error("[Socket] Failed to create task:", err);
        cb?.({ error: "Failed to create task" });
      }
    });

    // Update task
    socket.on("update_task", async (data, cb) => {
      try {
        const todo = await updateTodo(data.todo_id, data);
        if (data.room_id) {
          io.to(data.room_id).emit("task_updated", todo);
        } else {
          // Private: emit only to all sockets of this user
          const userId = socket.data.userId;
          if (userId && userSockets.has(userId)) {
            for (const sid of userSockets.get(userId)) {
              io.to(sid).emit("task_updated", todo);
            }
          } else {
            socket.emit("task_updated", todo);
          }
        }
        cb?.(todo);
      } catch (err) {
        cb?.({ error: "Failed to update task" });
      }
    });

    // Delete task
    socket.on("delete_task", async ({ todo_id, room_id }, cb) => {
      try {
        await deleteTodo(todo_id);
        if (room_id) {
          io.to(room_id).emit("task_deleted", todo_id);
        } else {
          // Private: emit only to all sockets of this user
          const userId = socket.data.userId;
          if (userId && userSockets.has(userId)) {
            for (const sid of userSockets.get(userId)) {
              io.to(sid).emit("task_deleted", todo_id);
            }
          } else {
            socket.emit("task_deleted", todo_id);
          }
        }
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
