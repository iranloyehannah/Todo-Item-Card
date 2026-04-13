import { useEffect, useState } from 'react';
import {
  formatDueDateLabel,
  formatTimeRemaining,
  getPriorityTone,
  getStatusMeta,
} from './utils/date';

const initialTask = {
  id: 'launch-checklist',
  title: 'Finish product design for the upcoming release',
  description:
    'Refine the final UI screens, review interaction details, and prepare the handoff assets needed for development.',
  priority: 'High',
  dueDate: '2026-04-16T23:59:00+01:00',
  completed: false,
  tags: ['Design', 'Handoff', 'Release'],
};

function TodoCard({ task, now, onToggle }) {
  const status = getStatusMeta(task, now);

  return (
    <article
      className="todo-card"
      data-testid="test-todo-card"
      aria-labelledby={`todo-title-${task.id}`}
    >
      <div className="card-glow" aria-hidden="true" />

      <header className="card-header">
        <label className="checkbox-wrap">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
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

      <p className="card-description" data-testid="test-todo-description">
        {task.description}
      </p>

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

        <div className="button-row">
          <button
            type="button"
            className="ghost-button"
            data-testid="test-todo-edit-button"
            onClick={() => console.log('edit clicked')}
          >
            Edit
          </button>
          <button
            type="button"
            className="ghost-button ghost-button-danger"
            data-testid="test-todo-delete-button"
            onClick={() => window.alert('Delete clicked')}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [task, setTask] = useState(initialTask);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Daily Focus</p>
        <h1>Keep today in motion</h1>
        <p className="hero-copy">
          A focused task card with live timing, clear structure, and a more polished
          feel than the usual todo UI.
        </p>
      </section>

      <TodoCard
        task={task}
        now={now}
        onToggle={() => setTask((current) => ({ ...current, completed: !current.completed }))}
      />
    </main>
  );
}

export default App;
