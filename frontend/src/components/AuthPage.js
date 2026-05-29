import { useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000" });

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        onLogin(res.data.access_token, res.data.user);
      } else {
        const res = await API.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        onLogin(res.data.access_token, res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">📝 Todo Manager</h1>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Login
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {tab === "register" && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder={tab === "register" ? "At least 6 characters" : "Password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "⏳ Please wait..." : tab === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          {tab === "login" ? (
            <>New here? <span onClick={() => { setTab("register"); setError(""); }}>Create account</span></>
          ) : (
            <>Already have an account? <span onClick={() => { setTab("login"); setError(""); }}>Login</span></>
          )}
        </p>
      </div>
    </div>
  );
}
