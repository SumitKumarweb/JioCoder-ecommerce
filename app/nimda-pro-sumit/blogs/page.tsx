'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary?: string;
  category: string;
  subCategory?: string;
  featuredImage: string;
  images: string[];
  videos: string[];
  content?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  views?: string;
  tags: string[];
  isFeatured: boolean;
  likes?: string;
  comments?: number;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    summary: '',
    category: '',
    subCategory: '',
    featuredImage: '',
    images: [] as string[],
    videos: [] as string[],
    content: '',
    authorName: '',
    authorRole: '',
    authorAvatar: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '',
    tags: [] as string[],
    isFeatured: false,
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Load blogs from localStorage
    const saved = localStorage.getItem('adminBlogs');
    if (saved) {
      setBlogs(JSON.parse(saved));
    } else {
      // Default mock blogs
      const mockBlogs: BlogPost[] = [
        {
          id: 'blog-1',
          slug: 'building-ultimate-mechanical-keyboard',
          title: 'Building the Ultimate Mechanical Keyboard',
          description: 'From selecting the perfect switches to lubing stabilizers, here is everything you need to know about crafting your dream typing experience.',
          category: 'Featured Guide',
          featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCjQ2IV-Vws-XgqGs68uwrgOtTrLtZhQ_QawS59sBZ7OEG89FMz8lYrfqt75MgfCgDkGJlXUmpXo20S6A9SeAUFvQ5RWzxSFHzdXwtme6SGC1o4gCwFFmwyASQ3xLLkWMkc3WK9WvLKQF3pgDulXLhYXrotdoGOBJKCrohuivbOXNWum67uIf0dO4pP4h6Or7f7LnOjig7KZW9wtF18dwJqxqNuVXuEgFA51CBdIj3Ecbx0Lz5lgK0FtAaJmdVSDxIF1RGH1Ie9oY4',
          images: [],
          videos: [],
          author: {
            name: 'Arjun Sharma',
            role: 'Tech Lead @ JioCoder',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgFtVzwM5FlDoWgEaRpJxVTXIu-240nc7k3L-FxCCzXi7Zlgm7WmllrealXdlvujHKj-yu7k1Raa-g83zWB-T_B-W4vxPcT4KSDpxjAWDQucNSYYkwgU1rgPGX-6bJU8Nb3Kp4KaEIfvDx3pgd9C_9XJvUnuTWTkj2Yo55MmQhG9YvEWAzflG8ZL7K0pYpKgjjy8IYmkKQSXMBvgLizrdozzUmtAV7VsVbJIiQOW1AWlUVOA9OLQwGM4vZfQoKU6nbRard9oB8PXeZ',
          },
          date: 'Oct 24, 2024',
          readTime: '12 min read',
          tags: ['MechanicalKeyboard', 'SetupTour'],
          isFeatured: true,
        },
      ];
      setBlogs(mockBlogs);
      localStorage.setItem('adminBlogs', JSON.stringify(mockBlogs));
    }
  }, []);

  const categories = ['All', 'Featured Guide', 'Gaming', 'Electronics', 'Coding', 'Setup Tours', 'News', 'Guide', 'Hardware'];

  const handleAddBlog = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      summary: '',
      category: '',
      subCategory: '',
      featuredImage: '',
      images: [],
      videos: [],
      content: '',
      authorName: 'Arjun Sharma',
      authorRole: 'Tech Lead @ JioCoder',
      authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgFtVzwM5FlDoWgEaRpJxVTXIu-240nc7k3L-FxCCzXi7Zlgm7WmllrealXdlvujHKj-yu7k1Raa-g83zWB-T_B-W4vxPcT4KSDpxjAWDQucNSYYkwgU1rgPGX-6bJU8Nb3Kp4KaEIfvDx3pgd9C_9XJvUnuTWTkj2Yo55MmQhG9YvEWAzflG8ZL7K0pYpKgjjy8IYmkKQSXMBvgLizrdozzUmtAV7VsVbJIiQOW1AWlUVOA9OLQwGM4vZfQoKU6nbRard9oB8PXeZ',
      date: new Date().toISOString().split('T')[0],
      readTime: '',
      tags: [],
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      summary: blog.summary || '',
      category: blog.category,
      subCategory: blog.subCategory || '',
      featuredImage: blog.featuredImage,
      images: blog.images || [],
      videos: blog.videos || [],
      content: blog.content || '',
      authorName: blog.author.name,
      authorRole: blog.author.role,
      authorAvatar: blog.author.avatar,
      date: blog.date,
      readTime: blog.readTime,
      tags: blog.tags || [],
      isFeatured: blog.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSaveBlog = () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in required fields (Title, Description, Category)');
      return;
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const date = formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (editingBlog) {
      const updated = blogs.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              slug,
              title: formData.title,
              description: formData.description,
              summary: formData.summary,
              category: formData.category,
              subCategory: formData.subCategory,
              featuredImage: formData.featuredImage,
              images: formData.images,
              videos: formData.videos,
              content: formData.content,
              author: {
                name: formData.authorName,
                role: formData.authorRole,
                avatar: formData.authorAvatar,
              },
              date,
              readTime: formData.readTime,
              tags: formData.tags,
              isFeatured: formData.isFeatured,
            }
          : b
      );
      setBlogs(updated);
      localStorage.setItem('adminBlogs', JSON.stringify(updated));
    } else {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        slug,
        title: formData.title,
        description: formData.description,
        summary: formData.summary,
        category: formData.category,
        subCategory: formData.subCategory,
        featuredImage: formData.featuredImage,
        images: formData.images,
        videos: formData.videos,
        content: formData.content,
        author: {
          name: formData.authorName,
          role: formData.authorRole,
          avatar: formData.authorAvatar,
        },
        date,
        readTime: formData.readTime,
        tags: formData.tags,
        isFeatured: formData.isFeatured,
      };
      const updated = [...blogs, newBlog];
      setBlogs(updated);
      localStorage.setItem('adminBlogs', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter((b) => b.id !== id);
      setBlogs(updated);
      localStorage.setItem('adminBlogs', JSON.stringify(updated));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      setFormData({ ...formData, videos: [...formData.videos, newVideoUrl.trim()] });
      setNewVideoUrl('');
    }
  };

  const removeVideo = (index: number) => {
    setFormData({ ...formData, videos: formData.videos.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || filterCategory === 'All' || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage blog posts, articles, and content</p>
        </div>
        <button
          onClick={handleAddBlog}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Blog Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={blog.featuredImage} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{blog.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {blog.isFeatured ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                        title="View on frontend"
                      >
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                      </Link>
                      <button onClick={() => handleEditBlog(blog)} className="text-blue-600 hover:text-blue-900">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-600 hover:text-red-900">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!formData.slug) {
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <input
                      type="text"
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description shown in blog listing"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Short summary/excerpt for the blog post"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {formData.featuredImage && (
                  <img src={formData.featuredImage} alt="Preview" className="mt-4 w-full max-w-md h-48 object-cover rounded-lg" />
                )}
              </div>

              {/* Additional Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                  />
                  <button onClick={addImage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addVideo()}
                  />
                  <button onClick={addVideo} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{video}</span>
                      <button onClick={() => removeVideo(index)} className="text-red-600 hover:text-red-700">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Full blog post content (HTML or Markdown supported)"
                />
              </div>

              {/* Author Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
                    <input
                      type="text"
                      value={formData.authorRole}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Avatar URL</label>
                    <input
                      type="text"
                      value={formData.authorAvatar}
                      onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 8 min read"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Post</label>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Mark as featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button onClick={addTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-blue-600 hover:text-blue-900">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleSaveBlog} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingBlog ? 'Update' : 'Add'} Blog Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

