import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to Login */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
