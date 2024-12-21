import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Skeleton } from 'antd';

const { Title, Paragraph } = Typography;

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: {
    username: string;
  };
}

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch post from API
    // For now, using mock data
    setTimeout(() => {
      setPost({
        id: Number(id),
        title: "Sample Blog Post",
        content: "This is a sample blog post content...",
        created_at: new Date().toISOString(),
        author: { username: "admin" }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <Title>{post.title}</Title>
      <Paragraph>
        By {post.author.username} on {new Date(post.created_at).toLocaleDateString()}
      </Paragraph>
      <Paragraph>{post.content}</Paragraph>
    </div>
  );
};

export default BlogPost;
