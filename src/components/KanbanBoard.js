import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TASK_STATUSES } from '../utils/taskForm';
import { getDueState } from '../utils/dueDate';

export function KanbanColumn({ statusKey, label, count, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: statusKey });

  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? 'is-over' : ''}`}>
      <div className="kanban-column-header">
        <h2>{label}</h2>
        <span className="count-chip">{count}</span>
      </div>
      <div className="kanban-list">{children}</div>
    </div>
  );
}

export function TaskCard({ task, isAdmin, onEdit, onDelete, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    data: { task },
  });
  const due = getDueState(task.dueDate, task.status);

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <article ref={setNodeRef} style={style} className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <button type="button" className="drag-handle" {...listeners} {...attributes} aria-label="Drag task">
        ⋮⋮
      </button>

      <button type="button" className="task-card-main" onClick={() => onEdit(task)}>
        <div className="task-title-row">
          <strong>{task.title}</strong>
          {due.kind !== 'none' && (
            <span className={`due-badge due-${due.kind}`}>{due.label}</span>
          )}
        </div>
        {task.description && <p className="muted small">{task.description}</p>}
        <div className="task-meta">
          <span>{task.assignee?.name || 'Unassigned'}</span>
          {task.dueDate && <span>{task.dueDate}</span>}
        </div>
      </button>

      <div className="task-card-footer">
        <label className="status-select">
          <span className="sr-only">Move status</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        {isAdmin && (
          <button type="button" className="btn danger compact" onClick={() => onDelete(task)}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
