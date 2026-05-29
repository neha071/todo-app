import { render, screen } from '@testing-library/react';
import App from './App';

test('App header is visible', () => {
  render(<App />);
  expect(screen.getByText('📝 Todo Manager')).toBeInTheDocument();
});

test('New Todo button is visible', () => {
  render(<App />);
  expect(screen.getByText('+ New Todo')).toBeInTheDocument();
});
