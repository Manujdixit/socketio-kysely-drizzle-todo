import AppLayout from "@/components/AppLayout";
import GroupSheetSidebar from "@/components/GroupSheetSidebar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
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
    <AppLayout
      showSidebar={true}
      sidebarProps={{
        open: sidebarOpen,
        setOpen: setSidebarOpen,
        onCreateGroup: () => setShowGroupSheet(true),
      }}
      showGroupSheet={showGroupSheet}
      groupSheetSidebar={
        showGroupSheet ? (
          <GroupSheetSidebar onClose={() => setShowGroupSheet(false)} />
        ) : null
      }
      onTaskButtonClick={() => setShowTaskForm(true)}
    >
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-12">
        <div className="max-w-2xl mx-auto py-6">
          <TaskList />
        </div>
      </div>
      {/* Task Form Sheet */}
      {showTaskForm && (
        <TaskForm isSheet onClose={() => setShowTaskForm(false)} />
      )}
    </AppLayout>
  );
};
