"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { useI18n } from "@/components/providers/i18n";

type Language = { id: number; code: string; name: string };
type Level = { id: number; language_id: number; name: string };
type Program = { id: number; title?: string; name?: string };
type Meeting = { id: number; title?: string; name?: string };
type Paginated<T> = { data: T[]; meta?: { current_page: number; per_page: number; total: number; last_page: number } };

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="block bg-white border rounded-xl p-4 hover:shadow-sm transition">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-2 text-green-700 text-sm">Manage →</div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { locale, t } = useI18n();
  const languagesQ = useQuery<{ data: Language[] }>({
    queryKey: ["admin-dashboard", "languages", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Language[] }>("/languages", { params: { with_levels: 0, locale } });
      return res.data;
    },
  });

  const levelsQ = useQuery<{ data: Level[] }>({
    queryKey: ["admin-dashboard", "levels", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Level[] }>("/levels", { params: { locale } });
      return res.data;
    },
  });

  const [programsPage, setProgramsPage] = useState(1);
  const [meetingsPage, setMeetingsPage] = useState(1);

  const programsQ = useQuery<Paginated<Program>>({
    queryKey: ["admin-dashboard", "programs", locale, programsPage],
    queryFn: async () => {
      const res = await http.get<Paginated<Program>>("/admin/programs", { params: { per_page: 5, page: programsPage, locale } });
      return res.data as any;
    },
    retry: 1,
  });

  const meetingsQ = useQuery<Paginated<Meeting>>({
    queryKey: ["admin-dashboard", "meetings", locale, meetingsPage],
    queryFn: async () => {
      const res = await http.get<Paginated<Meeting>>("/meetings", { params: { per_page: 5, page: meetingsPage, locale } });
      return res.data as any;
    },
    retry: 1,
  });

  const isLoading = languagesQ.isLoading || levelsQ.isLoading || programsQ.isLoading || meetingsQ.isLoading;
  const hasError = languagesQ.isError || levelsQ.isError || programsQ.isError || meetingsQ.isError;
  const errorMessage =
    (languagesQ.error as Error)?.message ||
    (levelsQ.error as Error)?.message ||
    (programsQ.error as Error)?.message ||
    (meetingsQ.error as Error)?.message ||
    "";

  const languages = languagesQ.data?.data ?? [];
  const levels = levelsQ.data?.data ?? [];
  const programs = programsQ.data?.data ?? [];
  const programsMeta = programsQ.data?.meta;
  const meetings = meetingsQ.data?.data ?? [];
  const meetingsMeta = meetingsQ.data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title", "Admin Dashboard")}</h1>
        <div className="text-sm text-gray-500">{t("admin.dashboard.overview", "Overview")}</div>
      </div>

      {isLoading && (
        <div className="bg-white border rounded-xl p-4">Loading dashboard…</div>
      )}

      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          Failed to load some data. {errorMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("admin.dashboard.stats.languages", "Languages")} value={languages.length} href="/admin/languages" />
        <StatCard label={t("admin.dashboard.stats.levels", "Levels")} value={levels.length} href="/admin/levels" />
        <StatCard label={t("admin.dashboard.stats.programs", "Programs")} value={programs.length} href="/admin/programs" />
        <StatCard label={t("admin.dashboard.stats.meetings", "Meetings")} value={meetings.length} href="/admin/meetings" />
      </div>

      {/* Recent items */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.dashboard.recent_programs", "Recent Programs")}</h2>
            <Link href="/admin/programs" className="text-sm text-green-700 hover:underline">{t("common.view_all", "View all")}</Link>
          </div>
          <ul className="mt-3 divide-y">
            {(programs ?? []).slice(0, 5).map((p: Program) => (
              <li key={p.id} className="py-2 text-sm">
                <span className="font-medium">#{p.id}</span> {p.title || p.name || "(no title)"}
              </li>
            ))}
            {(!programs || programs.length === 0) && (
              <li className="py-2 text-sm text-gray-500">{t("admin.dashboard.no_programs", "No programs found.")}</li>
            )}
          </ul>
          <div className="flex items-center justify-between mt-3 text-sm">
            <button disabled={!programsMeta || programsMeta.current_page <= 1} onClick={() => setProgramsPage((p)=>Math.max(1, p-1))} className="px-3 py-1.5 border rounded disabled:opacity-50">{t("common.prev", "Prev")}</button>
            <div>
              {t("common.page_of", "Page {page} of {pages}").replace("{page}", String(programsMeta?.current_page ?? 1)).replace("{pages}", String(programsMeta?.last_page ?? 1))}
            </div>
            <button disabled={!programsMeta || programsMeta.current_page >= (programsMeta.last_page ?? 1)} onClick={() => setProgramsPage((p)=>p+1)} className="px-3 py-1.5 border rounded disabled:opacity-50">{t("common.next", "Next")}</button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.dashboard.recent_meetings", "Upcoming/Recent Meetings")}</h2>
            <Link href="/admin/meetings" className="text-sm text-green-700 hover:underline">{t("common.view_all", "View all")}</Link>
          </div>
          <ul className="mt-3 divide-y">
            {(meetings ?? []).slice(0, 5).map((m: Meeting) => (
              <li key={m.id} className="py-2 text-sm">
                <span className="font-medium">#{m.id}</span> {m.title || m.name || "(no title)"}
              </li>
            ))}
            {(!meetings || meetings.length === 0) && (
              <li className="py-2 text-sm text-gray-500">{t("admin.dashboard.no_meetings", "No meetings found.")}</li>
            )}
          </ul>
          <div className="flex items-center justify-between mt-3 text-sm">
            <button disabled={!meetingsMeta || meetingsMeta.current_page <= 1} onClick={() => setMeetingsPage((p)=>Math.max(1, p-1))} className="px-3 py-1.5 border rounded disabled:opacity-50">{t("common.prev", "Prev")}</button>
            <div>
              {t("common.page_of", "Page {page} of {pages}").replace("{page}", String(meetingsMeta?.current_page ?? 1)).replace("{pages}", String(meetingsMeta?.last_page ?? 1))}
            </div>
            <button disabled={!meetingsMeta || meetingsMeta.current_page >= (meetingsMeta.last_page ?? 1)} onClick={() => setMeetingsPage((p)=>p+1)} className="px-3 py-1.5 border rounded disabled:opacity-50">{t("common.next", "Next")}</button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">{t("admin.dashboard.quick_actions", "Quick actions")}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/languages" className="px-3 py-2 rounded border hover:bg-gray-50">{t("admin.dashboard.manage_languages", "Manage languages")}</Link>
          <Link href="/admin/levels" className="px-3 py-2 rounded border hover:bg-gray-50">{t("admin.dashboard.manage_levels", "Manage levels")}</Link>
          <Link href="/admin/programs" className="px-3 py-2 rounded border hover:bg-gray-50">{t("admin.dashboard.manage_programs", "Manage programs")}</Link>
          <Link href="/admin/meetings" className="px-3 py-2 rounded border hover:bg-gray-50">{t("admin.dashboard.manage_meetings", "Manage meetings")}</Link>
          <Link href="/admin/settings" className="px-3 py-2 rounded border hover:bg-gray-50">{t("admin.dashboard.settings", "Settings")}</Link>
        </div>
      </div>
    </div>
  );
}
