import React from "react";

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    status: string;
  };
}

const statusColors: Record<string, string> = {
  incomplete: "bg-gray-300 text-gray-700",
  complete: "bg-green-200 text-green-800",
  in_progress: "bg-blue-200 text-blue-800",
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="flex items-center justify-between bg-[var(--input)] border border-[var(--border)] rounded px-4 py-2">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={task.status === "complete"} readOnly />
        <span className="font-medium">{task.title}</span>
        <span
          className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
            statusColors[task.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
      <div className="flex gap-2">
        <button className="text-blue-600 hover:underline text-sm">Edit</button>
        <button className="text-red-500 hover:underline text-sm">Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;
