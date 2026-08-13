import api from './client';

export async function listMyTeams() {
  const { data } = await api.get('/api/teams');
  return data;
}

export async function getTeam(teamId) {
  const { data } = await api.get(`/api/teams/${teamId}`);
  return data;
}

export async function createTeam({ name, description }) {
  const { data } = await api.post('/api/teams', { name, description });
  return data;
}

export async function listTeamMembers(teamId) {
  const { data } = await api.get(`/api/teams/${teamId}/members`);
  return data;
}

export async function createTeamInvite(teamId) {
  const { data } = await api.post(`/api/teams/${teamId}/invites`);
  return data;
}
