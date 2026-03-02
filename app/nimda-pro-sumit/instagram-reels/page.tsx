'use client';

import { useState, useEffect } from 'react';

interface InstagramReel {
  id: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  username: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  addedAt: string;
  status: 'active' | 'archived';
}

export default function InstagramReelsPage() {
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    instagramUrl: '',
    thumbnailUrl: '',
    username: '',
  });

  useEffect(() => {
    // Mock data
    setReels([
      {
        id: '1',
        title: 'Keychron K2 Unboxing',
        instagramUrl: 'https://www.instagram.com/reel/ABC123/',
        thumbnailUrl: 'https://via.placeholder.com/300x400',
        username: '@jiocoder',
        views: 15230,
        likes: 892,
        comments: 45,
        shares: 23,
        postedAt: '2024-01-10T10:00:00Z',
        addedAt: '2024-01-10T10:05:00Z',
        status: 'active',
      },
      {
        id: '2',
        title: 'Gaming Setup Tour',
        instagramUrl: 'https://www.instagram.com/reel/XYZ789/',
        thumbnailUrl: 'https://via.placeholder.com/300x400',
        username: '@jiocoder',
        views: 23450,
        likes: 1234,
        comments: 67,
        shares: 89,
        postedAt: '2024-01-08T14:30:00Z',
        addedAt: '2024-01-08T14:35:00Z',
        status: 'active',
      },
      {
        id: '3',
        title: 'Mechanical Keyboard Sound Test',
        instagramUrl: 'https://www.instagram.com/reel/DEF456/',
        thumbnailUrl: 'https://via.placeholder.com/300x400',
        username: '@jiocoder',
        views: 18900,
        likes: 756,
        comments: 34,
        shares: 12,
        postedAt: '2024-01-05T16:20:00Z',
        addedAt: '2024-01-05T16:25:00Z',
        status: 'active',
      },
    ]);
  }, []);

  const handleAddReel = () => {
    // Extract username from URL if not provided
    let username = formData.username;
    if (!username && formData.instagramUrl) {
      // Try to extract from URL
      const match = formData.instagramUrl.match(/instagram\.com\/([^\/]+)/);
      if (match) {
        username = match[1];
      }
    }

    const newReel: InstagramReel = {
      id: `reel-${Date.now()}`,
      title: formData.title,
      instagramUrl: formData.instagramUrl,
      thumbnailUrl: formData.thumbnailUrl,
      username: username || '@jiocoder',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      postedAt: new Date().toISOString(),
      addedAt: new Date().toISOString(),
      status: 'active',
    };

    setReels([newReel, ...reels]);
    setFormData({
      title: '',
      instagramUrl: '',
      thumbnailUrl: '',
      username: '',
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this reel?')) {
      setReels(reels.filter((r) => r.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setReels(
      reels.map((r) =>
        r.id === id ? { ...r, status: r.status === 'active' ? 'archived' : 'active' } : r
      )
    );
  };

  const handleRefreshStats = (id: string) => {
    // Simulate fetching updated stats from Instagram API
    setReels(
      reels.map((r) =>
        r.id === id
          ? {
              ...r,
              views: r.views + Math.floor(Math.random() * 100),
              likes: r.likes + Math.floor(Math.random() * 10),
            }
          : r
      )
    );
  };

  const totalViews = reels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = reels.reduce((sum, reel) => sum + reel.likes, 0);
  const totalEngagement = reels.reduce(
    (sum, reel) => sum + reel.likes + reel.comments + reel.shares,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instagram Reels Management</h1>
          <p className="text-gray-600 mt-1">Manage Instagram reels and track performance</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Reel
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-2xl">visibility</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{totalLikes.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-red-600 text-2xl">thumb_up</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{totalEngagement.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-green-600 text-2xl">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[9/16] bg-gray-200">
              {reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-gray-400">
                    movie
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    reel.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {reel.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{reel.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{reel.username}</p>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-symbols-outlined text-base">visibility</span>
                  {reel.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  {reel.likes.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-symbols-outlined text-base">comment</span>
                  {reel.comments}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-symbols-outlined text-base">share</span>
                  {reel.shares}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRefreshStats(reel.id)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Refresh Stats
                </button>
                <a
                  href={reel.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                </a>
                <button
                  onClick={() => handleToggleStatus(reel.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    reel.status === 'active'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {reel.status === 'active' ? 'Archive' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(reel.id)}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reels.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">movie</span>
          <p className="text-gray-500 mb-4">No Instagram reels added yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Reel
          </button>
        </div>
      )}

      {/* Add Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Instagram Reel</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reel Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reel title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Reel URL * (e.g., https://www.instagram.com/reel/ABC123/)
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.instagram.com/reel/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username (optional, will be extracted from URL)
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReel}
                disabled={!formData.title || !formData.instagramUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

