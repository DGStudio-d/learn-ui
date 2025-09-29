"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

type Teacher = {
  id: number;
  name: string;
  image_url?: string | null;
};

export default function TeachersByLanguagePage() {
  const params = useParams<{ languageId: string }>();
  const languageId = params.languageId;
  const { data, isLoading, isError, error } = useQuery<{ data: Teacher[] }>({
    queryKey: ["teachersByLanguage", languageId],
    enabled: !!languageId,
    queryFn: async () => {
      const res = await http.get<{ data: Teacher[] }>(`/languages/${languageId}/teachers`);
      return res.data;
    },
  });

  const teachers = data?.data ?? [];

  return (
    <Container className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Teachers</h1>
      {isLoading && <Alert>Loading…</Alert>}
      {isError && <Alert variant="error">{(error as Error)?.message}</Alert>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4 flex items-center gap-4">
              {t.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image_url} alt={t.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{t.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {teachers.length === 0 && !isLoading && (
          <div className="col-span-full text-sm text-gray-500">No teachers found.</div>
        )}
      </div>
    </Container>
  );
}
