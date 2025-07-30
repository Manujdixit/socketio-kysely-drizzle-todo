import React, { useState } from "react";

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
  onStartEdit,
  onCancelEdit,
  onDelete,
  isEditing,
}) => {
  const [editValue, setEditValue] = useState(task.title);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEdit) onEdit(editValue);
  };

  return (
    <div className="flex items-center justify-between bg-[var(--input)] border border-[var(--border)] rounded-2xl px-5 py-4 shadow group hover:shadow-lg transition-all min-h-[64px]">
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
              onClick={onCancelEdit}
              className="text-gray-500 hover:underline text-sm font-medium transition"
            >
              Cancel
            </button>
          </form>
        ) : (
          <span className="font-semibold truncate max-w-[200px] md:max-w-sm text-base">
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
        {task.time && (
          <span className="text-xs text-[var(--muted-foreground)] font-mono w-28 text-right">
            {task.time}
          </span>
        )}
        <span
          className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold ${
            statusColors[task.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
        {!isEditing && (
          <>
            <button
              className="opacity-0 group-hover:opacity-100 text-blue-600 hover:underline text-sm font-medium transition"
              onClick={onStartEdit}
            >
              Edit
            </button>
            <button
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:underline text-sm font-medium transition"
              onClick={onDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
