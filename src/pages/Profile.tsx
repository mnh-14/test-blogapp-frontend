import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import PostCard from '../components/PostCard';
import { User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [userData, userPosts] = await Promise.all([
          api.getUser(parseInt(id)),
          api.getUserPosts(parseInt(id))
        ]);
        setProfileUser(userData);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="text-center py-10 text-gray-500">User not found</div>;
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
          <UserIcon className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profileUser.full_name || profileUser.username}</h1>
          <p className="text-gray-500 text-lg">@{profileUser.username}</p>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{posts.length}</span> posts
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">This user hasn't posted anything yet.</p>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
