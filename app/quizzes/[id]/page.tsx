"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";

type Quiz = {
  id: number;
  title?: string;
  description?: string | null;
  type: "file" | "inline";
  pass_score: number;
};

type Question = {
  id: number;
  quiz_id: number;
  question_text: string;
  choices?: string[] | null;
  points?: number;
  audio_path?: string | null;
};

type QuizResponse = { data: Quiz & { questions?: Question[] } };

type AttemptPayload = { answers: Record<number, string | number | boolean> };

type AttemptResponse = { data: { score: number; max: number; passed: boolean; attempt_id: number } };

export default function QuizAttemptPage() {
  const { t, locale } = useI18n();
  const params = useParams<{ id: string }>();
  const quizId = Number(params?.id);
  const qc = useQueryClient();
  const router = useRouter();

  const quizQ = useQuery<QuizResponse>({
    queryKey: ["quiz", quizId, locale],
    queryFn: async () => {
      const res = await http.get<QuizResponse>(`/quizzes/${quizId}`, { params: { with_questions: 1, locale } });
      return res.data;
    },
    enabled: Number.isFinite(quizId) && quizId > 0,
  });

  // Detect authentication state (same key used elsewhere)
  const meQ = useQuery<{ data: any }>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get<{ data: any }>("/user");
      return res.data;
    },
    retry: 1,
  });

  const [answers, setAnswers] = React.useState<Record<number, string | number | boolean>>({});
  const [qIndex, setQIndex] = React.useState(0);

  const submitMutation = useMutation<AttemptResponse, Error, AttemptPayload>({
    mutationFn: async (payload) => {
      const isAuthed = !!meQ.data?.data;
      const url = isAuthed ? `/quizzes/${quizId}/attempts` : `/quizzes/${quizId}/guest-attempt`;
      const res = await http.post<AttemptResponse>(url, payload);
      return res.data;
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: ["quiz", quizId] });
      // If guest, save a lightweight summary so result page can show
      if (!meQ.data?.data) {
        try {
          sessionStorage.setItem(`quiz:${quizId}:result`, JSON.stringify(data.data));
        } catch {}
      }
      router.push(`/quizzes/${quizId}/result`);
    },
  });

  const quiz = quizQ.data?.data;
  const questions = quiz?.questions ?? [];
  const totalPoints = React.useMemo(() => questions.reduce((sum, q) => sum + (q.points ?? 1), 0), [questions]);
  const allAnswered = React.useMemo(() => questions.every(q => {
    const v = answers[q.id];
    return v !== undefined && v !== "";
  }), [answers, questions]);
  const currentQuestion = questions[qIndex];
  const isLast = qIndex === Math.max(0, questions.length - 1);
  const isFirst = qIndex === 0;
  const isCurrentAnswered = currentQuestion ? (answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "") : false;

  // Load autosaved answers when quiz loads
  React.useEffect(() => {
    if (!quizId || !questions.length) return;
    try {
      const raw = localStorage.getItem(`quiz:${quizId}:answers`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setAnswers(parsed);
        }
      }
    } catch {}
  }, [quizId, questions.length]);

  // Autosave answers
  React.useEffect(() => {
    if (!quizId) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`quiz:${quizId}:answers`, JSON.stringify(answers));
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [answers, quizId]);

  const onChoiceChange = (qid: number, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ answers });
  };

  const isAdmin = !!meQ.data?.data && (meQ.data?.data.role === "admin" || meQ.data?.data.roles?.includes?.("admin"));
  const dashboardHref = isAdmin ? "/admin" : "/student";

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{quiz?.title || t("programs.quizzes", "Program Quizzes")}</h1>
        <Link href={dashboardHref} className="text-sm text-green-700 hover:underline">{t("common.back_to_dashboard", "Back to dashboard")}</Link>
      </div>

      {quizQ.isLoading && <Alert variant="info">{t("student.dashboard.loading", "Loading dashboard…")}</Alert>}
      {quizQ.isError && <Alert variant="error">{t("student.dashboard.load_error", "Failed to load some data.")}</Alert>}

      {quiz && (
        <form onSubmit={onSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              {quiz.description && (
                <div className="text-sm text-gray-700">{quiz.description}</div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Pass requirement and guest notice */}
              <div className="text-sm text-gray-600">
                {t("quiz.pass_required", "Pass requires at least {score} points.").replace("{score}", String(quiz.pass_score))}
                {totalPoints ? ` (${t("quiz.total_points", "Total points")}: ${totalPoints})` : ""}
              </div>
              {!meQ.data?.data && (
                <Alert variant="warning">{t("quiz.guest_notice", "You are attempting as a guest. Your result won't be linked to an account.")}</Alert>
              )}

              {/* Progress bar */}
              {questions.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">{t("quiz.progress", "Question {n} of {total}").replace("{n}", String(qIndex + 1)).replace("{total}", String(questions.length))}</div>
                  <Progress value={((qIndex + 1) / Math.max(1, questions.length)) * 100} />
                </div>
              )}

              {/* Animated question */}
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="border rounded p-3"
                  >
                    <div className="font-medium">{currentQuestion.question_text}</div>
                    {currentQuestion.audio_path && (
                      <audio className="mt-2" controls src={`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/storage/${currentQuestion.audio_path}`}></audio>
                    )}

                    {/* choices */}
                    {Array.isArray(currentQuestion.choices) && currentQuestion.choices?.length ? (
                      <div className="mt-2 grid gap-2">
                        {currentQuestion.choices.map((choice, idx) => {
                          const currentVal = answers[currentQuestion.id];
                          const selected = Array.isArray(currentVal) ? currentVal.includes(choice) : currentVal === choice;
                          return (
                            <label key={idx} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                name={`q_${currentQuestion.id}`}
                                value={choice}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setAnswers((prev) => {
                                    const prevVal = prev[currentQuestion.id];
                                    let arr = Array.isArray(prevVal) ? [...prevVal] : (prevVal !== undefined && prevVal !== "" ? [prevVal] : []);
                                    if (checked) {
                                      if (!arr.includes(choice)) arr.push(choice);
                                    } else {
                                      arr = arr.filter((c) => c !== choice);
                                    }
                                    return { ...prev, [currentQuestion.id]: arr.length <= 1 ? (arr[0] ?? "") : arr };
                                  });
                                }}
                                checked={!!selected}
                                disabled={submitMutation.isSuccess}
                              />
                              <span>{choice}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="mt-2 w-full border rounded px-3 py-2 text-sm"
                        placeholder={t("student.dashboard.stats.browse", "Answer") as string}
                        value={(answers[currentQuestion.id] as string) || ""}
                        onChange={(e) => onChoiceChange(currentQuestion.id, e.target.value)}
                        disabled={submitMutation.isSuccess}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {!isFirst && (
                  <Button type="button" variant="outline" onClick={() => setQIndex((i)=>Math.max(0, i-1))}>{t("common.prev", "Prev")}</Button>
                )}
                {!isLast && (
                  <Button type="button" disabled={!isCurrentAnswered} onClick={() => setQIndex((i)=>Math.min(questions.length-1, i+1))}>{t("common.next", "Next")}</Button>
                )}
                {isLast && (
                  <Button type="submit" disabled={submitMutation.isPending || !allAnswered}>
                    {submitMutation.isPending
                      ? t("common.saving", "Saving…")
                      : (!!meQ.data?.data
                          ? t("quiz.submit", "Submit")
                          : t("quiz.submit_guest", "Submit as guest"))}
                  </Button>
                )}
                {!allAnswered && (
                  <div className="text-xs text-gray-600">{t("quiz.answer_all", "Please answer all questions before submitting.")}</div>
                )}
              </div>

              {/* Result alerts */}
              {submitMutation.isSuccess && (
                <Alert variant={submitMutation.data?.data?.passed ? "success" : "error"}>
                  {submitMutation.data?.data?.passed
                    ? t("quiz.result_passed", "You passed!")
                    : t("quiz.result_failed", "You did not pass.")}
                  {` — ${submitMutation.data?.data?.score} / ${submitMutation.data?.data?.max}`}
                </Alert>
              )}
              {submitMutation.isError && (
                <Alert variant="error">{t("common.save_error", "Failed to save changes. Please try again.")}</Alert>
              )}
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
