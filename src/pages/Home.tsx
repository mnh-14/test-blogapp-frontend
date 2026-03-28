import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]); // Re-fetch when user changes to get correct vote status

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading posts...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>
      <CreatePost onPostCreated={fetchPosts} />
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No posts yet. Be the first to post!</p>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
