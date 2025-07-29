import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";

export const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = React.useState(false);

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
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-4 md:px-12 py-8 md:py-12 bg-[var(--background)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
              Good Morning, Sullivan!{" "}
              <span className="text-2xl wave-hand">👋</span>
            </h1>
            <div className="text-base text-[var(--muted-foreground)] font-medium">
              Today,{" "}
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-[var(--muted)] transition shadow-sm">
              Today
            </button>
            <button
              className="p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition shadow-sm"
              title="Calendar view"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
        {/* Task List */}
        <div className="flex-1 flex flex-col items-center">
          <TaskList />

          {/* Bottom Create Button */}
          <div className="fixed bottom-8  w-full max-w-2xl mx-auto z-30">
            <button
              className="w-full flex items-center justify-center gap-3 p-4 bg-[var(--foreground)] text-[var(--background)] rounded-full shadow-xl font-semibold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 border border-[var(--primary)]/20 backdrop-blur-sm"
              onClick={() => setShowTaskForm(true)}
            >
              <Plus />
              Create new task
              <div className="flex items-center gap-1 ml-auto opacity-75">
                <kbd className="px-2 py-1 text-xs font-mono bg-black/10 rounded border border-black/20">
                  Ctrl
                </kbd>
                <span className="text-xs">+</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-black/10 rounded border border-black/20">
                  K
                </kbd>
              </div>
            </button>
          </div>
        </div>

        {/* Task Form Sheet */}
        {showTaskForm && (
          <TaskForm isSheet onClose={() => setShowTaskForm(false)} />
        )}
      </main>
    </div>
  );
};
