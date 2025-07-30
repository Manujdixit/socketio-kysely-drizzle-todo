import React, { createContext, useContext, useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";
import { useAuth } from "./AuthProvider";

const SocketContext = createContext(getSocket());

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef(getSocket());
  const { user } = useAuth();

  useEffect(() => {
    const socket = connectSocket();
    // Identify user after connect
    if (user && user.user_id) {
      socket.emit("identify", user.user_id);
    }
    return () => {
      disconnectSocket();
    };
    // Only rerun if user changes
    // eslint-disable-next-line
  }, [user?.user_id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
