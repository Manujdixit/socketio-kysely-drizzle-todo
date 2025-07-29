import { Router } from "express";
import { getRooms, createRoom } from "../controllers/roomController";

const router = Router();

// GET /api/rooms
router.get("/rooms", getRooms);
// POST /api/rooms
router.post("/rooms", createRoom);

export default router;
