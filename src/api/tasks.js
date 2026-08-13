import api from './client';

export async function listTasks(teamId) {
  const { data } = await api.get(`/api/teams/${teamId}/tasks`);
  return data;
}

export async function createTask(teamId, payload) {
  const { data } = await api.post(`/api/teams/${teamId}/tasks`, payload);
  return data;
}

export async function updateTask(teamId, taskId, payload) {
  const { data } = await api.put(`/api/teams/${teamId}/tasks/${taskId}`, payload);
  return data;
}

export async function deleteTask(teamId, taskId) {
  await api.delete(`/api/teams/${teamId}/tasks/${taskId}`);
}
