import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { useSocketContext } from "../context/SocketProvider";
import { useUserTodos } from "../hooks/useUserTodos";
import { useOptimistic } from "../hooks/useOptimistic";
import { toast } from "sonner";
import { useUserGroups } from "../hooks/useUserGroups";

const TaskList: React.FC = () => {
  const { tasks, setTasks, loading, error } = useUserTodos();
  const { groups } = useUserGroups();
  const [editingId, setEditingId] = useState<number | null>(null);
  const socket = useSocketContext();
  // Optimistic state for tasks
  const [optimisticTasks, optimisticUpdate, rollback] =
    useOptimistic<any[]>(tasks);
  // Sync optimistic state with actual tasks when tasks change
  useEffect(() => {
    optimisticUpdate(tasks);
    // eslint-disable-next-line
  }, [tasks]);

  useEffect(() => {
    if (!socket) return;
    // Listen for real-time events
    socket.on("task_created", (task: any) => {
      console.log("[Socket] Received task_created:", task);
      // Enrich with room_name if possible
      const room = groups.find((g) => g.room_id === task.room_id);
      const enrichedTask = room ? { ...task, room_name: room.room_name } : task;
      setTasks((prev: any[]) => [...prev, enrichedTask]);
      toast.message("Task list updated");
    });
    socket.on("task_updated", (updated: any) => {
      // Enrich with room_name if possible
      const room = groups.find((g) => g.room_id === updated.room_id);
      const enrichedTask = room
        ? { ...updated, room_name: room.room_name }
        : updated;
      setTasks((prev: any[]) =>
        prev.map((t) => (t.todo_id === enrichedTask.todo_id ? enrichedTask : t))
      );
      toast.message("Task list updated");
    });
    socket.on("task_deleted", (todo_id: number) => {
      setTasks((prev: any[]) => prev.filter((t) => t.todo_id !== todo_id));
    });
    // Rollback on error from server
    socket.on("error", (err: any) => {
      if (err && err.error) {
        rollback();
      }
    });
    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
      socket.off("error");
    };
  }, [socket, setTasks, rollback]);

  const handleToggleStatus = (todo_id: number) => {
    const task = optimisticTasks.find((t) => t.todo_id === todo_id);
    if (!task) return;
    const newStatus = task.status === "complete" ? "incomplete" : "complete";
    // Optimistically update UI
    optimisticUpdate(
      optimisticTasks.map((t) =>
        t.todo_id === todo_id ? { ...t, status: newStatus } : t
      )
    );
    socket.emit("update_task", { ...task, status: newStatus }, (res: any) => {
      if (res && res.error) rollback();
    });
  };

  const handleEdit = (todo_id: number, newTitle: string) => {
    const task = optimisticTasks.find((t) => t.todo_id === todo_id);
    if (!task) return;
    // Optimistically update UI
    optimisticUpdate(
      optimisticTasks.map((t) =>
        t.todo_id === todo_id ? { ...t, title: newTitle } : t
      )
    );
    socket.emit("update_task", { ...task, title: newTitle }, (res: any) => {
      if (res && res.error) rollback();
    });
    setEditingId(null);
  };

  const handleStartEdit = (todo_id: number) => setEditingId(todo_id);
  const handleCancelEdit = () => setEditingId(null);

  const handleDelete = (todo_id: number) => {
    // Optimistically remove from UI
    optimisticUpdate(optimisticTasks.filter((t) => t.todo_id !== todo_id));
    socket.emit("delete_task", { todo_id }, (res: any) => {
      if (res && res.error) rollback();
    });
  };

  // For adding new tasks, a handler can be added here and passed down as needed

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 text-center">
        Loading tasks...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 text-center text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex justify-end mb-2"></div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {optimisticTasks.map((task) => (
          <TaskItem
            key={task.todo_id}
            task={task}
            onToggleStatus={() => handleToggleStatus(task.todo_id)}
            onEdit={(newTitle) => handleEdit(task.todo_id, newTitle)}
            onStartEdit={() => handleStartEdit(task.todo_id)}
            onCancelEdit={handleCancelEdit}
            onDelete={() => handleDelete(task.todo_id)}
            isEditing={editingId === task.todo_id}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
