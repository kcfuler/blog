import client from './client';

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
}

export interface CreatePostData {
  title: string;
  content: string;
}

export const getPosts = async (skip = 0, limit = 10) => {
  const response = await client.get(`/posts?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getPost = async (id: number) => {
  const response = await client.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data: CreatePostData) => {
  const response = await client.post('/posts', data);
  return response.data;
};

export const updatePost = async (id: number, data: CreatePostData) => {
  const response = await client.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: number) => {
  await client.delete(`/posts/${id}`);
};
