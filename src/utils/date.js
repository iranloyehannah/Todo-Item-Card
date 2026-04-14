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

export function isOverdue(dueDate, now, completed = false) {
  if (completed) {
    return false;
  }

  return new Date(dueDate).getTime() < now;
}

export function formatTimeRemaining(dueDate, now, completed = false) {
  if (completed) {
    return 'Completed';
  }

  const diff = new Date(dueDate).getTime() - now;
  const abs = Math.abs(diff);

  if (abs < 60 * 1000) {
    return diff >= 0 ? 'Due in less than a minute' : 'Overdue by less than a minute';
  }

  for (const { unit, ms } of TIME_UNITS) {
    if (abs >= ms || unit === 'minute') {
      const rounded = Math.max(1, Math.floor(abs / ms));
      const phrase = pluralize(rounded, unit);
      return diff >= 0 ? `Due in ${phrase}` : `Overdue by ${phrase}`;
    }
  }

  return diff >= 0 ? 'Due in less than a minute' : 'Overdue by less than a minute';
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
  if (task.status === 'Done' || task.completed) {
    return { label: 'Done', tone: 'done' };
  }

  if (task.status === 'In Progress') {
    return { label: 'In Progress', tone: 'progress' };
  }

  if (isOverdue(task.dueDate, now, false)) {
    return { label: 'Pending', tone: 'alert' };
  }

  return { label: 'Pending', tone: 'calm' };
}
