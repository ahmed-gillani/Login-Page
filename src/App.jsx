import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/login";
import UserList from "./page/userlist";

// simple auth guard
const PrivateRoute = ({ children }) => {
  const loggedIn = !!localStorage.getItem("authUser");
  return loggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/users"
        element={                                                                 
          <PrivateRoute>
            <UserList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
