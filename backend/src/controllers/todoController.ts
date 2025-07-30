import { Request, Response } from "express";
import * as todoService from "../services/todoService";

/**
 * @swagger
 * /api/rooms/{id}/todos:
 *   get:
 *     summary: Get all todos for a room
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Failed to fetch todos
 */

// GET /api/rooms/:id/todos
export const getTodos = async (req: Request, res: Response) => {
  const roomId = req.params.id;
  try {
    const result = await todoService.getTodosByRoom(roomId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// POST /api/rooms/:id/todos
export const createTodo = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /api/rooms/{id}/todos:
   *   post:
   *     summary: Create a new todo in a room
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: false
   *         schema:
   *           type: string
   *         description: Room ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               todo_description:
   *                 type: string
   *               assigned_user_id:
   *                 type: string
   *     responses:
   *       201:
   *         description: Todo created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   *       500:
   *         description: Failed to create todo
   */
  const roomId = req.params.id;
  const { title, todo_description, last_time } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const inserted = await todoService.createTodo({
      title,
      todo_description,
      room_id: roomId,
      last_time,
      user_id: req.user.user_id,
    });
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /api/todos/{id}:
   *   put:
   *     summary: Update a todo
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Todo ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               todo_description:
   *                 type: string
   *               status:
   *                 type: string
   *               assigned_user_id:
   *                 type: string
   *               editing_user_id:
   *                 type: string
   *     responses:
   *       200:
   *         description: Todo updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   *       500:
   *         description: Failed to update todo
   */
  const todoId = Number(req.params.id);
  const { title, todo_description, status, last_time } = req.body;
  try {
    const updated = await todoService.updateTodo(todoId, {
      title,
      todo_description,
      status,
      last_time,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /api/todos/{id}:
   *   delete:
   *     summary: Delete a todo
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Todo ID
   *     responses:
   *       204:
   *         description: Todo deleted
   *       500:
   *         description: Failed to delete todo
   */
  const todoId = Number(req.params.id);
  try {
    await todoService.deleteTodo(todoId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
