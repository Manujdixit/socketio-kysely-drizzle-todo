import { Request, Response } from "express";
import * as roomService from "../services/roomService";

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     summary: Join a room by room ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined room
 *       400:
 *         description: Room ID required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to join room
 */
export const joinRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ error: "Room ID required" });
    // Add user to room membership
    const alreadyMember = await roomService.isUserInRoom(userId, roomId);
    if (alreadyMember)
      return res
        .status(200)
        .json({ success: true, message: "Already a member" });
    await roomService.addUserToRoom(userId, roomId);
    res.status(201).json({ success: true, message: "Joined room" });
  } catch (err) {
    res.status(500).json({ error: "Failed to join room" });
  }
};
/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms for the authenticated user
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch rooms
 */

// GET /api/rooms
export const getRooms = async (req: Request, res: Response) => {
  try {
    // Assume req.user.user_id is available from auth middleware
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const rooms = await roomService.getRoomsForUser(userId);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// POST /api/rooms
export const createRoom = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /api/rooms:
   *   post:
   *     summary: Create a new room
   *     tags: [Rooms]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               room_name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Room created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Room'
   *       400:
   *         description: Room name required
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Failed to create room
   */
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { room_name } = req.body;
    if (!room_name)
      return res.status(400).json({ error: "Room name required" });
    const room = await roomService.createRoom(room_name, userId);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};

// Membership validation helper (for future use)
export const validateMembership = async (userId: string, roomId: string) => {
  return roomService.isUserInRoom(userId, roomId);
};
