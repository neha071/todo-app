import { useState, useCallback } from "react";
import { useTodos } from "./hooks/useTodos";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import Filters from "./components/Filters";
import BulkActions from "./components/BulkActions";
import UpcomingView from "./components/UpcomingView";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";
import AuthPage from "./components/AuthPage";
import ExportButton from "./components/ExportButton";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import "./App.css";

export default function App() {
  // Check localStorage for existing token on app start
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const {
    todos, stats, loading, error, filters, totalPages,
    setFilters, addTodo, editTodo, toggleTodo, removeTodo, removeCompleted, removeBulk,
  } = useTodos(token);

  const [view, setView] = useState("all");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleNewTodo = useCallback(() => {
    setShowForm((prev) => !prev);
    setEditData(null);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditData(null);
  }, []);

  const handleToggleDark = useCallback(() => setDarkMode((prev) => !prev), []);

  useKeyboardShortcuts({
    onNewTodo: handleNewTodo,
    onToggleDark: handleToggleDark,
    onCloseForm: handleCloseForm,
    showForm,
  });

  // Save token and user on login
  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Clear everything on logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // No token — show login page
  if (!token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const handleEdit = (todo) => {
    setEditData(todo);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editData) {
        await editTodo(editData.id, data);
        showToast("✅ Todo updated!");
      } else {
        await addTodo(data);
        showToast("✅ Todo added successfully!");
      }
      setShowForm(false);
      setEditData(null);
    } catch {
      showToast("❌ Something went wrong, please try again!", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await removeTodo(deleteId);
      showToast("🗑️ Todo deleted!");
    } catch {
      showToast("❌ Could not delete!", "error");
    }
    setDeleteId(null);
  };

  const handleBulkDelete = async (ids) => {
    try {
      await removeBulk(ids);
      showToast(`🗑️ ${ids.length} todos deleted!`);
    } catch {
      showToast("❌ Could not delete!", "error");
    }
    setSelectedIds([]);
  };

  const handleRemoveCompleted = async () => {
    try {
      await removeCompleted();
      showToast("✅ All completed todos deleted!");
    } catch {
      showToast("❌ Something went wrong!", "error");
    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="app-header">
        <h1>📝 Todo Manager</h1>
        <div className="header-actions">
          <span className="stats-badge">
            {stats.completed} of {stats.total} complete
          </span>
          {user && <span className="user-badge">👤 {user.name}</span>}
          <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <ExportButton todos={todos} />
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditData(null); }}>
            {showForm ? "Cancel" : "+ New Todo"}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-container">
          <TodoForm
            onSubmit={handleFormSubmit}
            editData={editData}
            onCancel={() => { setShowForm(false); setEditData(null); }}
          />
        </div>
      )}

      <nav className="view-tabs">
        <button className={view === "all" ? "active" : ""} onClick={() => setView("all")}>
          📋 All Todos
        </button>
        <button className={view === "upcoming" ? "active" : ""} onClick={() => setView("upcoming")}>
          📅 Upcoming
        </button>
      </nav>

      {view === "all" && (
        <>
          <Filters filters={filters} setFilters={setFilters} />
          <BulkActions
            todos={todos}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onDeleteSelected={handleBulkDelete}
            onDeleteCompleted={handleRemoveCompleted}
          />

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="spinner">⏳ Loading...</div>
          ) : todos.length === 0 ? (
            <div className="empty-msg">No todos yet. Create one! 🎯</div>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  selected={selectedIds.includes(todo.id)}
                  onSelect={(id) =>
                    setSelectedIds((prev) =>
                      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                    )
                  }
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              >
                ← Prev
              </button>
              <span>Page {filters.page} of {totalPages}</span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {view === "upcoming" && (
        <UpcomingView
          todos={todos}
          onToggle={toggleTodo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
