'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Clear any admin session/auth data
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  const menuItems = [
    { href: '/nimda-pro-sumit/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/nimda-pro-sumit/products', label: 'Products', icon: 'inventory_2' },
    { href: '/nimda-pro-sumit/collections', label: 'Collections', icon: 'collections' },
    { href: '/nimda-pro-sumit/orders', label: 'Orders', icon: 'shopping_bag' },
    { href: '/nimda-pro-sumit/community-reviews', label: 'Community Reviews', icon: 'video_library' },
    { href: '/nimda-pro-sumit/instagram-reels', label: 'Instagram Reels', icon: 'movie' },
    { href: '/nimda-pro-sumit/analytics', label: 'Analytics', icon: 'analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">
                {sidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find((item) => item.href === pathname)?.label || 'Admin'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="material-symbols-outlined">account_circle</span>
                <span className="text-sm">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

