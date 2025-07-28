// Common types for the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

// Socket.IO event types
export interface SocketEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  user_joined: (data: { socketId: string }) => void;
  user_left: (data: { socketId: string }) => void;
}