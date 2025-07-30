import React from "react";
import { X } from "lucide-react";
import JoinGroup from "@/pages/JoinGroup";

interface JoinGroupSheetProps {
  onClose?: () => void;
}

const JoinGroupSheet: React.FC<JoinGroupSheetProps> = ({ onClose }) => {
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
            <h2 className="text-xl font-bold text-[var(--primary)]">
              Join a Group
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] p-2 rounded-full hover:bg-[var(--muted)] transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {/* Form Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <JoinGroup />
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinGroupSheet;
