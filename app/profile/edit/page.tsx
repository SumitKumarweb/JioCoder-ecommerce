'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import { LS_USER_AVATAR, LS_USER_EMAIL, LS_USER_ID, LS_USER_NAME, defaultAvatarUrl } from '@/lib/userLocal';

export default function ProfileEditPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem(LS_USER_NAME) || '');
    setEmail(localStorage.getItem(LS_USER_EMAIL) || '');
    setAvatar(localStorage.getItem(LS_USER_AVATAR) || '');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uid = localStorage.getItem(LS_USER_ID);
    if (!uid) {
      router.push('/login');
      return;
    }
    localStorage.setItem(LS_USER_NAME, name.trim());
    if (email.trim()) localStorage.setItem(LS_USER_EMAIL, email.trim().toLowerCase());
    if (avatar) {
      try {
        localStorage.setItem(LS_USER_AVATAR, avatar);
      } catch {
        alert('Avatar is too large. Clear it or use a smaller image.');
        return;
      }
    } else {
      localStorage.removeItem(LS_USER_AVATAR);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayName = name.trim() || 'Member';

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-5 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
          <AccountSidebar activeKey="profile" />
          <section className="flex-1 w-full max-w-2xl space-y-6">
            <div>
              <Link
                href="/profile"
                className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1 mb-4"
              >
                <span className="material-symbols-outlined !text-lg">arrow_back</span>
                Back to dashboard
              </Link>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit profile</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Update how your name and email appear on your account. Photo is stored on this device.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={avatar || defaultAvatarUrl(displayName)}
                  alt=""
                  className="size-20 rounded-full object-cover border-4 border-primary/20"
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profile photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-slate-600 dark:text-slate-400"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file || !file.type.startsWith('image/')) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') setAvatar(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 mt-1 font-medium hover:underline"
                    onClick={() => setAvatar('')}
                  >
                    Remove photo
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="edit-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full name
                </label>
                <input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Used for order history lookup when not linked by account ID.
                </p>
              </div>

              {saved && (
                <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined !text-lg">check_circle</span>
                  Saved
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Save changes
                </button>
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
