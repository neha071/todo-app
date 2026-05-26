import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

export const getTodos = (params) => API.get("/todos", { params });
export const createTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const toggleTodo = (id) => API.patch(`/todos/${id}/toggle`);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const deleteCompleted = () => API.delete("/todos");
export const bulkDelete = (ids) => API.post("/todos/bulk-delete", { ids });
export const getStats = () => API.get("/stats");
