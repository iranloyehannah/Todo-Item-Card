import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('Todo card', () => {
  it('renders the required testing hooks and toggles completion state', () => {
    render(<App />);

    expect(screen.getByTestId('test-todo-card')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-title')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-description')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-priority')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-due-date')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-time-remaining')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-status')).toHaveTextContent(/pending|in progress|done/i);
    expect(screen.getByTestId('test-todo-tags')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-delete-button')).toBeInTheDocument();

    const checkbox = screen.getByTestId('test-todo-complete-toggle');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByTestId('test-todo-status')).toHaveTextContent(/done/i);
    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent(/done/i);
  });
});
