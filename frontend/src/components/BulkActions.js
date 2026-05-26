export default function BulkActions({ todos, selectedIds, setSelectedIds, onDeleteSelected, onDeleteCompleted }) {
  const allSelected = todos.length > 0 && selectedIds.length === todos.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(todos.map((t) => t.id));
    }
  };

  return (
    <div className="bulk-actions">
      <label className="select-all">
        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
        Sab Select Karo
      </label>

      {selectedIds.length > 0 && (
        <button className="btn btn-danger" onClick={() => onDeleteSelected(selectedIds)}>
          🗑️ {selectedIds.length} Delete Karo
        </button>
      )}

      <button className="btn btn-warning" onClick={onDeleteCompleted}>
        ✅ Sab Completed Delete Karo
      </button>
    </div>
  );
}
