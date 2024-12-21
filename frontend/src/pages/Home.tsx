import { useEffect, useState } from 'react';
import { Card, List, Typography, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, Post } from '../api/posts';

const { Title } = Typography;

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error: any) {
        message.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={2}>Latest Posts</Title>
        <Button type="primary" onClick={() => navigate('/create-post')}>
          Create New Post
        </Button>
      </div>
      
      <List
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Link to={`/post/${post.id}`}>
              <Card 
                title={post.title}
                extra={`By ${post.author.username}`}
              >
                <p>{post.content.substring(0, 200)}...</p>
                <p style={{ color: '#888' }}>
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
