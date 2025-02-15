import { io } from "socket.io-client";


let socket = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    console.log("🔌 Connecting WebSocket...");
    const token = localStorage.getItem("chat_token"); // Get token from local storage
    socket = io("wss://real-time-chat-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Add withCredentials if you're using cookies
      withCredentials: true,
      // Add error handling
      timeout: 10000 // Send token for authentication
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