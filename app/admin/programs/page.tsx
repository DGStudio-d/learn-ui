"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { http } from "@/lib/api";

export default function AdminProgramsPage() {
  const [programId, setProgramId] = useState<string>("");
  const [locale, setLocale] = useState<string>("ar");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const upsertMut = useMutation({
    mutationFn: async () => {
      if (!programId) throw new Error("Program ID required");
      const res = await http.put<{ data: any }>(`/admin/programs/${programId}/translations`, {
        locale,
        title,
        description,
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage("Saved");
      setTimeout(()=>setMessage(""), 1500);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Programs</h1>
      <div className="bg-white border rounded-xl p-4 max-w-xl">
        <h2 className="font-semibold mb-3">Upsert translation</h2>
        {message && <p className="text-green-700 text-sm mb-2">{message}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Program ID</label>
            <input className="w-full border rounded px-3 py-2" value={programId} onChange={(e)=>setProgramId(e.target.value)} placeholder="Enter program id" />
          </div>
          <div>
            <label className="block text-sm mb-1">Locale</label>
            <input className="w-full border rounded px-3 py-2" value={locale} onChange={(e)=>setLocale(e.target.value)} placeholder="e.g. ar, es" />
          </div>
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Translated title" />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2 h-28" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Translated description" />
          </div>
          <button disabled={upsertMut.isPending} onClick={()=>upsertMut.mutate()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {upsertMut.isPending ? "Saving…" : "Save translation"}
          </button>
        </div>
      </div>
    </div>
  );
}
