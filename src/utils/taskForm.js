export const TASK_STATUSES = [
  { key: 'TODO', label: 'To do' },
  { key: 'DOING', label: 'Doing' },
  { key: 'DONE', label: 'Done' },
];

export function emptyTaskForm() {
  return {
    title: '',
    description: '',
    status: 'TODO',
    assigneeId: '',
    dueDate: '',
  };
}

export function taskToForm(task) {
  return {
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'TODO',
    assigneeId: task.assignee?.id ? String(task.assignee.id) : '',
    dueDate: task.dueDate || '',
  };
}

export function formToPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    status: form.status,
    assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
    dueDate: form.dueDate || null,
  };
}
