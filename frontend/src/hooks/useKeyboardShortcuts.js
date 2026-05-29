import { useEffect } from "react";

export function useKeyboardShortcuts({ onNewTodo, onToggleDark, onCloseForm, showForm }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "n" && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onNewTodo();
      }
      if (e.key === "d" && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onToggleDark();
      }
      if (e.key === "Escape" && showForm) {
        onCloseForm();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewTodo, onToggleDark, onCloseForm, showForm]);
}
