const dueDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const TIME_UNITS = [
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
];

export function formatDueDateLabel(dueDate) {
  return `Due ${dueDateFormatter.format(new Date(dueDate))}`;
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

export function formatTimeRemaining(dueDate, now, completed = false) {
  if (completed) {
    return 'Done';
  }

  const diff = new Date(dueDate).getTime() - now;
  const abs = Math.abs(diff);

  if (abs < 60 * 1000) {
    return diff >= 0 ? 'Due now!' : 'Overdue by less than a minute';
  }

  for (const { unit, ms } of TIME_UNITS) {
    if (abs >= ms || unit === 'minute') {
      const rounded = Math.max(1, Math.round(abs / ms));
      const phrase = pluralize(rounded, unit);
      return diff >= 0 ? `Due in ${phrase}` : `Overdue by ${phrase}`;
    }
  }

  return diff >= 0 ? 'Due now!' : 'Overdue by less than a minute';
}

export function getPriorityTone(priority) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
}

export function getStatusMeta(task, now) {
  if (task.completed) {
    return { label: 'Done', tone: 'done' };
  }

  const diff = new Date(task.dueDate).getTime() - now;

  if (diff < 0) {
    return { label: 'Pending', tone: 'alert' };
  }

  if (diff <= 24 * 60 * 60 * 1000) {
    return { label: 'In Progress', tone: 'warning' };
  }

  return { label: 'Pending', tone: 'calm' };
}
