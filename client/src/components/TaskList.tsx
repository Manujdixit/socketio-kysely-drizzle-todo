import React from "react";
import TaskItem from "./TaskItem";

// Placeholder data
const tasks = [
  { id: 1, title: "First Task", status: "incomplete" },
  { id: 2, title: "Second Task", status: "complete" },
  { id: 3, title: "Third Task", status: "in_progress" },
];

const TaskList: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded font-semibold hover:bg-[color-mix(in_oklch,var(--primary),black_10%)] transition">
          + Add Task
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
