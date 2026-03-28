// Use the placeholder that will be replaced by the Docker entrypoint script at runtime
// If not replaced (e.g., local dev), fallback to localhost
const injectedUrl = '__VITE_BACKEND_URL_PLACEHOLDER__';
const API_URL = injectedUrl.startsWith('__') 
  ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  : injectedUrl;

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'API request failed');
    }

    return response.json();
  },

  // Auth
  login: async (data: any) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },
  
  register: (data: any) => api.request('/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: (token: string) => api.request('/users/me', { headers: { Authorization: `Bearer ${token}` } }),

  // Users
  searchUsers: (query: string) => api.request(`/users/search?q=${encodeURIComponent(query)}`),
  getUser: (id: number) => api.request(`/users/${id}`),
  getUserPosts: (id: number) => api.request(`/users/${id}/posts`),

  // Posts
  getPosts: () => api.request('/posts'),
  createPost: (content: string) => api.request('/posts', { method: 'POST', body: JSON.stringify({ content }) }),
  votePost: (id: number, value: number) => api.request(`/posts/${id}/vote`, { method: 'POST', body: JSON.stringify({ value }) }),
};
