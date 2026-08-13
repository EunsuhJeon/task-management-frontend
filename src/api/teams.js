import api from './client';

export async function listMyTeams() {
  const { data } = await api.get('/api/teams');
  return data;
}

export async function createTeam({ name, description }) {
  const { data } = await api.post('/api/teams', { name, description });
  return data;
}
