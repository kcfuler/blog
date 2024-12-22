import type { APIRoute } from "astro";
import { API_ROUTES } from "../../../config/api";

export const GET: APIRoute = async ({ request, params }) => {
  const token = request.headers.get("Authorization");
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(API_ROUTES.POST(Number(params.id)), {
      headers: { Authorization: token },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
