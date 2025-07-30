import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "./socket";

export function useSocket(roomId?: string) {
  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = socketRef.current;
    connectSocket();

    if (roomId) {
      socket.emit("join_room", roomId);
    }

    return () => {
      if (roomId) {
        socket.emit("leave_room", roomId);
      }
      disconnectSocket();
    };
    // Only run on mount/unmount or roomId change
    // eslint-disable-next-line
  }, [roomId]);

  return socketRef.current;
}
