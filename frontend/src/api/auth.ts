import client from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

export const login = async (data: LoginData) => {
  const response = await client.post('/users/token', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await client.post('/users/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/users/me');
  return response.data;
};
