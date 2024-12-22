import { API_ROUTES } from "../config/api";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
  };
}

export async function getPosts(): Promise<Post[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(API_ROUTES.POSTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch posts");
  }

  return response.json();
}

export async function createPost(data: {
  title: string;
  content: string;
}): Promise<Post> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(API_ROUTES.POSTS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
}

export async function getPost(id: number): Promise<Post> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(API_ROUTES.POST(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch post");
  }

  return response.json();
}
