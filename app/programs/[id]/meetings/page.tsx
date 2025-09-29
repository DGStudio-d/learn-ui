"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useI18n } from "@/components/providers/i18n";
import { Spinner } from "@/components/ui/spinner";

type Meeting = { id: number; title: string; link: string; starts_at: string; timezone: string; description?: string | null };

type MeetingsResponse = { data: Meeting[] };

export default function ProgramMeetingsPage() {
  const params = useParams<{ id: string }>();
  const programId = params?.id;
  const { locale, t } = useI18n();

  const formatMeetingDate = (iso: string) => {
    try {
      const dt = new Date(iso);
      return new Intl.DateTimeFormat(locale || "en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(dt) + " UTC";
    } catch {
      return iso;
    }
  };

  const meetingsQ = useQuery<MeetingsResponse>({
    queryKey: ["program", programId, "meetings"],
    enabled: !!programId,
    queryFn: async () => {
      const res = await http.get<MeetingsResponse>(`/programs/${programId}/meetings`);
      return res.data;
    },
    retry: 1,
  });

  const meetings = meetingsQ.data?.data ?? [];

  return (
    <Container className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t("meetings.title", "Program Meetings")}</h1>
      {meetingsQ.isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/80">
          <Spinner />
          <span>{t("meetings.loading", "Loading…")}</span>
        </div>
      )}
      {meetingsQ.isError && <Alert variant="error">{t("meetings.load_error", (meetingsQ.error as Error)?.message || "Failed to load meetings.")}</Alert>}

      <div className="grid grid-cols-1 gap-4 max-w-3xl">
        {meetings.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm text-gray-600">{formatMeetingDate(m.starts_at)} ({m.timezone})</div>
                </div>
                <a className="text-[var(--primary)] hover:underline" href={m.link} target="_blank" rel="noreferrer">{t("meetings.join", "Join")}</a>
              </div>
              {m.description && <div className="mt-2 text-sm text-[var(--foreground)]/80">{m.description}</div>}
            </CardContent>
          </Card>
        ))}
        {meetings.length === 0 && !meetingsQ.isLoading && (
          <div className="text-sm text-[var(--foreground)]/60">{t("meetings.empty", "No meetings yet.")}</div>
        )}
      </div>
    </Container>
  );
}
