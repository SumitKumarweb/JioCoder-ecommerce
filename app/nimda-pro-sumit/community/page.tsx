'use client';

import { useCallback, useEffect, useState } from 'react';

type GroupRow = {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  memberCount: number;
  messageCount: number;
  whoCanPost: string;
};

type Msg = {
  id: string;
  body: string;
  code?: string;
  imageUrl?: string;
  createdAt: string;
  user: { id: string; name?: string; email: string } | null;
};

type PostRow = {
  id: string;
  body: string;
  code?: string;
  resourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
  user: { id: string; name?: string; email: string } | null;
};

type StatusRow = {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  expiresAt: string;
  user: { id: string; name?: string; email: string } | null;
};

export default function AdminCommunityPage() {
  const [tab, setTab] = useState<'groups' | 'feed' | 'statuses'>('groups');
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [statuses, setStatuses] = useState<StatusRow[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupRow | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  const loadGroups = useCallback(async () => {
    const res = await fetch('/api/admin/community/groups');
    const data = await res.json();
    if (res.ok) setGroups(data.groups || []);
  }, []);

  const loadFeed = useCallback(async () => {
    const res = await fetch('/api/admin/community/feed');
    const data = await res.json();
    if (res.ok) setPosts(data.posts || []);
  }, []);

  const loadStatuses = useCallback(async () => {
    const res = await fetch('/api/admin/community/statuses');
    const data = await res.json();
    if (res.ok) setStatuses(data.statuses || []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([loadGroups(), loadFeed(), loadStatuses()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadGroups, loadFeed, loadStatuses]);

  const openGroupMessages = async (g: GroupRow) => {
    setSelectedGroup(g);
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/admin/community/groups/${g.id}/messages?limit=300`);
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
      else setMessages([]);
    } finally {
      setMsgLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Coder Community (moderation)</h1>
      <p className="text-sm text-slate-600 mb-6">
        Read all groups, group chats, public feed posts, and active 24h statuses. Group members only see their
        group chat; group admins can manage settings on the public site.
      </p>

      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {(['groups', 'feed', 'statuses'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : tab === 'groups' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 font-semibold text-slate-800">All groups</div>
            <ul className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
              {groups.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => openGroupMessages(g)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3 items-center ${
                      selectedGroup?.id === g.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-slate-200 border border-slate-100">
                      {g.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {g.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{g.name}</div>
                      <div className="text-xs text-slate-500">
                        {g.memberCount} members · {g.messageCount} messages · {g.slug}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {groups.length === 0 && <p className="p-4 text-sm text-slate-500">No groups yet.</p>}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white min-h-[320px] flex flex-col">
            <div className="px-4 py-2 bg-slate-50 font-semibold text-slate-800">
              {selectedGroup ? `Chat: ${selectedGroup.name}` : 'Select a group'}
            </div>
            <div className="flex-1 p-4 overflow-y-auto max-h-[480px] space-y-3">
              {msgLoading ? (
                <p className="text-sm text-slate-500">Loading messages…</p>
              ) : !selectedGroup ? (
                <p className="text-sm text-slate-500">Choose a group to read all messages.</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-slate-500">No messages in this group.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded border border-slate-100 p-2 text-sm space-y-1">
                    <div>
                      <span className="font-bold text-slate-800">
                        {m.user?.name || m.user?.email || 'User'}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {m.body ? <p className="text-slate-700 whitespace-pre-wrap">{m.body}</p> : null}
                    {m.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.imageUrl}
                        alt=""
                        className="max-w-xs max-h-40 object-contain rounded border border-slate-100"
                      />
                    ) : null}
                    {m.code ? (
                      <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                        {m.code}
                      </pre>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : tab === 'feed' ? (
        <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {posts.map((p) => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="text-xs font-bold text-blue-700">
                {p.user?.name || p.user?.email}
              </div>
              <p className="text-[11px] text-slate-400">{new Date(p.createdAt).toLocaleString()}</p>
              {p.body ? <p className="text-slate-800 whitespace-pre-wrap text-sm">{p.body}</p> : null}
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt=""
                  className="max-w-full max-h-48 object-contain rounded border border-slate-100"
                />
              ) : null}
              {p.code ? (
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                  {p.code}
                </pre>
              ) : null}
              {p.resourceUrl ? (
                <a href={p.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 break-all">
                  {p.resourceUrl}
                </a>
              ) : null}
            </div>
          ))}
          {posts.length === 0 && <p className="p-6 text-sm text-slate-500">No public posts.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50"
            >
              <p className="text-xs font-bold text-violet-800">
                {s.user?.name || s.user?.email}
              </p>
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt=""
                  className="w-full max-h-40 object-cover rounded-lg mt-2 border border-violet-100"
                />
              ) : null}
              <p className="text-sm text-slate-800 mt-2">{s.text}</p>
              <p className="text-[10px] text-slate-500 mt-2">
                Until {new Date(s.expiresAt).toLocaleString()}
              </p>
            </div>
          ))}
          {statuses.length === 0 && <p className="text-sm text-slate-500">No active statuses.</p>}
        </div>
      )}
    </div>
  );
}
