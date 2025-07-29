import React from "react";

const TaskForm: React.FC = () => {
  return (
    <form className="space-y-4 p-4 bg-[var(--input)] border border-[var(--border)] rounded">
      <div>
        <label className="block mb-1 font-medium text-[var(--foreground)]">
          Task Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-[var(--foreground)]">
          Status
        </label>
        <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
          <option value="incomplete">Incomplete</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded font-semibold"
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
