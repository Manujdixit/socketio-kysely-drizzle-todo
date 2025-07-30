import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import MiniCalendar from "./MiniCalendar";

const groups = [
  { name: "Mobal Project", people: 5, avatars: ["🟢", "🟣", "🔵", "🟠", "🟡"] },
  { name: "Futur Project", people: 4, avatars: ["🟣", "🔵", "🟠", "🟡"] },
];

interface SidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

function SidebarSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } md:hidden`}
      onClick={onClose}
    />
  );
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  // If not controlled, fallback to internal state (for direct use)
  const [internalOpen, internalSetOpen] = useState(true); // Default to true for desktop
  const isOpen = typeof open === "boolean" ? open : internalOpen;
  const handleSetOpen = setOpen || internalSetOpen;

  return (
    <>
      {/* Sheet for mobile */}
      <SidebarSheet isOpen={isOpen} onClose={() => handleSetOpen(false)} />
      <aside
        className={`fixed top-0 left-0 h-screen bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-all duration-300 flex flex-col shadow-xl z-50 sidebar-custom ${
          isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        } md:relative md:flex md:translate-x-0 ${
          isOpen ? "md:w-72" : "md:w-16"
        }`}
        aria-label="Sidebar navigation"
        data-open={isOpen}
      >
        <div className="flex items-center p-5 border-b border-[var(--sidebar-border)] relative min-h-[64px]">
          <span
            className={`font-extrabold text-xl tracking-tight transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
            }`}
          >
            Private
          </span>
          {/* Toggle button - expand/collapse */}
          <button
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-[#23272f] transition absolute right-4 top-1/2 -translate-y-1/2 shadow sidebar-toggle-btn"
            onClick={() => handleSetOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>
        <nav
          className={`flex-1 flex-col ${
            !isOpen ? "items-center" : "items-start"
          }`}
        >
          {/* Mini Calendar */}

          <MiniCalendar isCollapsed={!isOpen} />
          <div
            className={`pt-4 pb-2 text-xs font-bold text-[var(--muted-foreground)] tracking-wide transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
            }`}
          >
            Group
          </div>

          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <div
                key={group.name}
                className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 cursor-pointer transition group min-h-[40px] justify-start"
                tabIndex={0}
                role="button"
                aria-label={group.name}
                title={!isOpen ? group.name : undefined}
              >
                <div className="flex -space-x-2 flex-shrink-0">
                  {group.avatars
                    .slice(0, isOpen ? group.avatars.length : 1)
                    .map((a, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center text-lg border-2 border-white dark:border-[#18181b] shadow-sm"
                        aria-label={`Avatar ${i + 1}`}
                      >
                        {a}
                      </span>
                    ))}
                </div>
                <span
                  className={`flex-1 truncate text-sm font-medium transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
                  }`}
                >
                  {group.name}
                </span>
                <span
                  className={`text-xs text-gray-500 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
                  }`}
                >
                  {group.people} People
                </span>
              </div>
            ))}
            <button
              className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-semibold mt-3 px-3 py-2 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full justify-start ${
                !isOpen ? "md:justify-center" : ""
              }`}
              aria-label="Create new group"
              title={!isOpen ? "Create new group" : undefined}
            >
              <Plus size={18} className="flex-shrink-0" />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
                }`}
              >
                Create new group
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
