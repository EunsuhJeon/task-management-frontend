import { TASK_STATUSES } from '../utils/taskForm';
import TaskComments from './TaskComments';

export default function TaskFormModal({
  open,
  mode,
  form,
  members,
  submitting,
  error,
  onChange,
  onClose,
  onSubmit,
  teamId,
  taskId,
  isAdmin,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-panel wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="task-modal-title">{mode === 'edit' ? 'Edit task' : 'New task'}</h2>
          <button type="button" className="btn ghost compact" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              required
              maxLength={200}
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              maxLength={2000}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => onChange({ ...form, status: e.target.value })}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Assignee
              <select
                value={form.assigneeId}
                onChange={(e) => onChange({ ...form, assigneeId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Due date
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create task'}
          </button>
        </form>

        {mode === 'edit' && taskId && (
          <TaskComments teamId={teamId} taskId={taskId} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
}
