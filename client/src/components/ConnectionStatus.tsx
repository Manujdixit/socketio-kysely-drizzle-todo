import React from "react";
import { useConnectionStatus } from "../hooks/useConnectionStatus";

const statusColors: Record<string, string> = {
  connected: "bg-green-500",
  connecting: "bg-yellow-400",
  reconnecting: "bg-yellow-400",
  disconnected: "bg-red-500",
};

export const ConnectionStatus: React.FC = () => {
  const status = useConnectionStatus();
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span
        className={`inline-block w-2 h-2 rounded-full ${statusColors[status]}`}
        aria-label={status}
      ></span>
      <span className="capitalize">{status}</span>
    </div>
  );
};
