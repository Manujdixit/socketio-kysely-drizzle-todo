import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

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
      className={`h-screen bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-all duration-300 flex flex-col shadow-lg z-20 ${
        open ? "w-64" : "w-16"
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center p-4 border-b border-[var(--sidebar-border)] relative">
        <span
          className={`font-bold text-lg transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Private
        </span>
        <button
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-[#23272f] transition absolute right-4 top-1/2 -translate-y-1/2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          style={{ zIndex: 10 }}
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <div className="mb-2">
          {lists.map((list) => (
            <div
              key={list.name}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#23272f] cursor-pointer transition group"
              tabIndex={0}
              role="button"
              aria-label={list.name}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: list.color }}
              ></span>
              <span className={`flex-1 truncate ${open ? "block" : "hidden"}`}>
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
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-medium mt-2 px-2 py-2 rounded-lg hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full ${
              open ? "justify-start" : "justify-center"
            }`}
            aria-label="Create new list"
          >
            <Plus size={16} />
            <span className={`${open ? "block" : "hidden"}`}>
              Create new list
            </span>
          </button>
        </div>
        <div
          className={`pt-4 pb-2 text-xs font-semibold text-[var(--muted-foreground)] ${
            open ? "block" : "hidden"
          }`}
        >
          Group
        </div>
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div
              key={group.name}
              className={`flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 cursor-pointer transition group ${
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
                    className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center text-lg border-2 border-white dark:border-[#18181b]"
                    aria-label={`Avatar ${i + 1}`}
                  >
                    {a}
                  </span>
                ))}
              </div>
              <span
                className={`flex-1 truncate text-sm ${
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
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-medium mt-2 px-2 py-2 rounded-lg hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full ${
              open ? "justify-start" : "justify-center"
            }`}
            aria-label="Create new group"
          >
            <Plus size={16} />
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
