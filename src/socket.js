import { io } from "socket.io-client";


let socket = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    console.log("🔌 Connecting WebSocket...");
    const token = localStorage.getItem("chat_token"); // Get token from local storage
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token }, // Send token for authentication
    });

    socket.on("connect", () => console.log("✅ WebSocket Connected:", socket.id));
    socket.on("disconnect", (reason) => console.log("❌ WebSocket Disconnected - Reason:", reason));
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting WebSocket...");
    socket.disconnect();
    socket = null;
  }
};