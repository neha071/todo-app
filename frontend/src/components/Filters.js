export default function Filters({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="filters">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search by title..."
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
      />

      <div className="filter-row">
        <select value={filters.status} onChange={(e) => update("status", e.target.value)}>
          <option value="all">All Todos</option>
          <option value="active">Active Only</option>
          <option value="completed">Completed Only</option>
        </select>

        <select value={filters.priority} onChange={(e) => update("priority", e.target.value)}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">All Categories</option>
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
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
