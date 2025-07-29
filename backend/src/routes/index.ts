import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";
import authRoutes from "./auth";
import todosRoutes from "./todos";
import roomsRoutes from "./rooms";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Live Collaborative Todo API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Live Collaborative Todo API is running",
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Live Collaborative Todo API Documentation",
  })
);

// API routes

router.use("/api/auth", authRoutes);
router.use("/api", todosRoutes);
router.use("/api", roomsRoutes);

// Catch-all for unimplemented API routes
router.use("/api", (_req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message: "This API endpoint has not been implemented yet",
  });
});

export default router;
