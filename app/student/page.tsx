"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { useI18n } from "@/components/providers/i18n";
import { Skeleton } from "@/components/ui/skeleton";

type Program = { id: number; title?: string; name?: string };
type Meeting = { id: number; title?: string; name?: string; starts_at?: string };

type Me = { id: number; name?: string; email?: string };

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  const { t } = useI18n();
  return (
    <Link href={href} className="block bg-[var(--card)] border-[var(--border)] border rounded-xl p-4 hover:shadow-sm transition">
      <div className="text-sm text-[var(--foreground)]/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{value}</div>
      <div className="mt-2 text-[var(--primary)] text-sm">{t("common.open", "Open")} →</div>
    </Link>
  );
}

export default function StudentDashboardPage() {
  const { locale, t } = useI18n();
  const meQ = useQuery<Me>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get<Me>("/user");
      return res.data;
    },
  });

  // If your API supports enrolled-only endpoints, you can add params like { mine: 1 }
  const programsQ = useQuery<{ data: Program[] }>({
    queryKey: ["student-dashboard", "programs", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Program[] }>("/programs", { params: { limit: 5, locale } });
      return res.data;
    },
    retry: 1,
  });

  const meetingsQ = useQuery<{ data: Meeting[] }>({
    queryKey: ["student-dashboard", "meetings", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Meeting[] }>("/meetings", { params: { limit: 5, locale } });
      return res.data;
    },
    retry: 1,
  });

  const isLoading = meQ.isLoading || programsQ.isLoading || meetingsQ.isLoading;
  const hasError = meQ.isError || programsQ.isError || meetingsQ.isError;
  const errorMessage = (meQ.error as Error)?.message || (programsQ.error as Error)?.message || (meetingsQ.error as Error)?.message || "";

  const me = meQ.data;
  const programs = programsQ.data?.data ?? [];
  const meetings = meetingsQ.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("student.dashboard.title", "Student Dashboard")}</h1>
        <div className="text-sm text-[var(--foreground)]/60">{t("student.dashboard.welcome", "Welcome")} {me?.name ? me.name : ""}</div>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {/* Stats skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[var(--card)] border-[var(--border)] border rounded-xl p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 mt-3" />
                <Skeleton className="h-4 w-16 mt-3" />
              </div>
            ))}
          </div>

          {/* Panels skeleton */}
          <div className="grid lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-[var(--card)] border-[var(--border)] border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-3 space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {hasError && (
        <div className="rounded-xl p-4 border text-[var(--error)] border-[color-mix(in_srgb,_var(--error)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--error)_8%,_transparent)]">{t("student.dashboard.load_error", "Failed to load some data.")} {errorMessage}</div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label={t("student.dashboard.stats.my_programs", "My Programs")} value={programs.length} href="/programs" />
        <StatCard label={t("student.dashboard.stats.my_meetings", "My Meetings")} value={meetings.length} href="/programs" />
        <StatCard label={t("student.dashboard.stats.teachers", "Teachers")} value={t("student.dashboard.stats.browse", "Browse")} href="/teachers" />
      </div>

      {/* Quick start */}
      <div className="bg-[var(--card)] border-[var(--border)] border rounded-xl p-4">
        <h2 className="font-semibold mb-3">{t("student.dashboard.quick_start", "Quick start")}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/programs" className="px-3 py-2 rounded border border-[var(--border)] hover:bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]">{t("student.dashboard.explore_programs", "Explore programs")}</Link>
          <Link href="/teachers" className="px-3 py-2 rounded border border-[var(--border)] hover:bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]">{t("student.dashboard.find_teacher", "Find a teacher")}</Link>
          <Link href="/contact" className="px-3 py-2 rounded border border-[var(--border)] hover:bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]">{t("student.dashboard.contact_support", "Contact support")}</Link>
        </div>
      </div>

      {/* Recent items */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border-[var(--border)] border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("student.dashboard.recent_programs", "Recent Programs")}</h2>
            <Link href="/programs" className="text-sm text-[var(--primary)] hover:underline">{t("common.view_all", "View all")}</Link>
          </div>
          <ul className="mt-3 divide-y">
            {(programs ?? []).slice(0, 5).map((p) => (
              <li key={p.id} className="py-2 text-sm">
                <span className="font-medium">#{p.id}</span> {p.title || p.name || t("common.no_title", "(no title)")}
              </li>
            ))}
            {(!programs || programs.length === 0) && (
              <li className="py-2 text-sm text-[var(--foreground)]/60">{t("student.dashboard.no_programs", "No programs yet. Explore programs to get started.")}</li>
            )}
          </ul>
        </div>

        <div className="bg-[var(--card)] border-[var(--border)] border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("student.dashboard.upcoming_meetings", "Upcoming Meetings")}</h2>
            <Link href="/programs" className="text-sm text-[var(--primary)] hover:underline">{t("common.view_all", "View all")}</Link>
          </div>
          <ul className="mt-3 divide-y">
            {(meetings ?? []).slice(0, 5).map((m) => (
              <li key={m.id} className="py-2 text-sm">
                <span className="font-medium">#{m.id}</span> {m.title || m.name || t("common.no_title", "(no title)")}
              </li>
            ))}
            {(!meetings || meetings.length === 0) && (
              <li className="py-2 text-sm text-[var(--foreground)]/60">{t("student.dashboard.no_meetings", "No meetings scheduled.")}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
