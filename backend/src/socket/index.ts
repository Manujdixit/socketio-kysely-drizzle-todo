import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { corsOptions } from "../config";
import { registerSocketEvents } from "./events";

export const setupSocketIO = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
  });

  // Register all collaborative socket events
  registerSocketEvents(io);

  return io;
};
