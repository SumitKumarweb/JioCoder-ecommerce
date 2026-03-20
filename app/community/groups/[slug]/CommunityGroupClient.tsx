'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { io, type Socket } from 'socket.io-client';

type Msg = {
  id: string;
  body: string;
  code?: string;
  imageUrl?: string;
  createdAt: string;
  user: { id: string; name?: string; email: string } | null;
};

type GroupInfo = {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
  whoCanPost: string;
  memberCount: number;
  myRole: 'member' | 'group_admin' | null;
  isMember: boolean;
};

function groupInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  const one = parts[0] || '?';
  return one.slice(0, 2).toUpperCase();
}

export default function CommunityGroupClient({ slug }: { slug: string }) {
  const [uid, setUid] = useState<string | null>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState('');
  const [msgCode, setMsgCode] = useState('');
  const [msgImage, setMsgImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editWho, setEditWho] = useState<'all' | 'admins'>('all');

  const socketRef = useRef<Socket | null>(null);
  const [rtConnected, setRtConnected] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  /** Remount file input so the chosen filename clears after send */
  const [fileInputKey, setFileInputKey] = useState(0);

  const normalizeIncomingMsg = useCallback((raw: Record<string, unknown>): Msg | null => {
    if (!raw || typeof raw.id !== 'string') return null;
    const createdAt =
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : raw.createdAt instanceof Date
          ? raw.createdAt.toISOString()
          : String(raw.createdAt ?? '');
    const u = raw.user as Msg['user'];
    return {
      id: raw.id,
      body: typeof raw.body === 'string' ? raw.body : '',
      code: typeof raw.code === 'string' ? raw.code : undefined,
      imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
      createdAt,
      user:
        u && typeof u === 'object'
          ? {
              id: typeof u.id === 'string' ? u.id : '',
              name: typeof u.name === 'string' ? u.name : undefined,
              email: typeof u.email === 'string' ? u.email : '',
            }
          : null,
    };
  }, []);

  const appendMessageDeduped = useCallback(
    (raw: Record<string, unknown>) => {
      const next = normalizeIncomingMsg(raw);
      if (!next) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === next.id)) return prev;
        return [...prev, next];
      });
    },
    [normalizeIncomingMsg]
  );

  useEffect(() => {
    if (!group?.isMember || messages.length === 0) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, group?.isMember]);

  useEffect(() => {
    const sync = () => setUid(localStorage.getItem('userId'));
    sync();
    window.addEventListener('userLoggedIn', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('userLoggedIn', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const loadGroup = useCallback(async () => {
    const q = uid ? `?userId=${encodeURIComponent(uid)}` : '';
    const res = await fetch(`/api/community/groups/${encodeURIComponent(slug)}${q}`);
    const data = await res.json();
    if (!res.ok) {
      setGroup(null);
      return;
    }
    setGroup(data.group);
    setEditName(data.group.name);
    setEditDesc(data.group.description || '');
    setEditWho(data.group.whoCanPost === 'admins' ? 'admins' : 'all');
  }, [slug, uid]);

  const loadMessages = useCallback(async () => {
    if (!uid) {
      setMessages([]);
      return;
    }
    const res = await fetch(
      `/api/community/groups/${encodeURIComponent(slug)}/messages?userId=${encodeURIComponent(uid)}`
    );
    const data = await res.json();
    if (res.ok) setMessages(data.messages || []);
  }, [slug, uid]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadGroup();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadGroup]);

  useEffect(() => {
    if (!uid || !group?.isMember) return;
    void loadMessages();
  }, [uid, group?.isMember, loadMessages]);

  useEffect(() => {
    if (!uid || !group?.isMember || rtConnected) return;
    const t = setInterval(() => void loadMessages(), 15000);
    return () => clearInterval(t);
  }, [uid, group?.isMember, loadMessages, rtConnected]);

  useEffect(() => {
    if (!uid || !group?.isMember) {
      socketRef.current?.emit('leave-group', { slug });
      socketRef.current?.disconnect();
      socketRef.current = null;
      setRtConnected(false);
      return;
    }

    const base =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    const s = io(base, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    socketRef.current = s;

    const onConnect = () => {
      setRtConnected(true);
      s.emit(
        'join-group',
        { slug, userId: uid },
        (ack: { ok?: boolean; error?: string } | undefined) => {
          if (ack && ack.ok === false && ack.error) {
            console.warn('[socket] join-group:', ack.error);
          }
        }
      );
    };

    s.on('connect', onConnect);
    s.on('disconnect', () => setRtConnected(false));
    s.on('connect_error', () => setRtConnected(false));

    s.on('new-message', (incoming: Record<string, unknown>) => {
      appendMessageDeduped(incoming);
    });

    if (s.connected) onConnect();

    return () => {
      s.emit('leave-group', { slug });
      s.disconnect();
      socketRef.current = null;
      setRtConnected(false);
    };
  }, [uid, group?.isMember, slug, appendMessageDeduped]);

  const join = async () => {
    if (!uid) {
      setMsg('Log in to join.');
      return;
    }
    setMsg(null);
    const res = await fetch(`/api/community/groups/${encodeURIComponent(slug)}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Join failed');
      return;
    }
    await loadGroup();
    await loadMessages();
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    const t = body.trim();
    const c = msgCode.trim();
    if (!t && !c && !msgImage) return;
    setMsg(null);

    const url = `/api/community/groups/${encodeURIComponent(slug)}/messages`;

    if (msgImage) {
      const form = new FormData();
      form.set('userId', uid);
      form.set('body', t);
      form.set('code', c);
      form.set('image', msgImage);

      const res = await fetch(url, { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.message || 'Send failed');
        return;
      }
      if (data.message && typeof data.message === 'object') {
        appendMessageDeduped(data.message as Record<string, unknown>);
      } else if (!socketRef.current?.connected) {
        void loadMessages();
      }
      setBody('');
      setMsgCode('');
      setMsgImage(null);
      setFileInputKey((k) => k + 1);
      return;
    }

    // Always use REST for text/code so payload is reliable; server broadcasts over Socket.IO for others.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, body: t, code: c }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Send failed');
      return;
    }
    if (data.message && typeof data.message === 'object') {
      appendMessageDeduped(data.message as Record<string, unknown>);
    } else if (!socketRef.current?.connected) {
      void loadMessages();
    }
    setBody('');
    setMsgCode('');
    setFileInputKey((k) => k + 1);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    setMsg(null);
    const res = await fetch(`/api/community/groups/${encodeURIComponent(slug)}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: uid,
        name: editName.trim(),
        description: editDesc.trim(),
        whoCanPost: editWho,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.message || 'Update failed');
      return;
    }
    loadGroup();
  };

  const isGroupAdmin = group?.myRole === 'group_admin';

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center gap-3 text-violet-700 font-bold">
        <span className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        Loading squad…
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-700 font-bold">Group not found.</p>
        <Link
          href="/community"
          className="inline-flex items-center gap-1 mt-4 text-sm font-black text-violet-600 hover:text-violet-800"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to community
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 text-sm font-black text-violet-700 hover:text-violet-900 mb-6 group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
          arrow_back
        </span>
        Community
      </Link>

      <div className="rounded-2xl border border-violet-200/60 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-violet-500/[0.08] ring-1 ring-slate-200/50 mb-6 overflow-hidden relative">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-black border-2 border-white shadow-xl ring-4 ring-violet-100">
            {group.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={group.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              groupInitials(group.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{group.name}</h1>
        {group.description ? (
          <p className="text-slate-600 mt-2 leading-relaxed">{group.description}</p>
        ) : null}
        <p className="text-xs font-semibold text-slate-500 mt-3 flex flex-wrap gap-x-2 gap-y-1">
          {group.memberCount} members ·{' '}
          {group.whoCanPost === 'admins' ? 'Only admins can send messages' : 'All members can chat'}
        </p>

        {!uid ? (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('openLoginModal'));
              }
            }}
            className="mt-4 text-left text-sm font-black text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl px-4 py-2.5 transition-colors cursor-pointer w-full sm:w-auto"
          >
            Log in to join & chat →
          </button>
        ) : !group.isMember ? (
          <button
            type="button"
            onClick={join}
            className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-sm shadow-lg shadow-violet-500/30 hover:brightness-105 active:scale-[0.99] transition-all"
          >
            Join this squad
          </button>
        ) : (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1.5">
            <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
            Member
          </p>
        )}
          </div>
        </div>
      </div>

      {isGroupAdmin && (
        <div className="rounded-2xl border border-violet-300/50 bg-gradient-to-br from-violet-50 to-fuchsia-50/40 p-6 mb-6 shadow-lg shadow-violet-500/5 ring-1 ring-violet-100">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </span>
            Admin controls
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Edit name, description, and who can send messages. Site admins can read all chats from the admin
            panel.
          </p>
          <form onSubmit={saveSettings} className="mt-4 space-y-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <div>
              <label className="text-xs font-bold text-slate-500">Who can send messages?</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                value={editWho}
                onChange={(e) => setEditWho(e.target.value as 'all' | 'admins')}
              >
                <option value="all">All members</option>
                <option value="admins">Group admins only</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-bold"
            >
              Save settings
            </button>
          </form>
        </div>
      )}

      {msg && (
        <p className="mb-4 text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {msg}
        </p>
      )}

      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-100/80 to-slate-50 min-h-[320px] flex flex-col shadow-xl shadow-slate-400/10 ring-1 ring-slate-200/60 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">chat</span>
            Chat
          </span>
          {group.isMember ? (
            <span
              className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal ${
                rtConnected
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
                  : 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30'
              }`}
              title={
                rtConnected
                  ? 'Socket.IO — messages appear instantly'
                  : 'Reconnecting… updates every ~15s until live'
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${rtConnected ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`}
              />
              {rtConnected ? 'Live' : 'Sync'}
            </span>
          ) : null}
        </div>
        <div
          ref={messagesScrollRef}
          className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[480px] scroll-smooth"
        >
          {!group.isMember ? (
            <p className="text-sm text-slate-600 text-center py-10 font-medium">
              Join the squad to unlock messages.
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center py-10 text-slate-500 font-bold">
              Crickets. Drop the first message 🔥
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-md hover:shadow-lg transition-shadow space-y-2 ring-1 ring-slate-100"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <p className="text-xs font-bold text-primary">
                    {m.user?.name || m.user?.email || 'Member'}
                  </p>
                  <p className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                {m.body ? (
                  <p className="text-slate-800 text-sm whitespace-pre-wrap">{m.body}</p>
                ) : null}
                {m.imageUrl ? (
                  <a
                    href={m.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-slate-100 bg-slate-50 max-w-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.imageUrl} alt="" className="w-full max-h-56 object-contain" />
                  </a>
                ) : null}
                {m.code ? (
                  <pre className="text-xs font-mono text-emerald-100 bg-[#0d1117] rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-words border border-slate-700">
                    <code>{m.code}</code>
                  </pre>
                ) : null}
              </div>
            ))
          )}
        </div>

        {group.isMember && (
          <form
            onSubmit={send}
            className="p-4 border-t border-slate-200 bg-white space-y-3 rounded-b-2xl"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Message · code · pic (pick one+)
            </p>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm shadow-sm focus:ring-2 focus:ring-violet-400/40 outline-none"
              placeholder="Say something…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/20 text-sm font-mono text-[13px] min-h-[72px] bg-[#0d1117] text-emerald-100 placeholder:text-emerald-800/40 focus:ring-2 focus:ring-emerald-500/30 outline-none"
              placeholder="// optional code"
              value={msgCode}
              spellCheck={false}
              onChange={(e) => setMsgCode(e.target.value)}
            />
            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              onChange={(e) => setMsgImage(e.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-700 file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-violet-100 file:font-bold file:text-violet-800"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-black shadow-lg shadow-violet-500/25 hover:brightness-105 active:scale-[0.99] transition-all"
              >
                Send →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
