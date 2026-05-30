import { useState } from "react";
import { useTodos } from "./hooks/useTodos";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import Filters from "./components/Filters";
import BulkActions from "./components/BulkActions";
import UpcomingView from "./components/UpcomingView";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import "./App.css";

export default function App() {
  const {
    todos, stats, loading, error, filters, totalPages,
    setFilters, addTodo, editTodo, toggleTodo, removeTodo, removeCompleted, removeBulk,
  } = useTodos();

  const [view, setView] = useState("all");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleEdit = (todo) => {
    setEditData(todo);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    if (editData) {
      await editTodo(editData.id, data);
    } else {
      await addTodo(data);
    }
    setShowForm(false);
    setEditData(null);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    await removeTodo(deleteId);
    setDeleteId(null);
  };

  const handleBulkDelete = async (ids) => {
    await removeBulk(ids);
    setSelectedIds([]);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="app-header">
        <h1>📝 Todo Manager</h1>
        <div className="header-actions">
          <span className="stats-badge">
            {stats.completed} of {stats.total} complete
          </span>
          <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
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
            onDeleteCompleted={removeCompleted}
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
                ← Previous
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
    </div>
  );
}
