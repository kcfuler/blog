import { API_ROUTES } from "../config/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch(API_ROUTES.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}
