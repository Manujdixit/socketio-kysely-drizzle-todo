import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketProvider";

/**
 * useConnectionStatus - React hook to track Socket.IO connection status
 * @returns {"connected" | "disconnected" | "connecting" | "reconnecting"}
 */
export function useConnectionStatus() {
  const socket = useSocketContext();
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "connecting" | "reconnecting"
  >(socket.connected ? "connected" : "disconnected");

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleConnecting = () => setStatus("connecting");
    const handleReconnect = () => setStatus("reconnecting");
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connecting", handleConnecting);
    socket.on("reconnect_attempt", handleReconnect);
    socket.on("reconnect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connecting", handleConnecting);
      socket.off("reconnect_attempt", handleReconnect);
      socket.off("reconnect", handleConnect);
    };
  }, [socket]);

  return status;
}
