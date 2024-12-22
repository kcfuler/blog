import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { API_ROUTES } from "../../config/api";

interface Post {
  ID: number;
  title: string;
  content: string;
  CreatedAt: string;
  user?: {
    username: string;
  };
}

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (!id || isNaN(Number(id))) {
        throw new Error("Invalid post ID");
      }

      const response = await fetch(`${API_ROUTES.POSTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPost(data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load post. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="flex flex-col items-center py-8">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-muted-foreground animate-spin dark:text-gray-600 fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="mt-2 text-muted-foreground">Loading post...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="inline-block rounded-lg bg-destructive/10 px-4 py-2 text-destructive dark:bg-destructive/20">
            {error}
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <div className="text-center py-8">
          <div className="inline-block rounded-lg bg-destructive/10 px-4 py-2 text-destructive dark:bg-destructive/20">
            Post not found
          </div>
        </div>
      );
    }

    return (
      <>
        <h1 className="mb-4">{post.title}</h1>
        <div className="meta text-sm text-muted-foreground mb-8">
          <span>By {post.user?.username || "Unknown"}</span>
          <span> • </span>
          <time>{new Date(post.CreatedAt).toLocaleDateString()}</time>
        </div>
        <div className="content prose dark:prose-invert">{post.content}</div>
      </>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <a href="/">
            <Button variant="outline">Back to Posts</Button>
          </a>
        </div>
        <article className="prose prose-slate dark:prose-invert lg:prose-lg">
          {renderContent()}
        </article>
      </div>
    </div>
  );
}
