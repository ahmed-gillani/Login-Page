// src/page/userlist.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadUsers, saveUsers, clearAuthUser, resetToAdmin } from "../storage.js";
import CreateUser from "../components/createUser";
import EditUser from "../components/edit";
import DeleteUser from "../components/delete";

export default function UserList() {
  const navigate = useNavigate();

  // lazy initialize users from storage
  const [users, setUsers] = useState(() => loadUsers());
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [query, setQuery] = useState("");

  // If app starts while logged OUT, reset localStorage to admin-only
  useEffect(() => {
    const authRaw = localStorage.getItem("authUser");
    if (!authRaw) {
      // no logged-in user — ensure only admin remains
      resetToAdmin();
      setUsers(loadUsers());
    }
    // if auth exists, leave users as-is
  }, []);

  // persist whenever users changes
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // addUser with duplicate-email check (trim + lowercase)
  const addUser = (user) => {
    const lower = (user.email || "").trim().toLowerCase();
    if (users.some(u => (u.email || "").trim().toLowerCase() === lower)) {
      alert("A user with this email already exists.");
      return;
    }

    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers(prev => [...prev, { ...user, id: nextId }]);
    setShowCreate(false);
  };

  const updateUser = (updated) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setEditUser(null);
  };

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteUser(null);
  };

  const signOut = () => {
    // clear auth and reset stored users to admin-only
    clearAuthUser();
    resetToAdmin();
    // update local state to reflect reset (optional but immediate)
    setUsers(loadUsers());
    // navigate to login route
    navigate("/login");
  };

  // filtered list (search by name/email)
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      u =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="app-wrapper userlist-card">
      <div className="userlist-header">
        <div className="userlist-left">
          <div className="avatar">
            {(localStorage.getItem("authUser")
              ? JSON.parse(localStorage.getItem("authUser")).name?.[0]
              : "U") || "U"}
          </div>
          <div>
            <h2 className="userlist-title">User Management</h2>
            <div className="userlist-sub">
              Manage users — create, edit or remove accounts
            </div>
          </div>
        </div>

        <div className="userlist-toolbar">
          <div
            className="userlist-search"
            role="search"
            aria-label="Search users"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ opacity: 0.7, marginRight: 6 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              placeholder="Search name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button className="btn primary" onClick={() => setShowCreate(s => !s)}>
            {showCreate ? "Close" : "Create User"}
          </button>

          <button className="btn danger" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="table-wrap" role="region" aria-label="Users table">
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: 150, textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-users">
                  No users match your search
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ display: "flex", alignItems: "center" }}>
                    <div
                      className="avatar"
                      style={{
                        marginRight: 10,
                        width: 36,
                        height: 36,
                        fontSize: 13,
                      }}
                    >
                      {(u.name && u.name[0])
                        ? u.name[0].toUpperCase()
                        : (u.email && u.email[0].toUpperCase()) || "U"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#f8fbff" }}>
                        {u.name}
                      </div>
                      <div className="kv" style={{ marginTop: 4 }}>
                        {u.id === 1 ? "Admin" : "User"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="kv-pill">{u.email}</span>
                  </td>
                  <td className="row-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => setEditUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => setDeleteUser(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateUser onCreate={addUser} onCancel={() => setShowCreate(false)} />
      )}

      {editUser && (
        <EditUser
          user={editUser}
          onSave={updateUser}
          onCancel={() => setEditUser(null)}
        />
      )}

      {deleteUser && (
        <DeleteUser
          user={deleteUser}
          onConfirm={() => removeUser(deleteUser.id)}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}
