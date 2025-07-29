import React, { useState } from "react";
import TaskItem from "./TaskItem";

const initialTasks = [
  {
    id: 1,
    title: "Read a book",
    status: "incomplete",
    tag: null,
    avatars: [],
    time: "08:00 - 09:00",
  },
  {
    id: 2,
    title: "Wireframing new product",
    status: "incomplete",
    tag: null,
    avatars: [],
    time: "09:00 - 11:00",
  },
  {
    id: 3,
    title: "Moodboard Landing Page",
    status: "incomplete",
    tag: "Mobal Project",
    avatars: [],
    time: "11:00 - 13:00",
  },
  {
    id: 4,
    title: "Weekly meeting",
    status: "incomplete",
    tag: "Futur Project",
    avatars: ["🟢", "🟣", "🔵"],
    time: "13:00 - 14:00",
  },
  {
    id: 5,
    title: "Design PPT for Sharing Session #2",
    status: "incomplete",
    tag: null,
    avatars: [],
    time: "14:00 - 16:00",
  },
  {
    id: 6,
    title: "Ngopi with Bojo",
    status: "incomplete",
    tag: null,
    avatars: [],
    time: "19:00 - 20:00",
  },
];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleToggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "complete" ? "incomplete" : "complete",
            }
          : task
      )
    );
  };

  const handleEdit = (id: number, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle } : task))
    );
    setEditingId(null);
  };

  const handleStartEdit = (id: number) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // For adding new tasks, a handler can be added here and passed down as needed

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="rounded-2xl bg-[var(--card)] shadow-lg p-4 md:p-6 border border-[var(--border)]">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={() => handleToggleStatus(task.id)}
              onEdit={(newTitle) => handleEdit(task.id, newTitle)}
              onStartEdit={() => handleStartEdit(task.id)}
              onCancelEdit={handleCancelEdit}
              onDelete={() => handleDelete(task.id)}
              isEditing={editingId === task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
