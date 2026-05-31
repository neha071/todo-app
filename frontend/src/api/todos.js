import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTodos = (params) => API.get("/todos", { params });
export const createTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const toggleTodo = (id) => API.patch(`/todos/${id}/toggle`);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const deleteCompleted = () => API.delete("/todos");
export const bulkDelete = (ids) => API.post("/todos/bulk-delete", { ids });
export const getStats = () => API.get("/stats");

export const createSubtask = (todoId, data) => API.post(`/todos/${todoId}/subtasks`, data);
export const updateSubtask = (subtaskId, data) => API.patch(`/subtasks/${subtaskId}`, data);
export const deleteSubtask = (subtaskId) => API.delete(`/subtasks/${subtaskId}`);
