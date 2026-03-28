import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Search as SearchIcon, User as UserIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const data = await api.searchUsers(query);
          setResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(searchTimer);
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find People</h1>
      
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
        />
      </div>

      {isSearching && <div className="text-center text-gray-500">Searching...</div>}
      
      {!isSearching && query.trim().length >= 2 && results.length === 0 && (
        <div className="text-center text-gray-500 py-10">No users found matching "{query}"</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map(user => (
          <Link 
            key={user.id} 
            to={`/profile/${user.id}`}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-indigo-300 transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user.full_name || user.username}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
