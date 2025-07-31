import AppLayout from "@/components/AppLayout";
import GroupSheetSidebar from "@/components/GroupSheetSidebar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import React, { useEffect } from "react";
import { useSocketContext } from "../context/SocketProvider";
import axios from "axios";
// ...existing code...

export const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showGroupSheet, setShowGroupSheet] = React.useState(false);
  const socket = useSocketContext();

  // Fetch all todos for dashboard
  useEffect(() => {
    async function fetchTodos() {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/todos/all`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    }
    fetchTodos();
  }, []);

  // Fetch all rooms for user and join them via socket
  useEffect(() => {
    async function joinAllRooms() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("manuj_user_id");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      const rooms = res.data;
      rooms.forEach((room: any) => {
        socket.emit("join_room", { roomId: room.room_id, userId });
      });
    }
    if (socket) joinAllRooms();
  }, [socket]);

  // Add keyboard shortcut for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setShowTaskForm(true);
      }
      if (event.key === "Escape") {
        setShowTaskForm(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppLayout
      showSidebar={true}
      sidebarProps={{
        open: sidebarOpen,
        setOpen: setSidebarOpen,
        onCreateGroup: () => setShowGroupSheet(true),
      }}
      showGroupSheet={showGroupSheet}
      groupSheetSidebar={
        showGroupSheet ? (
          <GroupSheetSidebar onClose={() => setShowGroupSheet(false)} />
        ) : null
      }
      onTaskButtonClick={() => setShowTaskForm(true)}
      sheetsOpen={showTaskForm || showGroupSheet}
    >
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-12">
        <div className="max-w-2xl mx-auto py-6">
          <TaskList />
        </div>
      </div>
      {/* Task Form Sheet */}
      {showTaskForm && (
        <TaskForm isSheet onClose={() => setShowTaskForm(false)} />
      )}
    </AppLayout>
  );
};
