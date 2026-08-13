import api, { setToken } from './client';

export async function signup({ email, password, name }) {
  const { data } = await api.post('/api/auth/signup', { email, password, name });
  setToken(data.accessToken);
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  setToken(data.accessToken);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/api/users/me');
  return data;
}

export async function updateMe({ name }) {
  const { data } = await api.put('/api/users/me', { name });
  return data;
}
