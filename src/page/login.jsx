// src/page/Login.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loadUsers, setAuthUser } from "../storage.js";
import Modal from "../components/Modal";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("authUser"));
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const emailRef = useRef(null);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("authUser"));
  }, []);

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  if (loggedIn) return <Navigate to="/users" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      setLoading(false);
      return;
    }

    try {
      const users = loadUsers();
      const found = users.find(
        (u) =>
          (u.email || "").toLowerCase() === trimmedEmail &&
          u.password === password
      );

      if (!found) {
        setModalMessage("❌ Invalid email or password");
        setLoading(false);
        return;
      }

      const authUser = { id: found.id, name: found.name, email: found.email };
      setAuthUser(authUser);

      setModalMessage("✅ Login successful! Redirecting...");
      setLoggedIn(true);

      setTimeout(() => navigate("/users", { replace: true }), 800);
    } catch (err) {
      console.error("Login error:", err);
      setModalMessage("⚠️ Unexpected error. See console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" role="dialog" aria-labelledby="login-heading">
        <header className="login-brand">
          <div className="logo">USER LOGIN</div>
          <h1 id="login-heading">Sign in</h1>
          <p className="sub">Access your User Management dashboard</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <div className="password-row">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                aria-required="true"
              />
            </div>

            <div className="show-password-row">
              <button
                type="button"
                className="btn-icon show-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>
          </div>

          {error && <div className="error" role="alert">{error}</div>}
{/* 
          <div className="form-row row-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <div />
          </div> */}

          <div className="form-row actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign in"}
            </button>

            <button
              type="button"
              className="btn outline"
              disabled={loading}
              onClick={() => {
                setEmail("");
                setPassword("");
                setError("");
              }}
            >
              Clear
            </button>
          </div>

          <div className="hint">
            Try <strong>admin@example.com / pass123</strong>
          </div>
        </form>
      </div>

      {modalMessage && (
        <Modal title="Message" onClose={() => setModalMessage("")}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
}
