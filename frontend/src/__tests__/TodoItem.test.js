import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "../components/TodoItem";

const mockTodo = {
  id: 1,
  title: "Test Todo",
  description: "Test description",
  due_date: null,
  priority: "high",
  category: "work",
  completed: false,
};

test("Todo title is visible", () => {
  render(<TodoItem todo={mockTodo} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} selected={false} onSelect={() => {}} />);
  expect(screen.getByText("Test Todo")).toBeInTheDocument();
});

test("Priority badge is visible", () => {
  render(<TodoItem todo={mockTodo} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} selected={false} onSelect={() => {}} />);
  expect(screen.getByText("high")).toBeInTheDocument();
});

test("Category badge is visible", () => {
  render(<TodoItem todo={mockTodo} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} selected={false} onSelect={() => {}} />);
  expect(screen.getByText("work")).toBeInTheDocument();
});

test("Edit button fires callback", () => {
  const onEdit = jest.fn();
  render(<TodoItem todo={mockTodo} onToggle={() => {}} onEdit={onEdit} onDelete={() => {}} selected={false} onSelect={() => {}} />);
  fireEvent.click(screen.getByTitle("Edit"));
  expect(onEdit).toHaveBeenCalledWith(mockTodo);
});

test("Delete button fires callback", () => {
  const onDelete = jest.fn();
  render(<TodoItem todo={mockTodo} onToggle={() => {}} onEdit={() => {}} onDelete={onDelete} selected={false} onSelect={() => {}} />);
  fireEvent.click(screen.getByTitle("Delete"));
  expect(onDelete).toHaveBeenCalledWith(1);
});

test("Completed todo has completed class", () => {
  const completedTodo = { ...mockTodo, completed: true };
  const { container } = render(<TodoItem todo={completedTodo} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} selected={false} onSelect={() => {}} />);
  expect(container.firstChild).toHaveClass("completed");
});
