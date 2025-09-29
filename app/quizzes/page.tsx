"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

 type Quiz = {
  id: number;
  program_id: number;
  title?: string;
  description?: string | null;
  type: "file" | "inline";
  pass_score: number;
  guest_access: boolean;
};

type QuizzesResponse = { data: Quiz[] };

export default function QuizzesListPage() {
  const { t } = useI18n();

  const quizzesQ = useQuery<QuizzesResponse>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await http.get<QuizzesResponse>("/quizzes");
      return res.data;
    },
    retry: 1,
  });

  const quizzes = quizzesQ.data?.data ?? [];

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("programs.quizzes", "Program Quizzes")}</h1>
        <Link href="/student" className="text-sm text-green-700 hover:underline">{t("common.back_to_dashboard", "Back to dashboard")}</Link>
      </div>

      {quizzesQ.isLoading && <Alert>{t("student.dashboard.loading", "Loading dashboard…")}</Alert>}
      {quizzesQ.isError && <Alert variant="error">{t("student.dashboard.load_error", "Failed to load some data.")}</Alert>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((q) => (
          <Card key={q.id} className="flex flex-col">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 truncate">{q.title || (t("programs.quizzes", "Quiz") + " #" + q.id)}</div>
                <div className="flex items-center gap-2">
                  <Badge>{q.type.toUpperCase()}</Badge>
                  {q.guest_access && <Badge variant="secondary">Guest</Badge>}
                </div>
              </div>
              {q.description && (
                <div className="text-sm text-gray-600 line-clamp-3">{q.description}</div>
              )}
              <div className="text-xs text-gray-500">{t("programs.pass_score", "Pass score")}: {q.pass_score}</div>
              <div className="mt-1">
                <Link href={`/quizzes/${q.id}`}>
                  <Button>{t("student.dashboard.stats.browse", "Start Quiz")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {quizzes.length === 0 && !quizzesQ.isLoading && (
          <div className="col-span-full text-sm text-gray-500">{t("student.dashboard.no_programs", "No programs yet. Explore programs to get started.")}</div>
        )}
      </div>
    </Container>
  );
}
