'use client';

import { useEffect, useMemo, useState } from "react";

type PincodeRow = {
  _id: string;
  code: string;
  enabled: boolean;
  updatedAt?: string;
  createdAt?: string;
};

function isValidIndianPincode(code: string) {
  return /^\d{6}$/.test(code);
}

export default function AdminPincodePage() {
  const [rows, setRows] = useState<PincodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return rows;
    return rows.filter((r) => r.code.includes(q));
  }, [rows, search]);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/pincodes", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load pincodes:", e);
      setMessage("Failed to load pincodes. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const code = newCode.trim();
    if (!isValidIndianPincode(code)) {
      setMessage("Enter a valid 6-digit PIN code.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, enabled: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed: ${res.status}`);
      }
      setNewCode("");
      await load();
      setMessage("Pincode added.");
    } catch (e: any) {
      console.error("Failed to add pincode:", e);
      setMessage(e?.message || "Failed to add pincode.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (code: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/pincodes?code=${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed: ${res.status}`);
      }
      await load();
      setMessage("Pincode removed.");
    } catch (e: any) {
      console.error("Failed to remove pincode:", e);
      setMessage(e?.message || "Failed to remove pincode.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (row: PincodeRow) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: row.code, enabled: !row.enabled }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed: ${res.status}`);
      }
      await load();
    } catch (e: any) {
      console.error("Failed to toggle pincode:", e);
      setMessage(e?.message || "Failed to update pincode.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Serviceable Pincodes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage pincodes used for delivery availability checks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-56"
              placeholder="Search pincode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm flex-1 sm:w-44"
                placeholder="Add 6-digit PIN"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
              />
              <button
                onClick={add}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 text-sm font-semibold text-slate-700">{message}</div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Pincode List</h2>
          <button
            onClick={load}
            disabled={loading || saving}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-slate-600">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-slate-600">No pincodes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left px-6 py-3 font-bold">Pincode</th>
                  <th className="text-left px-6 py-3 font-bold">Status</th>
                  <th className="text-right px-6 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-semibold text-slate-900">{row.code}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          row.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {row.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleEnabled(row)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {row.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => remove(row.code)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg border border-red-200 font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500">
        Note: This page updates the delivery check list used on product pages via `/api/pincodes`.
      </div>
    </div>
  );
}

