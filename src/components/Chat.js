import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket, connectSocket, disconnectSocket } from "../socket"; // Import WebSocket functions
import "../styles/Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("chat_username");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  useEffect(() => {
    console.log("🔌 Establishing WebSocket Connection...");
    const socket = connectSocket();

    const handleNewMessage = (data) => {
      console.log("📥 Message Received:", data);
      setMessages((prevMessages) => [...prevMessages, { ...data, status: "Sent" }]);

      // Simulate "Delivered" status after 2 seconds
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === data._id ? { ...msg, status: "Delivered" } : msg
          )
        );
      }, 2000);
    };

    if (socket) {
      socket.on("connect", () => console.log("✅ WebSocket Connected:", socket.id));
      socket.on("receive_message", handleNewMessage);
      socket.on("previous_messages", (data) => {
        console.log("📜 Received Previous Messages:", data);
        setMessages(data);
      });
      socket.on("disconnect", (reason) => console.log("❌ WebSocket Disconnected - Reason:", reason));
    }

    return () => {
      console.log("🔌 Cleanup: Removing WebSocket Listeners...");
      if (socket) {
        socket.off("receive_message", handleNewMessage);
        socket.off("previous_messages");
        socket.disconnect();
      }
    };
  }, []);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.log("❌ WebSocket Not Connected. Cannot send message.");
      return;
    }

    if (message.trim() !== "") {
      console.log("✅ Sending Message:", message);
      socket.emit("send_message", { username, message, timestamp: new Date() });
      setMessage("");
    } else {
      console.log("❌ Message is empty, not sending.");
    }
  };

  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_username");
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <button onClick={handleLogout}>Logout</button>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index} className={`chat-message ${msg.username.toLowerCase() === username?.toLowerCase() ? "sent" : "received"}`}>
            <strong>{msg.username}:</strong> {msg.message} <br />
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
            <span className={msg.status === "Delivered" ? "status-delivered" : "status-sent"}>
              {msg.status || "Sent"}
            </span>
          </p>
        ))}
        <div ref={messagesEndRef} /> {/* Auto-scroll target */}
      </div>
      <input
        type="text"
        className="chat-input"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="chat-button" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;
