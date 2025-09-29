"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function QuizResultPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const quizId = Number(params?.id);

  // Attempt to load authed student latest attempt
  const latestQ = useQuery<{ data: { attempt: any; quiz: any } }>({
    queryKey: ["quiz", quizId, "latest"],
    queryFn: async () => {
      const res = await http.get<{ data: { attempt: any; quiz: any } }>(`/quizzes/${quizId}/my-latest-attempt`);
      return res.data;
    },
    enabled: Number.isFinite(quizId) && quizId > 0,
    retry: 1,
  });

  // If unauthorized (guest), read summary from sessionStorage
  const guestSummary = React.useMemo(() => {
    try {
      const raw = sessionStorage.getItem(`quiz:${quizId}:result`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [quizId]);

  const data = latestQ.data?.data;
  const quiz = data?.quiz;
  const attempt = data?.attempt;
  const isGuestView = !data && !!guestSummary;

  const score = attempt?.score ?? guestSummary?.score;
  const max = attempt?.max ?? guestSummary?.max;
  const passed = attempt?.passed ?? guestSummary?.passed;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("programs.quizzes", "Quiz Results")}</h1>
        <Link href="/quizzes" className="text-sm text-green-700 hover:underline">{t("common.view_all", "View all")}</Link>
      </div>

      {(latestQ.isLoading && !isGuestView) && (<Alert>{t("student.dashboard.loading", "Loading dashboard…")}</Alert>)}
      {latestQ.isError && !isGuestView && (<Alert variant="error">{t("student.dashboard.load_error", "Failed to load some data.")}</Alert>)}

      {typeof score === 'number' && typeof max === 'number' && (
        <Alert variant={passed ? 'success' : 'error'}>
          <div className="font-semibold">{passed ? t("quiz.result_passed", "You passed!") : t("quiz.result_failed", "You did not pass.")}</div>
          <div className="text-sm">{t("programs.pass_score", "Pass score")}: {score} / {max}</div>
        </Alert>
      )}

      {/* Breakdown only when we have full quiz + answers (authed) */}
      {quiz && attempt && (
        <Card>
          <CardContent className="divide-y p-0">
            {quiz.questions.map((q: any) => {
              const given = attempt.answers?.[q.id];
              const correct = q.correct_answer;
              const givenStr = Array.isArray(given) ? given.join(", ") : (given ?? "");
              let correctStr = correct;
              try {
                const d = JSON.parse(correct);
                if (Array.isArray(d)) correctStr = d.join(", ");
              } catch {}
              const ok = (function(){
                try {
                  const d = JSON.parse(correct);
                  if (Array.isArray(d)) {
                    const a = Array.isArray(given) ? given : [given];
                    const aSet = (a || []).map(String).sort().join("|");
                    const dSet = (d || []).map(String).sort().join("|");
                    return aSet === dSet;
                  }
                } catch {}
                return String(given) === String(correct);
              })();
              return (
                <div key={q.id} className="p-4 text-sm">
                  <div className="font-medium text-gray-900">{q.question_text}</div>
                  <div className="mt-1 text-gray-700">{t("quiz.chosen", "Your answer")}: {givenStr || t("quiz.empty", "(no answer)")}</div>
                  <div className="text-gray-700">{t("quiz.correct", "Correct answer")}: {String(correctStr ?? "")}</div>
                  <div className={`mt-1 ${ok ? 'text-green-700' : 'text-red-700'}`}>{ok ? '✓' : '✗'}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {isGuestView && (
        <Alert variant="warning">
          <div>{t("quiz.guest_cta", "Register to save your progress and see detailed results.")}</div>
          <div className="mt-2">
            <Link href="/auth/register"><Button>{t("nav.register", "Register")}</Button></Link>
          </div>
        </Alert>
      )}
    </div>
  );
}
