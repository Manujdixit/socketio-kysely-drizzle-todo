import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authenticateToken } from "../middleware";

const router = Router();

// GET /api/rooms/:id/todos
router.get("/rooms/:id/todos", getTodos);
// POST /api/rooms/:id/todos
router.post("/rooms/:id/todos", authenticateToken, createTodo);
// PUT /api/todos/:id
router.put("/todos/:id", updateTodo);
// DELETE /api/todos/:id
router.delete("/todos/:id", deleteTodo);

export default router;
