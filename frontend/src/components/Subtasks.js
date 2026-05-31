import { useState } from "react";
import { createSubtask, updateSubtask, deleteSubtask } from "../api/todos";

export default function Subtasks({ todoId, subtasks, onRefresh }) {
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const completed = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createSubtask(todoId, { title: newTitle.trim() });
    setNewTitle("");
    setAdding(false);
    onRefresh();
  };

  const handleToggle = async (subtask) => {
    await updateSubtask(subtask.id, { completed: !subtask.completed });
    onRefresh();
  };

  const handleDelete = async (subtaskId) => {
    await deleteSubtask(subtaskId);
    onRefresh();
  };

  return (
    <div className="subtasks">
      {subtasks.length > 0 && (
        <div className="subtasks-progress">
          <span className="subtasks-count">{completed}/{subtasks.length} completed</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <ul className="subtasks-list">
        {subtasks.map((s) => (
          <li key={s.id} className={`subtask-item ${s.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={s.completed}
              onChange={() => handleToggle(s)}
            />
            <span className="subtask-title">{s.title}</span>
            <button className="subtask-delete" onClick={() => handleDelete(s.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={handleAdd} className="subtask-form">
          <input
            autoFocus
            type="text"
            placeholder="Subtask title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setAdding(false); setNewTitle(""); }}>Cancel</button>
        </form>
      ) : (
        <button className="add-subtask-btn" onClick={() => setAdding(true)}>+ Add Subtask</button>
      )}
    </div>
  );
}
