import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { useState } from 'react';

export default function PostCard({ post: initialPost }: { post: any }) {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (value: number) => {
    if (!user) {
      alert("Please login to vote");
      return;
    }
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const updatedPost = await api.votePost(post.id, value);
      setPost(updatedPost);
    } catch (error) {
      console.error("Failed to vote", error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex gap-4">
      <div className="flex flex-col items-center gap-1 pt-1">
        <button 
          onClick={() => handleVote(1)}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${post.user_vote === 1 ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <ArrowBigUp className="w-6 h-6" fill={post.user_vote === 1 ? 'currentColor' : 'none'} />
        </button>
        <span className="font-medium text-sm text-gray-700">{post.upvotes - post.downvotes}</span>
        <button 
          onClick={() => handleVote(-1)}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${post.user_vote === -1 ? 'text-indigo-500' : 'text-gray-400'}`}
        >
          <ArrowBigDown className="w-6 h-6" fill={post.user_vote === -1 ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/profile/${post.owner.id}`} className="font-semibold text-gray-900 hover:underline">
            {post.owner.full_name || post.owner.username}
          </Link>
          <span className="text-gray-500 text-sm">@{post.owner.username}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(post.created_at)}
          </span>
        </div>
        
        <p className="text-gray-800 whitespace-pre-wrap text-lg">{post.content}</p>
      </div>
    </div>
  );
}
