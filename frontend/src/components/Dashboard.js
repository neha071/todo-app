export default function Dashboard({ stats, todos }) {
  const todayDue = todos.filter((t) => {
    if (!t.due_date || t.completed) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.due_date === today;
  }).length;

  const overdue = todos.filter((t) => {
    if (!t.due_date || t.completed) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.due_date < today;
  }).length;

  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-card total">
        <div className="card-icon">📋</div>
        <div className="card-info">
          <span className="card-value">{stats.total}</span>
          <span className="card-label">Total</span>
        </div>
      </div>

      <div className="dashboard-card active">
        <div className="card-icon">⚡</div>
        <div className="card-info">
          <span className="card-value">{stats.active}</span>
          <span className="card-label">Active</span>
        </div>
      </div>

      <div className="dashboard-card completed">
        <div className="card-icon">✅</div>
        <div className="card-info">
          <span className="card-value">{stats.completed}</span>
          <span className="card-label">Completed</span>
        </div>
      </div>

      <div className="dashboard-card today">
        <div className="card-icon">📅</div>
        <div className="card-info">
          <span className="card-value">{todayDue}</span>
          <span className="card-label">Due Today</span>
        </div>
      </div>

      <div className="dashboard-card overdue">
        <div className="card-icon">🔴</div>
        <div className="card-info">
          <span className="card-value">{overdue}</span>
          <span className="card-label">Overdue</span>
        </div>
      </div>

      <div className="dashboard-card progress">
        <div className="card-icon">📊</div>
        <div className="card-info">
          <span className="card-value">{percent}%</span>
          <span className="card-label">Done</span>
        </div>
        <div className="dashboard-progress-bar">
          <div className="dashboard-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
