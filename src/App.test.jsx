import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Todo card', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-14T12:00:00.000Z'));
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders required Stage 0 and Stage 1 hooks and keeps collapse accessible', () => {
    render(<App />);

    expect(screen.getByTestId('test-todo-card')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-title')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-description')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-priority')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-priority-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-due-date')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent(/due in/i);
    expect(screen.getByTestId('test-todo-status')).toHaveTextContent(/pending/i);
    expect(screen.getByTestId('test-todo-status-control')).toHaveValue('Pending');
    expect(screen.getByTestId('test-todo-overdue-indicator')).toHaveTextContent(/on track/i);
    expect(screen.getByTestId('test-todo-tags')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-delete-button')).toBeInTheDocument();

    const expandToggle = screen.getByTestId('test-todo-expand-toggle');
    const collapsible = screen.getByTestId('test-todo-collapsible-section');

    expect(expandToggle).toHaveAttribute('aria-expanded', 'false');
    expect(expandToggle).toHaveAttribute('aria-controls', collapsible.id);

    fireEvent.click(expandToggle);

    expect(expandToggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps checkbox and status control synchronized', () => {
    render(<App />);

    const checkbox = screen.getByTestId('test-todo-complete-toggle');
    const statusControl = screen.getByTestId('test-todo-status-control');
    const statusBadge = screen.getByTestId('test-todo-status');
    const timeRemaining = screen.getByTestId('test-todo-time-remaining');

    expect(checkbox).not.toBeChecked();

    fireEvent.change(statusControl, { target: { value: 'Done' } });

    expect(checkbox).toBeChecked();
    expect(statusBadge).toHaveTextContent(/done/i);
    expect(timeRemaining).toHaveTextContent(/completed/i);

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(statusControl).toHaveValue('Pending');
    expect(statusBadge).toHaveTextContent(/pending/i);

    fireEvent.change(statusControl, { target: { value: 'In Progress' } });

    expect(checkbox).not.toBeChecked();
    expect(statusBadge).toHaveTextContent(/in progress/i);
  });

  it('supports editing and cancel restores the previous values', () => {
    render(<App />);

    const editButton = screen.getByTestId('test-todo-edit-button');
    const originalTitle = screen.getByTestId('test-todo-title').textContent;

    fireEvent.click(editButton);

    expect(screen.getByTestId('test-todo-edit-form')).toBeInTheDocument();
    expect(screen.getByTestId('test-todo-edit-title-input')).toHaveFocus();

    fireEvent.change(screen.getByTestId('test-todo-edit-title-input'), {
      target: { value: 'Updated launch checklist' },
    });
    fireEvent.change(screen.getByTestId('test-todo-edit-description-input'), {
      target: { value: 'Short replacement description.' },
    });
    fireEvent.change(screen.getByTestId('test-todo-edit-priority-select'), {
      target: { value: 'Low' },
    });
    fireEvent.click(screen.getByTestId('test-todo-cancel-button'));
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.queryByTestId('test-todo-edit-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-todo-title')).toHaveTextContent(originalTitle);
    expect(editButton).toHaveFocus();

    fireEvent.click(editButton);
    fireEvent.change(screen.getByTestId('test-todo-edit-title-input'), {
      target: { value: 'Updated launch checklist' },
    });
    fireEvent.change(screen.getByTestId('test-todo-edit-description-input'), {
      target: { value: 'Short replacement description.' },
    });
    fireEvent.change(screen.getByTestId('test-todo-edit-priority-select'), {
      target: { value: 'Low' },
    });
    fireEvent.change(screen.getByTestId('test-todo-edit-due-date-input'), {
      target: { value: '2026-04-12T10:30' },
    });
    fireEvent.click(screen.getByTestId('test-todo-save-button'));
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.queryByTestId('test-todo-edit-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-todo-title')).toHaveTextContent('Updated launch checklist');
    expect(screen.getByTestId('test-todo-priority')).toHaveTextContent(/low priority/i);
    expect(screen.getByTestId('test-todo-description')).toHaveTextContent(
      'Short replacement description.',
    );
    expect(screen.getByTestId('test-todo-overdue-indicator')).toHaveTextContent(/overdue/i);
    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent(/overdue by/i);
    expect(screen.getByTestId('test-todo-expand-toggle')).toHaveAttribute('aria-expanded', 'true');
    expect(editButton).toHaveFocus();
  });

  it('updates relative time on the interval until the task is done', () => {
    render(<App />);

    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent('Due in 2 days');

    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });

    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent('Due in 2 days');

    fireEvent.change(screen.getByTestId('test-todo-status-control'), {
      target: { value: 'Done' },
    });

    act(() => {
      vi.advanceTimersByTime(60 * 60 * 1000);
    });

    expect(screen.getByTestId('test-todo-time-remaining')).toHaveTextContent('Completed');
    expect(screen.getByTestId('test-todo-overdue-indicator')).toHaveTextContent(/completed/i);
  });
});
