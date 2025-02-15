import React, { createContext, useEffect } from "react";
import io from "socket.io-client";

const SERVER_URL = "wss://real-time-chat-app-backend-l2sp.onrender.com"; // ✅ Ensure this is correct
const socket = io(SERVER_URL, { transports: ["websocket"] });

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔌 WebSocket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
    });

    return () => {
      console.log("🔌 Cleaning up WebSocket...");
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
