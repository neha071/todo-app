import { useState, useEffect, useCallback } from "react";
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
      setError("Data load nahi ho saka. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data) => {
    await api.createTodo(data);
    fetchTodos();
  };

  const editTodo = async (id, data) => {
    await api.updateTodo(id, data);
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await api.toggleTodo(id);
    fetchTodos();
  };

  const removeTodo = async (id) => {
    await api.deleteTodo(id);
    fetchTodos();
  };

  const removeCompleted = async () => {
    await api.deleteCompleted();
    fetchTodos();
  };

  const removeBulk = async (ids) => {
    await api.bulkDelete(ids);
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
  };
}
