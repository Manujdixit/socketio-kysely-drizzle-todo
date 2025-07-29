// TypeScript interfaces for Live Collaborative To-Do List

export interface User {
  user_id: string;
  user_name: string;
  user_socket: string;
  created_at: Date;
  updated_at: Date;
}

export interface Room {
  room_id: string;
  room_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Todo {
  todo_id: number;
  todo_title: string;
  todo_description?: string;
  room_id: string;
  status: "pending" | "in_progress" | "completed";
  created_at: Date;
  updated_at: Date;
}

export interface TaskUpdate {
  todo_id: number;
  field: "title" | "description" | "status";
  value: string;
  user_id: string;
}

export interface UserPresence {
  user_id: string;
  user_name: string;
  is_online: boolean;
  current_task?: number;
  last_seen: Date;
}
