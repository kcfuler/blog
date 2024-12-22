import type { APIRoute } from "astro";
import { login } from "../../api/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const response = await login(data);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Login failed",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
