export function exportToCSV(todos) {
  const headers = ["Title", "Description", "Priority", "Category", "Due Date", "Status"];

  const rows = todos.map((t) => [
    `"${t.title}"`,
    `"${t.description || ""}"`,
    t.priority,
    t.category,
    t.due_date || "",
    t.completed ? "Completed" : "Active",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `todos-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
