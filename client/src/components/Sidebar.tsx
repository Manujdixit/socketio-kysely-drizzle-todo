import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  UserPlus,
} from "lucide-react";
import MiniCalendar from "./ui/MiniCalendar";
import JoinGroupSheet from "./JoinGroupSheet";
import { useUserGroups } from "../hooks/useUserGroups";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface SidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onCreateGroup?: () => void;
  sheetsOpen?: boolean;
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

const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  onCreateGroup,
  sheetsOpen,
}) => {
  const [internalOpen, internalSetOpen] = useState(true); // Default to true for desktop
  const isOpen = typeof open === "boolean" ? open : internalOpen;
  const handleSetOpen = setOpen || internalSetOpen;
  const [showJoinGroupSheet, setShowJoinGroupSheet] = useState(false);
  const { groups, loading, error } = useUserGroups();
  const navigate = useNavigate();

  const anySheetsOpen = sheetsOpen || showJoinGroupSheet;

  return (
    <>
      {/* Sheet for mobile */}
      <SidebarSheet isOpen={isOpen} onClose={() => handleSetOpen(false)} />
      <aside
        className={`fixed top-0 left-0 h-screen bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-all duration-300 flex flex-col shadow-xl z-50 sidebar-custom ${
          isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        } md:relative md:flex md:translate-x-0 ${
          isOpen ? "md:w-72" : "md:w-16"
        } ${anySheetsOpen ? "blur-sm pointer-events-none" : ""}`}
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
          className={`flex-1 flex-col px-2 ${
            !isOpen ? "items-center" : "items-start"
          }`}
        >
          {/* Mini Calendar */}

          <MiniCalendar isCollapsed={!isOpen} />
          <div
            className={`pt-4 pb-2 px-2 text-xs font-bold text-[var(--muted-foreground)] tracking-wide transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
            }`}
          >
            Group
          </div>

          <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-xs text-[var(--muted-foreground)] px-3 py-2">
                Loading groups...
              </div>
            ) : error ? (
              <div className="text-xs text-red-500 px-3 py-2">{error}</div>
            ) : groups.length === 0 ? (
              <div className="text-xs text-[var(--muted-foreground)] px-3 py-2">
                No groups found.
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.room_id}
                  className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 cursor-pointer transition group min-h-[40px] justify-start"
                  tabIndex={0}
                  role="button"
                  aria-label={group.room_name}
                  title={!isOpen ? group.room_name : undefined}
                  onClick={() => navigate(`/group/${group.room_id}`)}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold bg-primary text-foreground border-2 border-white dark:border-[#18181b] shadow-lg"
                    aria-label="Avatar"
                  >
                    {group.room_name?.[0]?.toUpperCase() || "?"}
                  </span>
                  {isOpen && (
                    <>
                      <span
                        className={`flex-1 truncate text-sm font-medium transition-opacity duration-300 ${
                          isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
                        }`}
                      >
                        {group.room_name}
                      </span>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          <button
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-semibold mt-3 px-3 py-2 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full justify-start ${
              !isOpen ? "md:justify-center" : ""
            }`}
            aria-label="Create new group"
            title={!isOpen ? "Create new group" : undefined}
            onClick={onCreateGroup}
          >
            <Users size={18} className="flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                isOpen ? "flex" : "hidden"
              }`}
            >
              Create new group
            </span>
          </button>
          <button
            className={`flex items-center gap-2 text-sm text-[var(--sidebar-primary)] font-semibold mt-3 px-3 py-2 rounded-xl hover:bg-[var(--sidebar-accent)]/20 dark:hover:bg-[var(--sidebar-accent)]/10 transition w-full justify-start ${
              !isOpen ? "md:justify-center" : ""
            }`}
            aria-label="Join group"
            title={!isOpen ? "Join group" : undefined}
            onClick={() => setShowJoinGroupSheet(true)}
          >
            <UserPlus size={18} className="flex-shrink-0" />
            {isOpen && (
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
                }`}
              >
                Join group
              </span>
            )}
          </button>
        </nav>
        {/* Account button at bottom */}
        <div className="w-full p-4 flex justify-center items-center border-t border-[var(--sidebar-border)]">
          <Button
            onClick={() => {
              localStorage.clear();
              try {
                navigate("/signin");
              } catch {
                window.location.href = "/signin";
              }
            }}
            className="w-full"
          >
            <LogOut />
          </Button>
        </div>
      </aside>
      {showJoinGroupSheet && (
        <JoinGroupSheet onClose={() => setShowJoinGroupSheet(false)} />
      )}
    </>
  );
};

export default Sidebar;
