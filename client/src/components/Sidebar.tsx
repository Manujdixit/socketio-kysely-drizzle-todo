import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import MiniCalendar from "./MiniCalendar";

const lists = [
  { name: "Home", color: "var(--sidebar-primary)", count: 8 },
  { name: "Completed", color: "var(--sidebar-accent)", count: 16 },
  { name: "Personal", color: "var(--chart-2)", count: 4 },
  { name: "Work", color: "var(--chart-3)", count: 6 },
  { name: "Diet", color: "var(--chart-4)", count: 3 },
  { name: "List of Book", color: "var(--chart-5)", count: 8 },
  { name: "Road trip list", color: "var(--muted)", count: 4 },
];

const groups = [
  { name: "Mobal Project", people: 5, avatars: ["🟢", "🟣", "🔵", "🟠", "🟡"] },
  { name: "Futur Project", people: 4, avatars: ["🟣", "🔵", "🟠", "🟡"] },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <aside
      className={`h-screen bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-all duration-300 flex flex-col shadow-xl z-30 sidebar-custom ${
        open ? "w-72" : "w-16"
      }`}
      aria-label="Sidebar navigation"
      data-open={open}
    >
      <div className="flex items-center p-5 border-b border-[var(--sidebar-border)] relative min-h-[64px]">
        <span
          className={`font-extrabold text-xl tracking-tight transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Private
        </span>
        <button
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-[#23272f] transition absolute right-4 top-1/2 -translate-y-1/2 shadow sidebar-toggle-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-4 overflow-y-auto">
        {/* Mini Calendar */}
        <MiniCalendar isCollapsed={!open} />

        <div className="mb-2 flex flex-col gap-1">
          {lists.map((list) => (
            <div
              key={list.name}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#23272f] cursor-pointer transition group min-h-[40px]"
              tabIndex={0}
              role="button"
              aria-label={list.name}
            >
              <span
                className="w-3 h-3 rounded-full border border-[var(--sidebar-border)] sidebar-list-dot"
                data-color={list.color}
              ></span>
              <span
                className={`flex-1 truncate font-medium ${
                  open ? "block" : "hidden"
                }`}
              >
                {list.name}
              </span>
              <span
                className={`text-xs font-semibold text-gray-500 ${
                  open ? "block" : "hidden"
                }`}
              >
                {list.count}
              </span>
            </div>
          ))}
          <button
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-semibold mt-3 px-3 py-2 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full ${
              open ? "justify-start" : "justify-center"
            }`}
            aria-label="Create new list"
          >
            <Plus size={18} />
            <span className={`${open ? "block" : "hidden"}`}>
              Create new list
            </span>
          </button>
        </div>
        <div
          className={`pt-4 pb-2 text-xs font-bold text-[var(--muted-foreground)] tracking-wide ${
            open ? "block" : "hidden"
          }`}
        >
          Group
        </div>
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div
              key={group.name}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 cursor-pointer transition group min-h-[40px] ${
                open ? "justify-start" : "justify-center"
              }`}
              tabIndex={0}
              role="button"
              aria-label={group.name}
            >
              <div className="flex -space-x-2">
                {group.avatars.map((a, i) => (
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
                className={`flex-1 truncate text-sm font-medium ${
                  open ? "block" : "hidden"
                }`}
              >
                {group.name}
              </span>
              <span
                className={`text-xs text-gray-500 ${open ? "block" : "hidden"}`}
              >
                {group.people} People
              </span>
            </div>
          ))}
          <button
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-semibold mt-3 px-3 py-2 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full ${
              open ? "justify-start" : "justify-center"
            }`}
            aria-label="Create new group"
          >
            <Plus size={18} />
            <span className={`${open ? "block" : "hidden"}`}>
              Create new group
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
