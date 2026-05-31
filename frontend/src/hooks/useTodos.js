import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as api from "../api/todos";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "",
    category: "",
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
  });

  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      if (params.status === "all") delete params.status;
      if (!params.priority) delete params.priority;
      if (!params.category) delete params.category;
      if (!params.search) delete params.search;

      const res = await api.getTodos(params);
      setTodos(res.data.todos);
      setTotalPages(res.data.pages);

      const statsRes = await api.getStats();
      setStats(statsRes.data);
    } catch (err) {
      setError("Could not load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data) => {
    await api.createTodo(data);
    toast.success("✅ Todo added successfully!");
    fetchTodos();
  };

  const editTodo = async (id, data) => {
    await api.updateTodo(id, data);
    toast.success("✏️ Todo updated!");
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await api.toggleTodo(id);
    fetchTodos();
  };

  const removeTodo = async (id) => {
    await api.deleteTodo(id);
    toast.error("🗑️ Todo deleted!");
    fetchTodos();
  };

  const removeCompleted = async () => {
    await api.deleteCompleted();
    toast.success("🧹 Completed todos cleared!");
    fetchTodos();
  };

  const removeBulk = async (ids) => {
    await api.bulkDelete(ids);
    toast.error(`🗑️ ${ids.length} todos deleted!`);
    fetchTodos();
  };

  return {
    todos,
    stats,
    loading,
    error,
    filters,
    totalPages,
    setFilters,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
    removeCompleted,
    removeBulk,
    fetchTodos,
  };
}
