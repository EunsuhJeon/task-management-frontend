import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { KanbanColumn, TaskCard } from '../components/KanbanBoard';
import TaskFormModal from '../components/TaskFormModal';
import { createTask, deleteTask, listTasks, updateTask } from '../api/tasks';
import { createTeamInvite, getTeam, listTeamMembers } from '../api/teams';
import { collectDueAlerts } from '../utils/dueDate';
import {
  TASK_STATUSES,
  emptyTaskForm,
  formToPayload,
  taskToForm,
} from '../utils/taskForm';

export default function TeamBoardPage() {
  const { teamId } = useParams();
  const { setTeams } = useOutletContext();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyTaskForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = team?.myRole === 'ADMIN';
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [teamData, memberData, taskData] = await Promise.all([
        getTeam(teamId),
        listTeamMembers(teamId),
        listTasks(teamId),
      ]);
      setTeam(teamData);
      setMembers(memberData);
      setTasks(taskData);
      setTeams((prev) => {
        const exists = prev.some((item) => item.id === teamData.id);
        if (exists) {
          return prev.map((item) => (item.id === teamData.id ? teamData : item));
        }
        return [teamData, ...prev];
      });
    } catch (err) {
      setError(err.message);
      setTeam(null);
      setMembers([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [teamId, setTeams]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const tasksByStatus = useMemo(() => {
    const grouped = { TODO: [], DOING: [], DONE: [] };
    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      } else {
        grouped.TODO.push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const dueAlerts = useMemo(() => collectDueAlerts(tasks), [tasks]);

  function openCreateModal() {
    setModalMode('create');
    setEditingTask(null);
    setForm(emptyTaskForm());
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(task) {
    setModalMode('edit');
    setEditingTask(task);
    setForm(taskToForm(task));
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const payload = formToPayload(form);
      if (modalMode === 'create') {
        const created = await createTask(teamId, payload);
        setTasks((prev) => [created, ...prev]);
      } else {
        const updated = await updateTask(teamId, editingTask.id, payload);
        setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
        setEditingTask(updated);
      }
      if (modalMode === 'create') {
        closeModal();
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(task, nextStatus) {
    if (task.status === nextStatus) return;
    try {
      const payload = {
        title: task.title,
        description: task.description,
        status: nextStatus,
        assigneeId: task.assignee?.id ?? null,
        dueDate: task.dueDate,
      };
      const updated = await updateTask(teamId, task.id, payload);
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!isAdmin) return;
    const confirmed = window.confirm(`Delete “${task.title}”?`);
    if (!confirmed) return;
    try {
      await deleteTask(teamId, task.id);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateInvite() {
    setInviteBusy(true);
    setInviteError('');
    try {
      const invite = await createTeamInvite(teamId);
      const link = `${window.location.origin}/app/invite/${invite.token}`;
      setInviteLink(link);
      await navigator.clipboard?.writeText(link);
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviteBusy(false);
    }
  }

  function handleDragStart(event) {
    const task = event.active.data.current?.task;
    setActiveTask(task || null);
  }

  async function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    const overId = String(over.id);
    const nextStatus = TASK_STATUSES.some((status) => status.key === overId)
      ? overId
      : tasks.find((item) => String(item.id) === overId)?.status;

    if (!nextStatus || task.status === nextStatus) return;
    await handleStatusChange(task, nextStatus);
  }

  if (loading) {
    return (
      <div className="stack">
        <p className="muted">Loading board…</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="stack">
        <p className="error-text">{error || 'Team not found'}</p>
        <Link to="/app">← Back to overview</Link>
      </div>
    );
  }

  return (
    <div className="stack board-stack">
      <section className="section board-header">
        <div>
          <p className="muted">
            <Link to="/app">← Overview</Link>
          </p>
          <h1>{team.name}</h1>
          <p className="muted">{team.description || 'No description'}</p>
          <p className="small muted">
            Your role: <strong>{team.myRole}</strong> · {members.length} members
          </p>
        </div>
        <div className="board-actions">
          <button type="button" className="btn primary" onClick={openCreateModal}>
            New task
          </button>
          {isAdmin && (
            <button
              type="button"
              className="btn ghost"
              onClick={handleCreateInvite}
              disabled={inviteBusy}
            >
              {inviteBusy ? 'Creating link…' : 'Invite link'}
            </button>
          )}
        </div>
      </section>

      {dueAlerts.length > 0 && (
        <section className="panel alert-banner">
          <h2>Due alerts</h2>
          <ul className="alert-list">
            {dueAlerts.map((alert) => (
              <li key={alert.id} className={`alert-item alert-${alert.kind}`}>
                <strong>{alert.title}</strong>
                <span>{alert.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className="error-text">{error}</p>}
      {inviteError && <p className="error-text">{inviteError}</p>}
      {inviteLink && (
        <section className="panel invite-banner">
          <p>Invite link copied. Share this with teammates:</p>
          <code>{inviteLink}</code>
        </section>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section className="kanban">
          {TASK_STATUSES.map((column) => (
            <KanbanColumn
              key={column.key}
              statusKey={column.key}
              label={column.label}
              count={tasksByStatus[column.key].length}
            >
              {tasksByStatus[column.key].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasksByStatus[column.key].length === 0 && (
                <p className="muted small empty-column">Drop tasks here</p>
              )}
            </KanbanColumn>
          ))}
        </section>

        <DragOverlay>
          {activeTask ? (
            <div className="task-card drag-overlay-card">
              <strong>{activeTask.title}</strong>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <section className="panel">
        <h2>Members</h2>
        <ul className="member-list">
          {members.map((member) => (
            <li key={member.id}>
              <span>{member.user.name}</span>
              <span className="muted small">{member.user.email}</span>
              <span className="role-chip">{member.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <TaskFormModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        members={members}
        submitting={submitting}
        error={formError}
        onChange={setForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
        teamId={teamId}
        taskId={editingTask?.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
