import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { connectSocket } from "../socket/socket";
import { toast } from "sonner";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";

interface Task {
  todo_id: string;
  title: string;
  todo_description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const GroupPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Keyboard shortcut for Ctrl+K to open task form
  React.useEffect(() => {
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

  React.useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}/todos`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setTasks(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
    // Listen for real-time updates
    const socket = connectSocket();

    socket.emit("join_room", {
      roomId,
      userId: localStorage.getItem("manuj_user_id"),
    });
    socket.on("task_created", (task: Task) => {
      console.log("[Socket] Received task_created:", task);
      setTasks((prev) => {
        const updated = [task, ...prev];
        return updated.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });
      });
      toast.success("New task added!");
    });
    socket.on("task_updated", (task: Task) => {
      console.log("[Socket] Received task_updated:", task);
      setTasks((prev) =>
        prev.map((t) => (t.todo_id === task.todo_id ? task : t))
      );
      toast.info("Task updated!");
    });
    socket.on("task_deleted", (todo_id: string) => {
      console.log("[Socket] Received task_deleted:", todo_id);
      setTasks((prev) => prev.filter((t) => t.todo_id !== todo_id));
      toast.info("Task deleted!");
    });
    return () => {
      socket.emit("leave_room", {
        roomId,
        userId: localStorage.getItem("manuj_user_id"),
      });
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, [roomId]);

  const handleToggleStatus = (todo_id: number) => {
    const task = tasks.find((t) => parseInt(t.todo_id as string) === todo_id);
    if (!task) return;
    const newStatus = task.status === "complete" ? "incomplete" : "complete";
    // Optimistically update UI
    setTasks((tasks) =>
      tasks.map((t) =>
        parseInt(t.todo_id as string) === todo_id
          ? { ...t, status: newStatus }
          : t
      )
    );
    // Emit socket event
    const socket = connectSocket();
    socket.emit("update_task", { ...task, status: newStatus, room_id: roomId });
  };

  const handleEditTask = (
    todo_id: number,
    updated: { title: string; todo_description?: string }
  ) => {
    const task = tasks.find((t) => parseInt(t.todo_id as string) === todo_id);
    if (!task) return;
    // Optimistically update UI
    setTasks((tasks) =>
      tasks.map((t) =>
        parseInt(t.todo_id as string) === todo_id
          ? {
              ...t,
              title: updated.title,
              todo_description: updated.todo_description,
            }
          : t
      )
    );
    // Emit socket event
    const socket = connectSocket();
    socket.emit("update_task", { ...task, ...updated, room_id: roomId });
  };

  const handleDeleteTask = (todo_id: number) => {
    // Optimistically remove from UI
    setTasks((tasks) =>
      tasks.filter((t) => parseInt(t.todo_id as string) !== todo_id)
    );
    // Emit socket event
    const socket = connectSocket();
    socket.emit("delete_task", { todo_id, room_id: roomId });
  };

  return (
    <AppLayout
      showSidebar={true}
      sidebarProps={{}}
      onTaskButtonClick={() => setShowTaskForm(true)}
      sheetsOpen={showTaskForm}
    >
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">
          Group Tasks
        </h2>
        {loading ? (
          <div className="text-center text-[var(--muted-foreground)]">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-[var(--muted-foreground)]">
            No tasks in this group yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {tasks.map((task) => (
              <li key={task.todo_id}>
                <TaskItem
                  task={{
                    ...task,
                    status: task.status || "incomplete",
                    todo_id:
                      typeof task.todo_id === "string"
                        ? parseInt(task.todo_id)
                        : task.todo_id,
                  }}
                  onToggleStatus={() =>
                    handleToggleStatus(
                      typeof task.todo_id === "string"
                        ? parseInt(task.todo_id)
                        : task.todo_id
                    )
                  }
                  onUpdate={(updated: {
                    title: string;
                    todo_description?: string;
                  }) =>
                    handleEditTask(
                      typeof task.todo_id === "string"
                        ? parseInt(task.todo_id)
                        : task.todo_id,
                      updated
                    )
                  }
                  onDelete={() =>
                    handleDeleteTask(
                      typeof task.todo_id === "string"
                        ? parseInt(task.todo_id)
                        : task.todo_id
                    )
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Task Form Sheet */}
      {showTaskForm && (
        <TaskForm
          isSheet
          onClose={() => setShowTaskForm(false)}
          roomId={roomId}
        />
      )}
    </AppLayout>
  );
};

export default GroupPage;
