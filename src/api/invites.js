import api from './client';

export async function acceptInvite(token) {
  const { data } = await api.post(`/api/invites/${token}/accept`);
  return data;
}

export async function acceptInviteBody(token) {
  const { data } = await api.post('/api/invites/accept', { token });
  return data;
}
