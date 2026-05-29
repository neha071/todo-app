import { render, screen, fireEvent } from "@testing-library/react";
import TodoForm from "../components/TodoForm";

test("TodoForm renders on screen", () => {
  render(<TodoForm onSubmit={() => {}} />);
  expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
});

test("Empty submit shows validation error", async () => {
  render(<TodoForm onSubmit={() => {}} />);
  fireEvent.click(screen.getByText("Add Todo"));
  expect(await screen.findByText("Title must be at least 2 characters")).toBeInTheDocument();
});

test("Submit button exists", () => {
  render(<TodoForm onSubmit={() => {}} />);
  expect(screen.getByText("Add Todo")).toBeInTheDocument();
});

test("Edit mode shows Update button", () => {
  const editData = { title: "Test", description: "", due_date: "", priority: "medium", category: "personal" };
  render(<TodoForm onSubmit={() => {}} editData={editData} />);
  expect(screen.getByText("Update")).toBeInTheDocument();
});
