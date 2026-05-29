import { format, isPast, isToday, isTomorrow } from "date-fns";
import Subtasks from "./Subtasks";

const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

export default function TodoItem({ todo, onToggle, onEdit, onDelete, selected, onSelect }) {
  const isOverdue = todo.due_date && !todo.completed && isPast(new Date(todo.due_date + "T23:59:59"));

  const getDueDateLabel = () => {
    if (!todo.due_date) return null;
    const date = new Date(todo.due_date + "T00:00:00");
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "dd MMM yyyy");
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""} ${isOverdue ? "overdue" : ""}`}>
      <input
        type="checkbox"
        className="select-checkbox"
        checked={selected}
        onChange={() => onSelect(todo.id)}
      />

      <input
        type="checkbox"
        className="complete-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {todo.description && <div className="todo-description">{todo.description}</div>}
        <div className="todo-meta">
          <span className="priority-badge" style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}>
            {todo.priority}
          </span>
          <span className="category-badge">{todo.category}</span>
          {todo.due_date && (
            <span className={`due-date ${isOverdue ? "overdue-text" : ""}`}>
              📅 {getDueDateLabel()}
              {isOverdue && " (Overdue!)"}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button className="btn-icon" onClick={() => onEdit(todo)} title="Edit">✏️</button>
        <button className="btn-icon btn-delete" onClick={() => onDelete(todo.id)} title="Delete">🗑️</button>
      </div>
      <Subtasks todoId={todo.id} />
    </div>
  );
}
