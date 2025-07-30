import { Router } from "express";
import { getRooms, createRoom } from "../controllers/roomController";
import { authenticateToken } from "../middleware";
import { joinRoom } from "../controllers/roomController";

const router = Router();

// GET /api/rooms
router.get("/rooms", authenticateToken, getRooms);
// POST /api/rooms
router.post("/rooms", authenticateToken, createRoom);

// POST /api/rooms/join
router.post("/rooms/join", authenticateToken, joinRoom);

export default router;
