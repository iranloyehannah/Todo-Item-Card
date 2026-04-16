import { useEffect, useId, useRef, useState } from 'react';
import {
  formatDueDateLabel,
  formatTimeRemaining,
  getPriorityTone,
  getStatusMeta,
  isOverdue,
} from './utils/date';

const DESCRIPTION_COLLAPSE_THRESHOLD = 160;

const initialTask = {
  id: 'launch-checklist',
  title: 'Finish product design for the upcoming release',
  description:
    'Refine the final UI screens, review interaction details, prepare the handoff assets needed for development, confirm empty states, document edge cases for engineering, and package the final review deck before the release checkpoint.',
  priority: 'High',
  status: 'Pending',
  dueDate: '2026-04-16T22:59:00.000Z',
  completed: false,
  tags: ['Design', 'Handoff', 'Release', 'Review'],
};

function syncTaskState(task) {
  const completed = task.status === 'Done';

  return {
    ...task,
    completed,
  };
}

function createDraft(task) {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: toDateTimeLocalValue(task.dueDate),
  };
}

function toDateTimeLocalValue(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value, fallback) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function shouldStartCollapsed(description) {
  return description.length > DESCRIPTION_COLLAPSE_THRESHOLD;
}

function TodoCard({ task, now, onToggleComplete, onStatusChange, onSave, onDelete }) {
  const status = getStatusMeta(task, now);
  const overdue = isOverdue(task.dueDate, now, task.completed);
  const isLongDescription = shouldStartCollapsed(task.description);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isLongDescription ? false : true);
  const [draft, setDraft] = useState(() => createDraft(task));
  const editButtonRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionId = useId();

  useEffect(() => {
    setDraft(createDraft(task));
    setIsExpanded((current) => {
      if (!shouldStartCollapsed(task.description)) {
        return true;
      }

      return current;
    });
  }, [task]);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  function handleEditOpen() {
    setDraft(createDraft(task));
    setIsEditing(true);
  }

  function closeEditMode() {
    setIsEditing(false);
    window.setTimeout(() => {
      editButtonRef.current?.focus();
    }, 0);
  }

  function handleCancel() {
    setDraft(createDraft(task));
    closeEditMode();
  }

  function handleSave(event) {
    event.preventDefault();

    const nextTask = {
      ...task,
      title: draft.title.trim() || task.title,
      description: draft.description.trim() || task.description,
      priority: draft.priority,
      dueDate: fromDateTimeLocalValue(draft.dueDate, task.dueDate),
    };

    onSave(nextTask);
    setIsExpanded(!shouldStartCollapsed(nextTask.description));
    closeEditMode();
  }

  return (
    <article
      className={[
        'todo-card',
        `state-${status.tone}`,
        task.completed ? 'is-complete' : '',
        overdue ? 'is-overdue' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="test-todo-card"
      aria-labelledby={`todo-title-${task.id}`}
    >
      <div className="card-glow" aria-hidden="true" />
      <span
        className={`priority-indicator priority-${getPriorityTone(task.priority)}`}
        data-testid="test-todo-priority-indicator"
        aria-hidden="true"
      />

      <header className="card-header">
        <label className="checkbox-wrap">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggleComplete}
            data-testid="test-todo-complete-toggle"
            aria-label={`Mark "${task.title}" as complete`}
          />
          <span className="checkbox-ui" aria-hidden="true" />
        </label>

        <div className="title-block">
          <p className="micro-label">Today&apos;s priority</p>
          <h2
            id={`todo-title-${task.id}`}
            data-testid="test-todo-title"
            className={task.completed ? 'todo-title is-complete' : 'todo-title'}
          >
            {task.title}
          </h2>
        </div>

        <div className="header-actions">
          <span
            className={`badge badge-priority badge-${getPriorityTone(task.priority)}`}
            data-testid="test-todo-priority"
          >
            {task.priority} Priority
          </span>
          <span
            className={`badge badge-status badge-status-${status.tone}`}
            data-testid="test-todo-status"
            aria-label={`Task status: ${status.label}`}
          >
            {status.label}
          </span>
        </div>
      </header>

      <div className="card-controls">
        <label className="field-shell compact-field">
          <span className="field-label">Status</span>
          <select
            className="control-input"
            value={task.status}
            onChange={(event) => onStatusChange(event.target.value)}
            data-testid="test-todo-status-control"
            aria-label="Task status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <button
          type="button"
          className="ghost-button"
          data-testid="test-todo-expand-toggle"
          aria-expanded={isExpanded}
          aria-controls={descriptionId}
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Collapse details' : 'Expand details'}
        </button>

        <button
          type="button"
          className="ghost-button"
          data-testid="test-todo-edit-button"
          onClick={handleEditOpen}
          ref={editButtonRef}
        >
          Edit
        </button>

        <button
          type="button"
          className="ghost-button ghost-button-danger"
          data-testid="test-todo-delete-button"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      <div
        id={descriptionId}
        className={['collapsible-section', isExpanded ? 'is-open' : 'is-collapsed'].join(' ')}
        data-testid="test-todo-collapsible-section"
      >
        <p className="card-description" data-testid="test-todo-description">
          {task.description}
        </p>
      </div>

      <div className="card-meta">
        <div className="meta-block">
          <span className="meta-label">Deadline</span>
          <time
            className="meta-value"
            dateTime={task.dueDate}
            data-testid="test-todo-due-date"
          >
            {formatDueDateLabel(task.dueDate)}
          </time>
        </div>

        <div className="meta-block">
          <span className="meta-label">Time remaining</span>
          <time
            className="meta-value"
            dateTime={task.dueDate}
            data-testid="test-todo-time-remaining"
            aria-live="polite"
          >
            {formatTimeRemaining(task.dueDate, now, task.completed)}
          </time>
        </div>

        <div className="meta-block">
          <span className="meta-label">Schedule state</span>
          <span
            className={`meta-value overdue-indicator ${overdue ? 'is-active' : ''}`}
            data-testid="test-todo-overdue-indicator"
          >
            {task.completed ? 'Completed' : overdue ? 'Overdue' : 'On track'}
          </span>
        </div>
      </div>

      <div className="card-footer">
        <ul
          className="tag-list"
          role="list"
          data-testid="test-todo-tags"
          aria-label="Task categories"
        >
          {task.tags.map((tag) => (
            <li
              key={tag}
              className="tag-chip"
              data-testid={`test-todo-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {isEditing ? (
        <form className="edit-form" data-testid="test-todo-edit-form" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="field-shell field-span-full">
              <label className="field-label" htmlFor={`todo-edit-title-${task.id}`}>
                Title
              </label>
              <input
                id={`todo-edit-title-${task.id}`}
                ref={titleInputRef}
                className="control-input"
                type="text"
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                data-testid="test-todo-edit-title-input"
              />
            </div>

            <div className="field-shell field-span-full">
              <label className="field-label" htmlFor={`todo-edit-description-${task.id}`}>
                Description
              </label>
              <textarea
                id={`todo-edit-description-${task.id}`}
                className="control-input control-textarea"
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                data-testid="test-todo-edit-description-input"
                rows="5"
              />
            </div>

            <div className="field-shell">
              <label className="field-label" htmlFor={`todo-edit-priority-${task.id}`}>
                Priority
              </label>
              <select
                id={`todo-edit-priority-${task.id}`}
                className="control-input"
                value={draft.priority}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, priority: event.target.value }))
                }
                data-testid="test-todo-edit-priority-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="field-shell">
              <label className="field-label" htmlFor={`todo-edit-date-${task.id}`}>
                Due date
              </label>
              <input
                id={`todo-edit-date-${task.id}`}
                className="control-input"
                type="datetime-local"
                value={draft.dueDate}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, dueDate: event.target.value }))
                }
                data-testid="test-todo-edit-due-date-input"
              />
            </div>
          </div>

          <div className="button-row edit-actions">
            <button type="submit" className="ghost-button" data-testid="test-todo-save-button">
              Save
            </button>
            <button
              type="button"
              className="ghost-button ghost-button-danger"
              data-testid="test-todo-cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

function App() {
  const [task, setTask] = useState(() => syncTaskState(initialTask));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (task.completed) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, [task.completed]);

  function handleToggleComplete() {
    setTask((current) =>
      syncTaskState({
        ...current,
        status: current.completed ? 'Pending' : 'Done',
      }),
    );
  }

  function handleStatusChange(nextStatus) {
    setTask((current) => syncTaskState({ ...current, status: nextStatus }));
  }

  function handleSave(nextTask) {
    setTask(syncTaskState(nextTask));
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Daily Focus</p>
        <h1>Keep today in motion</h1>
        <p className="hero-copy">
          A focused task card with live timing, editable detail, and clearer state
          transitions than the usual todo UI.
        </p>
      </section>

      <TodoCard
        task={task}
        now={now}
        onToggleComplete={handleToggleComplete}
        onStatusChange={handleStatusChange}
        onSave={handleSave}
        onDelete={() => window.alert('Delete clicked')}
      />
    </main>
  );
}

export default App;
