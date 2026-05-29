import { useState, useEffect } from "react";
import * as api from "../api/todos";

export default function Subtasks({ todoId }) {
  const [subtasks, setSubtasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await api.getSubtasks(todoId);
    setSubtasks(res.data);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await api.createSubtask(todoId, newTitle.trim());
    setNewTitle("");
    load();
  };

  const handleDelete = async (subtaskId) => {
    await api.deleteSubtask(todoId, subtaskId);
    load();
  };

  const handleToggle = async (subtaskId) => {
    await api.toggleTodo(subtaskId);
    load();
  };

  const done = subtasks.filter((s) => s.completed).length;

  return (
    <div className="subtasks-wrapper">
      <button className="subtasks-toggle" onClick={() => setOpen(!open)}>
        {open ? "▲" : "▶"} Subtasks {subtasks.length > 0 && `(${done}/${subtasks.length})`}
      </button>

      {open && (
        <div className="subtasks-list">
          {subtasks.map((s) => (
            <div key={s.id} className={`subtask-item ${s.completed ? "completed" : ""}`}>
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => handleToggle(s.id)}
              />
              <span>{s.title}</span>
              <button onClick={() => handleDelete(s.id)}>🗑️</button>
            </div>
          ))}

          <form className="subtask-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Add subtask..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit">+ Add</button>
          </form>
        </div>
      )}
    </div>
  );
}
