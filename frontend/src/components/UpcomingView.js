import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";
import TodoItem from "./TodoItem";

export default function UpcomingView({ todos, onToggle, onEdit, onDelete, selectedIds, setSelectedIds }) {
  const notCompleted = todos.filter((t) => !t.completed && t.due_date);

  const overdue = notCompleted.filter((t) => isPast(new Date(t.due_date + "T23:59:59")) && !isToday(new Date(t.due_date + "T00:00:00")));
  const todayTodos = notCompleted.filter((t) => isToday(new Date(t.due_date + "T00:00:00")));
  const tomorrowTodos = notCompleted.filter((t) => isTomorrow(new Date(t.due_date + "T00:00:00")));
  const thisWeekTodos = notCompleted.filter((t) => {
    const d = new Date(t.due_date + "T00:00:00");
    return isThisWeek(d) && !isToday(d) && !isTomorrow(d);
  });

  const Section = ({ title, items, className }) => (
    items.length > 0 && (
      <div className={`upcoming-section ${className || ""}`}>
        <h3>{title} ({items.length})</h3>
        {items.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            selected={selectedIds.includes(todo.id)}
            onSelect={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
          />
        ))}
      </div>
    )
  );

  return (
    <div className="upcoming-view">
      <h2>📅 Upcoming Tasks</h2>
      <Section title="🔴 Overdue" items={overdue} className="overdue-section" />
      <Section title="⭐ Today" items={todayTodos} />
      <Section title="📌 Tomorrow" items={tomorrowTodos} />
      <Section title="📆 This Week" items={thisWeekTodos} />
      {overdue.length === 0 && todayTodos.length === 0 && tomorrowTodos.length === 0 && thisWeekTodos.length === 0 && (
        <p className="empty-msg">No upcoming tasks 🎉</p>
      )}
    </div>
  );
}
