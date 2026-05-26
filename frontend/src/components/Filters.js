export default function Filters({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="filters">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Title se search karo..."
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
      />

      <div className="filter-row">
        <select value={filters.status} onChange={(e) => update("status", e.target.value)}>
          <option value="all">Sab Todos</option>
          <option value="active">Sirf Active</option>
          <option value="completed">Sirf Completed</option>
        </select>

        <select value={filters.priority} onChange={(e) => update("priority", e.target.value)}>
          <option value="">Sabhi Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Sabhi Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>

        <select value={filters.sort_by} onChange={(e) => update("sort_by", e.target.value)}>
          <option value="created_at">Date Created</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        <select value={filters.sort_order} onChange={(e) => update("sort_order", e.target.value)}>
          <option value="desc">Newest Pehle</option>
          <option value="asc">Oldest Pehle</option>
        </select>
      </div>
    </div>
  );
}
