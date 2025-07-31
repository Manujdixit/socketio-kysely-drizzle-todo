import React from "react";
import Sidebar from "@/components/Sidebar";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarProps?: any;
  showGroupSheet?: boolean;
  groupSheetSidebar?: React.ReactNode;
  onTaskButtonClick?: () => void;
  sheetsOpen?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  sidebarProps = {},
  showGroupSheet = false,
  groupSheetSidebar,
  onTaskButtonClick,
  sheetsOpen = false,
}) => {
  const userName =
    typeof window !== "undefined"
      ? localStorage.getItem("user_name") || "User"
      : "User";
  return (
    <div className="flex h-screen bg-[var(--background)] flex-row overflow-hidden">
      {showSidebar && <Sidebar {...sidebarProps} sheetsOpen={sheetsOpen} />}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Common Header */}
        <div className="flex-shrink-0 px-2 sm:px-4 md:px-12 py-4 md:py-8 border-b border-[var(--border)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Sidebar toggle button - inline with Good Morning text */}
                {showSidebar && sidebarProps.setOpen && (
                  <button
                    className="p-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition shadow-sm"
                    onClick={() => sidebarProps.setOpen(!sidebarProps.open)}
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                  >
                    <Menu size={20} />
                  </button>
                )}
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    Hey, {userName}!{" "}
                    <span className="text-2xl wave-hand">👋</span>
                  </h1>
                  <div className="text-base text-[var(--muted-foreground)] font-medium mt-1">
                    Today,{" "}
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children content */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-12">
          {children}
        </div>

        {/* Common Task Button */}
        <div className="flex-shrink-0 px-2 sm:px-4 md:px-12 py-4 border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto">
            <button
              className="w-full flex items-center justify-center gap-3 p-4 bg-[var(--foreground)] text-[var(--background)] rounded-full shadow-xl font-semibold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 border border-[var(--primary)]/20 backdrop-blur-sm"
              onClick={onTaskButtonClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
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
      </main>
      {/* Connection Status Indicator - bottom right */}
      <div className="fixed bottom-6 right-8 z-50">
        <ConnectionStatus />
      </div>
      {/* Group Sheet Sidebar (optional) */}
      {showGroupSheet && groupSheetSidebar}
    </div>
  );
};

export default AppLayout;
