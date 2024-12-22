import { API_ROUTES } from "../config/api";

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await fetch(API_ROUTES.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}
