'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type FeedPost = {
  id: string;
  body: string;
  code?: string;
  resourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
  user: { id: string; name?: string; email: string } | null;
};

type GroupRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
  memberCount: number;
  whoCanPost: string;
};

type StatusRow = {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  expiresAt: string;
  user: { id: string; name?: string; email: string } | null;
};

function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

/** Public-facing name for story ring + modal (everyone sees this). */
function getProfileDisplayName(user: StatusRow['user']): string {
  if (!user) return 'Member';
  const n = user.name?.trim();
  if (n) return n;
  const email = user.email?.trim() || '';
  if (!email) return 'Member';
  const local = email.split('@')[0] || '';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getGroupInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  const one = parts[0] || '?';
  return one.slice(0, 2).toUpperCase();
}

function getProfileInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  const one = parts[0] || '?';
  return one.slice(0, 2).toUpperCase();
}

function formatStoryTimeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h >= 24) return `${Math.floor(h / 24)}d left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function formatRetryAfter(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatDurationUntil(targetMs: number, nowMs: number): string {
  const ms = Math.max(0, targetMs - nowMs);
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return 'soon';
}

const STORIES_SEEN_KEY = 'jiocoder_community_stories_seen';

function loadSeenStoryIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORIES_SEEN_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function persistSeenStoryIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORIES_SEEN_KEY, JSON.stringify([...ids]));
}

export default function CommunityHomeClient() {
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [statuses, setStatuses] = useState<StatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [postBody, setPostBody] = useState('');
  const [postCode, setPostCode] = useState('');
  const [postResourceUrl, setPostResourceUrl] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [statusText, setStatusText] = useState('');
  const [statusPhoto, setStatusPhoto] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  /** Server: one story upload per rolling 24h */
  const [storyUploadGate, setStoryUploadGate] = useState<{
    canUpload: boolean;
    nextAllowedAt?: string;
  } | null>(null);
  const [storyCooldownTick, setStoryCooldownTick] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
  const [viewingStory, setViewingStory] = useState<StatusRow | null>(null);
  /** Story IDs this browser has opened (seen) — moved to the end of the strip. */
  const [seenStoryIds, setSeenStoryIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSeenStoryIds(loadSeenStoryIds());
  }, []);

  /** Prune seen IDs when stories expire; keep storage small. */
  useEffect(() => {
    if (statuses.length === 0) return;
    const valid = new Set(statuses.map((s) => s.id));
    const loaded = loadSeenStoryIds();
    const pruned = new Set([...loaded].filter((id) => valid.has(id)));
    if (pruned.size !== loaded.size) {
      persistSeenStoryIds(pruned);
      setSeenStoryIds(pruned);
    }
  }, [statuses]);

  const markStoryAsSeen = useCallback((id: string) => {
    const next = new Set(loadSeenStoryIds());
    next.add(id);
    persistSeenStoryIds(next);
    setSeenStoryIds(next);
  }, []);

  /**
   * Order: (1) Not seen yet, oldest → newest (latest upload toward the right).
   * (2) Seen, oldest → newest — always after all unseen (moved to the end).
   */
  const sortedStories = useMemo(() => {
    const byCreatedAsc = (a: StatusRow, b: StatusRow) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    const unseen = statuses.filter((s) => !seenStoryIds.has(s.id));
    const seen = statuses.filter((s) => seenStoryIds.has(s.id));

    return [...[...unseen].sort(byCreatedAsc), ...[...seen].sort(byCreatedAsc)];
  }, [statuses, seenStoryIds]);

  const storyUploadBlocked = Boolean(
    uid && storyUploadGate && !storyUploadGate.canUpload && storyUploadGate.nextAllowedAt
  );

  const storyWaitHuman = useMemo(() => {
    if (!storyUploadGate?.nextAllowedAt || storyUploadGate.canUpload) return null;
    void storyCooldownTick;
    const t = new Date(storyUploadGate.nextAllowedAt).getTime();
    return {
      absolute: formatRetryAfter(storyUploadGate.nextAllowedAt),
      remaining: formatDurationUntil(t, Date.now()),
    };
  }, [storyUploadGate, storyCooldownTick]);

  useEffect(() => {
    if (!viewingStory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewingStory(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [viewingStory]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const currentUid = getUserId();
      const statusUrl = `/api/community/status${
        currentUid ? `?userId=${encodeURIComponent(currentUid)}` : ''
      }`;
      const [p, g, s] = await Promise.all([
        fetch('/api/community/feed?limit=40').then((r) => r.json()),
        fetch('/api/community/groups').then((r) => r.json()),
        fetch(statusUrl).then((r) => r.json()),
      ]);
      setPosts(p.posts || []);
      setGroups(g.groups || []);
      setStatuses(s.statuses || []);
      setStoryUploadGate(
        currentUid && s.myStoryUpload
          ? {
              canUpload: Boolean(s.myStoryUpload.canUpload),
              nextAllowedAt:
                typeof s.myStoryUpload.nextAllowedAt === 'string'
                  ? s.myStoryUpload.nextAllowedAt
                  : undefined,
            }
          : null
      );
    } catch {
      setMsg('Failed to load community.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      setUid(getUserId());
      void loadAll();
    };
    sync();
    window.addEventListener('userLoggedIn', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('userLoggedIn', sync);
      window.removeEventListener('storage', sync);
    };
  }, [loadAll]);

  useEffect(() => {
    if (!storyUploadGate?.nextAllowedAt || storyUploadGate.canUpload) return;
    const t = setInterval(() => setStoryCooldownTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, [storyUploadGate?.nextAllowedAt, storyUploadGate?.canUpload]);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = getUserId();
    if (!uid) {
      setMsg('Log in to post.');
      return;
    }
    const b = postBody.trim();
    const c = postCode.trim();
    const r = postResourceUrl.trim();
    if (!b && !c && !r && !postImage) return;
    setMsg(null);

    const form = new FormData();
    form.set('userId', uid);
    form.set('body', b);
    form.set('code', c);
    form.set('resourceUrl', r);
    if (postImage) form.set('image', postImage);

    const res = await fetch('/api/community/feed', {
      method: 'POST',
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Could not post');
      return;
    }
    setPostBody('');
    setPostCode('');
    setPostResourceUrl('');
    setPostImage(null);
    loadAll();
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = getUserId();
    if (!uid) {
      setMsg('Log in to create a group.');
      return;
    }
    if (!groupName.trim()) return;
    setMsg(null);

    const form = new FormData();
    form.set('userId', uid);
    form.set('name', groupName.trim());
    form.set('description', groupDesc.trim());
    if (groupAvatar) form.set('avatar', groupAvatar);

    const res = await fetch('/api/community/groups', {
      method: 'POST',
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Could not create group');
      return;
    }
    setGroupName('');
    setGroupDesc('');
    setGroupAvatar(null);
    loadAll();
    if (data.group?.slug) {
      window.location.href = `/community/groups/${encodeURIComponent(data.group.slug)}`;
    }
  };

  const submitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = getUserId();
    if (!uid) {
      setMsg('Log in to set a status.');
      return;
    }
    if (!statusText.trim()) return;
    setMsg(null);

    const form = new FormData();
    form.set('userId', uid);
    form.set('text', statusText.trim());
    if (statusPhoto) form.set('image', statusPhoto);

    const res = await fetch('/api/community/status', {
      method: 'POST',
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Could not set status');
      if (res.status === 429 && typeof data.nextAllowedAt === 'string') {
        setStoryUploadGate({ canUpload: false, nextAllowedAt: data.nextAllowedAt });
      }
      return;
    }
    setStatusText('');
    setStatusPhoto(null);
    if (data.myStoryUpload) {
      setStoryUploadGate({
        canUpload: Boolean(data.myStoryUpload.canUpload),
        nextAllowedAt:
          typeof data.myStoryUpload.nextAllowedAt === 'string'
            ? data.myStoryUpload.nextAllowedAt
            : undefined,
      });
    }
    loadAll();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      {/* Hero */}
      <div className="relative mb-8 sm:mb-10 mt-2 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 px-5 py-8 sm:px-10 sm:py-11 shadow-2xl shadow-violet-900/25 ring-1 ring-white/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-900/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/95 ring-1 ring-white/25 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              Live
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white/95 ring-1 ring-white/20 backdrop-blur-sm">
              Stories · Feed · Squad chat
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.15)]">
            Build in public.
            <span className="block sm:inline sm:ml-2 text-white/85 font-extrabold">Ship with devs.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/90">
            24-hour <strong className="text-white">stories</strong>, a real{' '}
            <strong className="text-white">feed</strong> (code + links + pics), and{' '}
            <strong className="text-white">groups</strong> that don&apos;t look like a spreadsheet.
          </p>
        </div>
      </div>

      {/* Stories — public to everyone, 24h */}
      <section className="mb-8 rounded-2xl border border-violet-200/70 bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-xl shadow-violet-500/[0.08] ring-1 ring-slate-200/60">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg shadow-fuchsia-500/30">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
              </span>
              Stories
              <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-md border border-fuchsia-100">
                24h
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 max-w-xl leading-relaxed">
              Fresh uploads drift right · Opened = seen (moves to the end). Everyone watches the clock together.
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1 -mx-1 px-1 scrollbar-thin [scrollbar-color:rgba(139,92,246,0.35)_transparent]">
          {loading && statuses.length === 0 ? (
            <div className="flex items-center gap-3 py-6 px-4 text-violet-700 text-sm font-semibold w-full justify-center rounded-xl bg-violet-50/80 border border-violet-100">
              <span className="inline-block w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              Syncing stories…
            </div>
          ) : sortedStories.length === 0 ? (
            <div className="py-8 px-4 text-center w-full rounded-xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30">
              <p className="text-sm font-black text-slate-800">Quiet here — your move</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Drop a story and kick things off. First one hits different.</p>
            </div>
          ) : (
            sortedStories.map((st) => {
              const displayName = getProfileDisplayName(st.user);
              const initials = getProfileInitials(displayName);
              const isYours = uid && st.user?.id === uid;
              const isSeen = seenStoryIds.has(st.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    markStoryAsSeen(st.id);
                    setViewingStory(st);
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 w-[52px] sm:w-[58px] text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-xl"
                >
                  <div
                    className={`relative rounded-full p-[2px] shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-200 ${
                      isSeen
                        ? 'bg-slate-300/90 shadow-slate-300/50'
                        : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 shadow-fuchsia-500/25'
                    } ${isYours ? 'ring-2 ring-offset-2 ring-offset-white ring-violet-500' : ''}`}
                  >
                    <div className="rounded-full bg-white p-px">
                      <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        {st.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={st.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-600 tracking-tight leading-none">
                            {initials}
                          </span>
                        )}
                      </div>
                    </div>
                    {isYours && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[6px] font-black uppercase text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 px-1 py-px rounded-full leading-none shadow-sm ring-1 ring-white/40">
                        You
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[8px] font-bold text-slate-900 text-center leading-tight line-clamp-1 w-full px-0.5 max-w-[52px] sm:max-w-[56px]"
                    title={displayName}
                  >
                    {displayName}
                  </span>
                  <span className="text-[7px] text-slate-400 font-medium leading-none text-center px-0.5 scale-90 origin-top">
                    {isSeen ? 'Seen · ' : ''}
                    {formatStoryTimeLeft(st.expiresAt)}
                  </span>
                </button>
              );
            })
          )}
        </div>
        {uid ? (
          <form
            onSubmit={submitStatus}
            className="mt-4 pt-4 border-t border-violet-100 space-y-3 rounded-xl bg-slate-50/80 p-3 sm:p-4 -mx-1"
          >
            <p className="text-[10px] font-black text-violet-800 uppercase tracking-[0.15em]">Your story</p>
            <p className="text-[11px] text-slate-600 leading-snug">
              One drop per <span className="font-bold text-slate-800">24h</span>. Name on your profile shows here — keep
              it real.
            </p>
            {storyUploadBlocked && storyWaitHuman && (
              <p className="text-xs font-semibold text-amber-900 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl px-3 py-2 shadow-sm">
                ⏱ Next slot in <strong>~{storyWaitHuman.remaining}</strong> · unlocks {storyWaitHuman.absolute}
              </p>
            )}
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200/90 bg-white text-sm shadow-sm focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 outline-none transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="What are you building? (max 280 chars)"
              maxLength={280}
              value={statusText}
              disabled={storyUploadBlocked}
              onChange={(e) => setStatusText(e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Photo · JPG / PNG / WebP / GIF · max 5MB
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                disabled={storyUploadBlocked}
                onChange={(e) => setStatusPhoto(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-700 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-violet-100 file:font-bold file:text-violet-800 hover:file:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={storyUploadBlocked}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-black shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              Publish story
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('openLoginModal'))}
            className="mt-4 w-full text-left text-sm font-bold text-violet-700 hover:text-violet-900 py-2 px-3 rounded-xl bg-violet-50 border border-violet-100 hover:bg-violet-100/80 transition-colors"
          >
            → Log in to post a story
          </button>
        )}
      </section>

      <div className="flex justify-center sm:justify-start mb-8">
        <div className="inline-flex rounded-2xl bg-slate-900/[0.04] p-1.5 ring-1 ring-slate-200/90 shadow-inner">
          {(['feed', 'groups'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 text-sm font-black capitalize rounded-xl transition-all duration-200 ${
                tab === t
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/35 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/90'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] opacity-90">
                {t === 'feed' ? 'dynamic_feed' : 'groups'}
              </span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <p className="mb-5 text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 shadow-sm">
          {msg}
        </p>
      )}

      {tab === 'feed' && (
        <div className="space-y-8">
          {uid ? (
            <form
              onSubmit={submitPost}
              className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-white via-white to-violet-50/40 p-5 sm:p-6 shadow-xl shadow-violet-500/[0.07] ring-1 ring-slate-200/50 space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-violet-100 pb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                  <span className="material-symbols-outlined text-[22px]">edit_square</span>
                </span>
                <div>
                  <label className="text-sm font-black text-slate-900">Compose</label>
                  <p className="text-[11px] text-slate-500">Text · code · link · image — mix freely.</p>
                </div>
              </div>
              <div>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/90 bg-white text-sm min-h-[96px] shadow-sm focus:ring-2 focus:ring-violet-400/35 focus:border-violet-300 outline-none transition-shadow"
                  placeholder="Hot take, question, win, rant…"
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">code</span> Code
                </label>
                <textarea
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-emerald-900/20 text-sm font-mono text-[13px] min-h-[120px] bg-[#0d1117] text-emerald-100 placeholder:text-emerald-800/50 focus:ring-2 focus:ring-emerald-500/30 outline-none"
                  placeholder="// paste snippet"
                  value={postCode}
                  spellCheck={false}
                  onChange={(e) => setPostCode(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Resource URL</label>
                <input
                  type="url"
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm shadow-sm focus:ring-2 focus:ring-violet-400/35 outline-none"
                  placeholder="https://docs, repo, video…"
                  value={postResourceUrl}
                  onChange={(e) => setPostResourceUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                  className="mt-1.5 block w-full text-xs text-slate-700 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-fuchsia-100 file:font-bold file:text-fuchsia-900 hover:file:bg-fuchsia-200"
                />
                <p className="text-[10px] text-slate-500 mt-1">Max 8MB</p>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 text-white text-sm font-black shadow-lg hover:bg-slate-800 hover:shadow-xl active:scale-[0.99] transition-all"
              >
                Ship it →
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('openLoginModal'))}
              className="w-full text-left rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 px-5 py-6 text-slate-700 font-bold hover:bg-violet-100/60 transition-colors"
            >
              <span className="text-violet-600">→</span> Log in to post to the feed
            </button>
          )}

          <div className="space-y-5">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-violet-700 font-semibold">
                <span className="h-6 w-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                Loading the good stuff…
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white/60">
                <p className="text-slate-800 font-black text-lg">Feed&apos;s empty</p>
                <p className="text-slate-500 text-sm mt-1">Someone has to go first. Might as well be you.</p>
              </div>
            ) : (
              posts.map((p) => (
                <article
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-transparent hover:ring-violet-200/50 space-y-3 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-violet-500 before:via-fuchsia-500 before:to-indigo-500"
                >
                  <div className="flex items-start gap-3 pl-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-black text-white shadow-md">
                      {getProfileInitials(getProfileDisplayName(p.user))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900">{getProfileDisplayName(p.user)}</p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {p.body ? (
                    <p className="text-slate-800 whitespace-pre-wrap text-sm leading-relaxed pl-2">{p.body}</p>
                  ) : null}
                  {p.imageUrl ? (
                    <a
                      href={p.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block ml-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 ring-1 ring-slate-100 group-hover:ring-violet-200/60 transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt="" className="w-full max-h-80 object-contain" />
                    </a>
                  ) : null}
                  {p.code ? (
                    <pre className="text-xs sm:text-sm font-mono text-slate-100 bg-[#0d1117] rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-words border border-slate-700 shadow-inner ml-2">
                      <code>{p.code}</code>
                    </pre>
                  ) : null}
                  {p.resourceUrl ? (
                    <a
                      href={p.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 ml-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-xl shadow-md hover:brightness-110 hover:shadow-lg transition-all break-all"
                    >
                      <span className="material-symbols-outlined text-lg shrink-0">open_in_new</span>
                      Open resource
                    </a>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'groups' && (
        <div className="space-y-10">
          {uid ? (
            <form
              onSubmit={createGroup}
              className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/40 via-white to-white p-5 sm:p-6 shadow-xl shadow-indigo-500/[0.06] ring-1 ring-slate-200/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </span>
                <h3 className="font-black text-slate-900 text-lg">Spawn a squad</h3>
              </div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400/35 outline-none"
                placeholder="Group name *"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <textarea
                className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400/35 outline-none"
                placeholder="What’s this group about? (optional)"
                rows={3}
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
              />
              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Avatar</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  onChange={(e) => setGroupAvatar(e.target.files?.[0] || null)}
                  className="mt-1.5 block w-full text-xs text-slate-700 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-indigo-100 file:font-bold file:text-indigo-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">Optional · max 5MB</p>
              </div>
              <button
                type="submit"
                className="mt-5 w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black shadow-lg shadow-indigo-500/25 hover:brightness-105 active:scale-[0.99] transition-all"
              >
                Create & jump in →
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('openLoginModal'))}
              className="w-full text-left rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/40 px-5 py-6 font-bold text-slate-700 hover:bg-indigo-100/50 transition-colors"
            >
              → Log in to create groups
            </button>
          )}

          <div>
            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-indigo-600">forum</span>
              All squads
            </h3>
            <ul className="space-y-4">
              {groups.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/community/groups/${encodeURIComponent(g.slug)}`}
                    className="group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-black border-2 border-white shadow-lg ring-2 ring-violet-100 group-hover:ring-indigo-200 transition-all">
                      {g.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getGroupInitials(g.name)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 items-start">
                      <span className="font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {g.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                        {g.memberCount} in
                      </span>
                    </div>
                    {g.description ? (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{g.description}</p>
                    ) : null}
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">
                      {g.whoCanPost === 'admins' ? '🔒 Admins post' : '💬 Everyone chats'}
                    </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all self-center">
                      chevron_right
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {!loading && groups.length === 0 && (
              <p className="text-center py-10 text-slate-500 text-sm font-medium rounded-2xl border border-dashed border-slate-300 bg-white/50">
                No squads yet — start one above.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Story viewer — full story + profile for everyone */}
      {viewingStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-viewer-title"
          onClick={() => setViewingStory(null)}
        >
          <div
            className="relative w-full max-w-[320px] sm:max-w-sm max-h-[85vh] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-black shadow-2xl shadow-fuchsia-500/20 ring-2 ring-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />
            <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 ring-2 ring-white/20 shadow-lg">
                {getProfileInitials(getProfileDisplayName(viewingStory.user))}
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="story-viewer-title" className="text-xs font-black text-white truncate tracking-tight">
                  {getProfileDisplayName(viewingStory.user)}
                </h3>
                <p className="text-[9px] text-fuchsia-200/80 font-semibold leading-tight">
                  {formatStoryTimeLeft(viewingStory.expiresAt)} · 24h public
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingStory(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              {viewingStory.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewingStory.imageUrl}
                  alt=""
                  className="w-full max-h-[min(38vh,240px)] object-contain bg-black/80"
                />
              ) : null}
              <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/95 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {viewingStory.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
