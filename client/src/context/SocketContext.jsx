import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
        autoConnect: true,
        transports: ["websocket"]
      });
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);