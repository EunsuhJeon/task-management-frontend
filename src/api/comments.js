import api from './client';

export async function listComments(teamId, taskId) {
  const { data } = await api.get(`/api/teams/${teamId}/tasks/${taskId}/comments`);
  return data;
}

export async function createComment(teamId, taskId, content) {
  const { data } = await api.post(`/api/teams/${teamId}/tasks/${taskId}/comments`, { content });
  return data;
}

export async function deleteComment(teamId, taskId, commentId) {
  await api.delete(`/api/teams/${teamId}/tasks/${taskId}/comments/${commentId}`);
}
