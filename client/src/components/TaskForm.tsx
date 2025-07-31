import React, { useState } from "react";
import { useSocketContext } from "../context/SocketProvider";
import { Delete, Notebook, X } from "lucide-react";
import { Button } from "./ui/button";

interface TaskFormProps {
  onClose?: () => void;
  isSheet?: boolean;
  roomId?: string;
  initialTitle?: string;
  initialNotes?: string;
  isEdit?: boolean;
  onUpdate?: (updated: { title: string; todo_description?: string }) => void;
  onDelete?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  isSheet = false,
  roomId,
  initialTitle = "",
  initialNotes = "",
  isEdit = false,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes);

  const socket = useSocketContext();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isEdit && onUpdate) {
      onUpdate({ title, todo_description: notes });
      return;
    }
    const payload = {
      title,
      todo_description: notes,
      user_id: localStorage.getItem("token"),
      room_id: roomId || localStorage.getItem("currentRoomId"),
    };
    socket.emit("create_task", payload);

    if (onClose) onClose();
    setTitle("");
    setNotes("");
  };

  if (isSheet) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />

        {/* Sheet */}
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {isEdit ? "Edit task" : "Create new task"}
              </h2>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  title="Close"
                  aria-label="Close"
                  className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] p-2 rounded-full hover:bg-[var(--muted)] transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Form Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Add notes or description..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)] bg-[var(--muted)]/20">
              <div className="flex gap-3">
                {isEdit && onDelete && (
                  <Button
                    onClick={onDelete}
                    className="w-1/2"
                    variant={"destructive"}
                  >
                    <Delete />
                    <span>Delete</span>
                  </Button>
                )}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className={isEdit ? "w-1/2" : "w-full"}
                >
                  {isEdit ? (
                    "Update"
                  ) : (
                    <span className="flex justify-center items-center gap-2">
                      <Notebook />
                      Create Task
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md p-6 animate-in fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg text-[var(--foreground)]">
            {isEdit ? "Edit task" : "Create new task"}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-xl font-bold px-2"
            >
              ×
            </button>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Add notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--input)] border border-[var,--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded font-semibold hover:bg-[color-mix(in_oklch,var(--primary),black_10%)] transition"
          >
            {isEdit ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="flex-1 py-2 bg-[var(--muted)] text-[var(--muted-foreground)] rounded font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          {isEdit && onDelete && (
            <button
              type="button"
              className="flex-1 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
