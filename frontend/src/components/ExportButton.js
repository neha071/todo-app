import * as XLSX from "xlsx";
import { getSubtasks } from "../api/todos";

export default function ExportButton({ todos }) {
  const handleExport = async () => {
    if (todos.length === 0) return alert("No todos to export!");

    const rows = [];

    for (const t of todos) {
      rows.push({
        Type: "Todo",
        Title: t.title,
        Description: t.description || "",
        Priority: t.priority,
        Category: t.category,
        "Due Date": t.due_date || "",
        Status: t.completed ? "Completed" : "Active",
        "Parent Todo": "",
      });

      try {
        const res = await getSubtasks(t.id);
        for (const s of res.data) {
          rows.push({
            Type: "Subtask",
            Title: s.title,
            Description: "",
            Priority: "",
            Category: "",
            "Due Date": "",
            Status: s.completed ? "Completed" : "Active",
            "Parent Todo": t.title,
          });
        }
      } catch {
        // no subtasks
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Todos");
    XLSX.writeFile(wb, `todos-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button className="btn btn-secondary" onClick={handleExport} title="Export todos as Excel">
      📥 Export Excel
    </button>
  );
}
