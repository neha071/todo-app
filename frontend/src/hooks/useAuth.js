import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as authApi from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getMe(token)
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.removeItem("token"); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    toast.success(`👤 Welcome back, ${res.data.user.name}!`);
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    toast.success(`🎉 Account created! Welcome, ${res.data.user.name}!`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("👋 Logged out successfully!");
  };

  return { user, token, loading, login, register, logout };
}
