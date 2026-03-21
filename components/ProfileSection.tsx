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
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none p-6 md:p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-bl from-slate-100/90 to-transparent dark:from-slate-800/50 dark:to-transparent -mr-36 -mt-36 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="relative">
          <div className="size-28 md:size-32 rounded-full p-1 overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200/90 dark:ring-slate-600/80">
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
            className="absolute bottom-0 right-0 size-10 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-full border-[3px] border-white dark:border-slate-900 flex items-center justify-center shadow-md hover:bg-slate-700 dark:hover:bg-white transition-colors"
            aria-label="Change profile photo"
          >
            <span className="material-symbols-outlined text-xl">camera_alt</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{displayName}</h2>
          <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 break-all text-sm">
            <span className="material-symbols-outlined text-base shrink-0 text-slate-400 dark:text-slate-500">mail</span>
            {email || '—'}
          </p>
          {(memberSince || location) && (
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              {memberSince && <>Member since {memberSince}</>}
              {memberSince && location && ' • '}
              {location}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 w-full md:w-auto md:min-w-[200px]">
          <Link
            href={editHref}
            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </Link>
          <Link
            href={viewPublicHref}
            className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
          >
            Community
          </Link>
        </div>
      </div>
    </section>
  );
}
