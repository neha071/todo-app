import { useEffect } from "react";

export function useKeyboardShortcuts({ onNewTodo, onToggleDark, onFocusSearch, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        if (e.key === "Escape") onClose?.();
        return;
      }
      if (e.key === "n" || e.key === "N") onNewTodo?.();
      if (e.key === "d" || e.key === "D") onToggleDark?.();
      if (e.key === "/") { e.preventDefault(); onFocusSearch?.(); }
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNewTodo, onToggleDark, onFocusSearch, onClose]);
}
