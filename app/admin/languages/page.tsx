"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";

type Language = { id: number; code: string; name: string; active: boolean };

export default function AdminLanguagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);
  const [locale, setLocale] = useState<string>("ar");
  const [name, setName] = useState<string>("");

  const { data, isLoading, isError, error } = useQuery<{ data: Language[] }>({
    queryKey: ["admin-languages"],
    queryFn: async () => {
      const res = await http.get<{ data: Language[] }>("/languages", { params: { with_levels: 0 } });
      return res.data;
    },
  });

  const upsertMut = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error("No language selected");
      const res = await http.put<{ data: any }>(`/admin/languages/${selected}/translations`, { locale, name });
      return res.data;
    },
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["admin-languages"] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Languages</h1>
      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">{(error as Error)?.message}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">All languages</h2>
          <ul className="divide-y">
            {(data?.data ?? []).map((l) => (
              <li key={l.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.name} ({l.code})</div>
                  <div className="text-xs text-gray-500">id: {l.id}</div>
                </div>
                <button onClick={() => setSelected(l.id)} className={`px-3 py-1.5 rounded border ${selected===l.id?"bg-green-600 text-white border-green-600":"hover:bg-gray-50"}`}>
                  {selected === l.id ? "Selected" : "Select"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Upsert translation</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Language ID</label>
              <input className="w-full border rounded px-3 py-2" value={selected ?? ""} onChange={(e)=>setSelected(Number(e.target.value)||null)} placeholder="Select from the list or type id" />
            </div>
            <div>
              <label className="block text-sm mb-1">Locale</label>
              <input className="w-full border rounded px-3 py-2" value={locale} onChange={(e)=>setLocale(e.target.value)} placeholder="e.g. ar, es" />
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Translated language name" />
            </div>
            <button disabled={upsertMut.isPending} onClick={()=>upsertMut.mutate()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {upsertMut.isPending ? "Saving…" : "Save translation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
