import { ConnectionStatus } from "@/components/ConnectionStatus";
import GroupSheetSidebar from "@/components/GroupSheetSidebar";
import Sidebar from "@/components/Sidebar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Menu, Plus } from "lucide-react";
import React, { useEffect } from "react";

export const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showGroupSheet, setShowGroupSheet] = React.useState(false);

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
    <div className="flex h-screen bg-[var(--background)] flex-row overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onCreateGroup={() => setShowGroupSheet(true)}
        sheetsOpen={showTaskForm || showGroupSheet}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-2 sm:px-4 md:px-12 py-4 md:py-8 border-b border-[var(--border)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {!sidebarOpen && (
              <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-lg border border-[var(--sidebar-border)]"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={24} />
              </button>
            )}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-12">
          <div className="max-w-2xl mx-auto py-6">
            <TaskList />
          </div>
        </div>

        {/* Fixed Create Task Button */}
        <div className="flex-shrink-0 px-2 sm:px-4 md:px-12 py-4 border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto">
            <button
              className="w-full flex items-center justify-center gap-3 p-4 bg-[var(--foreground)] text-[var(--background)] rounded-full shadow-xl font-semibold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 border border-[var(--primary)]/20 backdrop-blur-sm"
              onClick={() => setShowTaskForm(true)}
            >
              <Plus />
              <span className="hidden sm:inline">Create new task</span>
              <span className="inline sm:hidden">New Task</span>
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

      {/* Connection Status Indicator - bottom right */}
      <div className="fixed bottom-6 right-8 z-50">
        <ConnectionStatus />
      </div>

      {/* Group Sheet Sidebar */}
      {showGroupSheet && (
        <GroupSheetSidebar onClose={() => setShowGroupSheet(false)} />
      )}
    </div>
  );
};
