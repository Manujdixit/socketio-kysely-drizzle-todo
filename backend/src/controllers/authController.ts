import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as authService from "../services/authService";

interface RegisterRequest {
  user_name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *         user_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         created_at:
 *           type: string
 *           format: date-time
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - user_name
 *         - email
 *         - password
 *       properties:
 *         user_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { user_name, email, password }: RegisterRequest = req.body;
    const result = await authService.registerUser({
      user_name,
      email,
      password,
    });
    res.status(201).json({
      user: result.user,
      token: result.token,
      message: "User registered successfully",
    });
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration",
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;
    const result = await authService.loginUser({ email, password });
    res.status(200).json({
      user: result.user,
      token: result.token,
      message: "Login successful",
    });
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login",
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await authService.getUserProfile(req.user.user_id);
    res.status(200).json({ user });
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      console.error("Get profile error:", error);
      res.status(500).json({
        error: "Failed to get profile",
        message: "An error occurred while retrieving user profile",
      });
    }
  }
};
