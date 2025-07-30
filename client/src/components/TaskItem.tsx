import { Edit } from "lucide-react";
import React, { useState } from "react";
import TaskForm from "./TaskForm";

interface TaskItemProps {
  task: {
    todo_id: number;
    title: string;
    status: string;
    todo_description?: string;
    tag?: string | null;
    avatars?: string[];
    time?: string;
  };
  onToggleStatus?: () => void;
  onEdit?: (newTitle: string) => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onUpdate?: (updated: { title: string; todo_description?: string }) => void;
}

const statusColors: Record<string, string> = {
  incomplete: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  complete: "bg-green-200 text-green-800",
  in_progress: "bg-blue-200 text-blue-800",
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onCancelEdit,
  onDelete,
  isEditing,
  onUpdate,
}) => {
  const [editValue, setEditValue] = useState(task.title);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEdit) onEdit(editValue);
    setShowEditSheet(false);
  };

  const handleUpdateTask = (updated: {
    title: string;
    todo_description?: string;
  }) => {
    if (onUpdate) onUpdate(updated);
    else if (onEdit) onEdit(updated.title);
    setShowEditSheet(false);
  };

  const handleDeleteTask = () => {
    if (onDelete) onDelete();
    setShowEditSheet(false);
  };

  const handleOpenEditSheet = () => {
    setShowEditSheet(true);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-6 py-5 min-h-[72px] transition-all duration-200 group
        border-2 rounded-2xl shadow-lg hover:shadow-2xl
        ${
          task.status === "complete"
            ? "border-green-400/60 bg-gradient-to-br from-[var(--card)] via-[var(--input)] to-[var(--muted)]"
            : task.status === "in_progress"
            ? "border-blue-400/60"
            : "border-[var(--border)]"
        }
      `}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={task.status === "complete"}
            onChange={onToggleStatus}
            className="accent-[var(--primary)] w-5 h-5 rounded-lg border border-[var(--border)] shadow-sm cursor-pointer"
          />
          {isEditing ? (
            <form
              onSubmit={handleEditSubmit}
              className="flex items-center gap-2 w-full"
            >
              <input
                type="text"
                value={editValue}
                onChange={handleEditChange}
                autoFocus
                className="font-semibold truncate max-w-[200px] md:max-w-sm text-base bg-[var(--input)] border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <button
                type="submit"
                className="text-green-600 hover:underline text-sm font-medium transition"
              >
                Save
              </button>
              <button
                type="button"
                className="text-red-600 hover:underline text-sm font-medium transition"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            </form>
          ) : (
            <span
              className={`font-semibold truncate max-w-[200px] md:max-w-sm text-base transition-all duration-200
              ${
                task.status === "complete"
                  ? "line-through text-[var(--muted-foreground)] italic bg-gradient-to-r from-[var(--muted)]/40 to-transparent px-2 py-1 rounded"
                  : ""
              }`}
            >
              {task.title}
            </span>
          )}
          {task.tag && (
            <span className="ml-2 px-2 py-0.5 rounded-lg bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] text-xs font-bold whitespace-nowrap">
              #{task.tag}
            </span>
          )}
          {task.avatars && task.avatars.length > 0 && (
            <span className="flex -space-x-2 ml-2">
              {task.avatars.map((a, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full bg-[var(--muted)] flex items-center justify-center text-lg border-2 border-white dark:border-[#18181b] shadow-sm"
                >
                  {a}
                </span>
              ))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5">
          {!isEditing && (
            <>
              <button
                className="opacity-0 group-hover:opacity-100 bg-accent p-2 rounded text-foreground hover:underline text-sm font-medium transition"
                onClick={handleOpenEditSheet}
              >
                <Edit />
              </button>
            </>
          )}
          <span
            className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold ${
              statusColors[task.status] || "bg-gray-200 text-gray-700"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>
      {showEditSheet && (
        <TaskForm
          isSheet
          onClose={() => setShowEditSheet(false)}
          initialTitle={task.title}
          initialNotes={task.todo_description}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          isEdit
        />
      )}
    </>
  );
};

export default TaskItem;
