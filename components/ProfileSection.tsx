'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { defaultAvatarUrl } from '@/lib/userLocal';

type ProfileSectionProps = {
  name: string;
  email: string;
  memberSince?: string;
  location?: string;
  avatarSrc?: string;
  onAvatarChange?: (dataUrlOrUrl: string) => void;
  editHref?: string;
  viewPublicHref?: string;
};

export default function ProfileSection({
  name,
  email,
  memberSince,
  location,
  avatarSrc,
  onAvatarChange,
  editHref = '/profile/edit',
  viewPublicHref = '/community',
}: ProfileSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const displayName = name.trim() || 'Member';
  const src = avatarSrc?.trim() || defaultAvatarUrl(displayName);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string' && onAvatarChange) onAvatarChange(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="relative">
          <div className="size-28 md:size-32 rounded-full border-4 border-primary/20 p-1 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              className="w-full h-full object-cover rounded-full"
              alt={`${displayName} profile photo`}
              src={src}
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 size-10 bg-primary text-white rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Change profile photo"
          >
            <span className="material-symbols-outlined text-xl">camera_alt</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h2>
          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 break-all">
            <span className="material-symbols-outlined text-sm shrink-0">mail</span>
            {email || '—'}
          </p>
          {(memberSince || location) && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {memberSince && <>Member since {memberSince}</>}
              {memberSince && location && ' • '}
              {location}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Link
            href={editHref}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </Link>
          <Link
            href={viewPublicHref}
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Community
          </Link>
        </div>
      </div>
    </section>
  );
}
