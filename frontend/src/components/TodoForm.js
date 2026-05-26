import { useState, useEffect } from "react";

const CATEGORIES = ["work", "personal", "shopping", "health", "finance", "other"];
const PRIORITIES = ["low", "medium", "high"];

export default function TodoForm({ onSubmit, editData, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    category: "personal",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        due_date: editData.due_date || "",
        priority: editData.priority || "medium",
        category: editData.category || "personal",
      });
    }
  }, [editData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title zaroori hai";
    if (form.title.trim().length < 2) errs.title = "Title kam se kam 2 characters ka hona chahiye";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSubmit(form);
      setForm({ title: "", description: "", due_date: "", priority: "medium", category: "personal" });
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || "Kuch galat hua" });
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>{editData ? "Todo Edit Karo" : "Naya Todo Banao"}</h2>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          placeholder="Kya karna hai?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Thodi detail likhو (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.submit && <span className="error">{errors.submit}</span>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editData ? "Update Karo" : "Add Karo"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
