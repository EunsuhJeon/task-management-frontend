function toDateOnly(value) {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getDueState(dueDate, status) {
  if (!dueDate || status === 'DONE') {
    return { kind: 'none', label: null };
  }

  const due = toDateOnly(dueDate);
  const today = toDateOnly(new Date());
  if (!due || !today) {
    return { kind: 'none', label: null };
  }

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return { kind: 'overdue', label: `Overdue ${Math.abs(diffDays)}d` };
  }
  if (diffDays === 0) {
    return { kind: 'today', label: 'Due today' };
  }
  if (diffDays === 1) {
    return { kind: 'soon', label: 'Due tomorrow' };
  }
  return { kind: 'upcoming', label: `Due ${dueDate}` };
}

export function collectDueAlerts(tasks) {
  return tasks
    .map((task) => {
      const state = getDueState(task.dueDate, task.status);
      if (state.kind !== 'overdue' && state.kind !== 'today' && state.kind !== 'soon') {
        return null;
      }
      return {
        id: task.id,
        title: task.title,
        kind: state.kind,
        label: state.label,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const rank = { overdue: 0, today: 1, soon: 2 };
      return rank[a.kind] - rank[b.kind];
    });
}
