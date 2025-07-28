import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { corsOptions } from '../config';

export const setupSocketIO = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling']
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Placeholder for Socket.IO events - will be implemented in later tasks
    socket.on('join_room', (roomId: string) => {
      console.log(`Socket ${socket.id} joining room: ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { socketId: socket.id });
    });

    socket.on('leave_room', (roomId: string) => {
      console.log(`Socket ${socket.id} leaving room: ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', { socketId: socket.id });
    });
  });

  return io;
};