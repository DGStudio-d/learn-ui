"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { useI18n } from "@/components/providers/i18n";

type Level = { id: number; language_id: number; name: string; order: number };
 type Language = { id: number; code: string; name: string; active: boolean; levels?: Level[] };

export default function LanguagesGrid() {
  const { locale } = useI18n();
  const { data, isLoading, isError, error } = useQuery<{ data: Language[] }>({
    queryKey: ["landing-languages", locale],
    queryFn: async () => {
      const res = await http.get<{ data: Language[] }>("/languages", {
        params: { locale, with_levels: 1, active: true },
      });
      return res.data;
    },
  });

  const items = data?.data ?? [];

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          {locale === "ar" ? "اللغات المتاحة" : locale === "es" ? "Idiomas disponibles" : "Available languages"}
        </h2>
        {isLoading && <p className="text-center">Loading…</p>}
        {isError && <p className="text-center text-red-600">{(error as Error)?.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((lang) => (
            <div key={lang.id} className="bg-white border rounded p-5 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500">{lang.code.toUpperCase()}</p>
                <p className="font-semibold text-lg">{lang.name}</p>
                {lang.levels?.length ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {(locale === "ar" ? "المستويات" : locale === "es" ? "Niveles" : "Levels") + ": "}
                    {lang.levels.map((l) => l.name).join(", ")}
                  </p>
                ) : null}
              </div>
              <div className="mt-4">
                <Link href={`/teachers/${lang.id}`} className="border border-green-600 text-green-700 px-3 py-1.5 rounded hover:bg-green-50 text-sm">
                  {locale === "ar" ? "تعرّف على معلمينا" : locale === "es" ? "Ver profesores" : "Meet our teachers"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
