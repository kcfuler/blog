import { useEffect, useState } from "react";
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

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(API_ROUTES.POSTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error instanceof Error ? error.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  function renderContent() {
    if (!isLoggedIn) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">Please login to view posts</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="col-span-full text-center py-8">
          <div role="status" className="flex flex-col items-center">
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
            <span className="mt-2 text-muted-foreground">Loading posts...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <div className="inline-block rounded-lg bg-destructive/10 px-4 py-2 text-destructive dark:bg-destructive/20">
            {error}
          </div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">
            No posts yet. Be the first to create one!
          </p>
        </div>
      );
    }

    return posts.map((post) => (
      <article
        key={post.ID}
        className="group relative rounded-lg border p-6 space-y-4 bg-card text-card-foreground hover:bg-accent/50 transition-colors"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            <a href={`/posts/${post.ID}`} className="hover:underline">
              {post.title}
            </a>
          </h2>
          <div className="text-sm text-muted-foreground">
            <span>By {post.user?.username || "Unknown"}</span>
            <span> • </span>
            <time>{new Date(post.CreatedAt).toLocaleDateString()}</time>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        <a
          href={`/posts/${post.ID}`}
          className="absolute inset-0 rounded-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="sr-only">View post: {post.title}</span>
        </a>
      </article>
    ));
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <a href="/create-post">
              <Button>Create Post</Button>
            </a>
          ) : (
            <a href="/login">
              <Button variant="outline">Login</Button>
            </a>
          )}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {renderContent()}
      </div>
    </div>
  );
}
