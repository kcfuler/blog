const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  POSTS: `${API_BASE_URL}/api/posts`,
  POST: (id: number) => `${API_BASE_URL}/api/posts/${id}`,
} as const;
