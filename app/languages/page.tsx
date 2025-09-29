"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { useI18n } from "@/components/providers/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Globe, Users, BookOpen, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Level = { id: number; language_id: number; name: string; order: number };
type Language = { id: number; code: string; name: string; active: boolean; levels?: Level[] };

export default function LanguagesPage() {
  const { t, locale } = useI18n();
  const { data, isLoading, isError, error } = useQuery<{ data: Language[] }>({
    queryKey: ["languages", { locale, with_levels: 1 }],
    queryFn: async () => {
      const res = await http.get<{ data: Language[] }>("/languages", {
        params: { locale, with_levels: 1 },
      });
      return res.data;
    },
  });

  const items = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
            {t("languages.title", "Available Languages")}
          </h1>
          <p className="text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto">
            {t("languages.subtitle", "Choose from our wide selection of languages and start your learning journey today.")}
          </p>
        </motion.div>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-full">
                  <Card className="h-full border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-12" rounded="lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-16 mt-2" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-3 w-48" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {isError && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Alert variant="error">{(error as Error)?.message}</Alert>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[color-mix(in_srgb,_var(--primary)_15%,_transparent)]">
                        <Globe className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-[var(--foreground)]">
                          {lang.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {lang.code.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lang.levels && lang.levels.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-[var(--foreground)]/70">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{t("languages.levels_available", "Available levels")}:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {lang.levels.map((level) => (
                          <Badge key={level.id} variant="outline" className="text-xs">
                            {level.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-[var(--foreground)]/70">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{t("languages.teachers_available", "Expert teachers available")}</span>
                  </div>
                  
                  <div className="pt-2">
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/teachers/${lang.id}`}>
                        {t("languages.view_teachers", "View Teachers")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {items.length === 0 && !isLoading && !isError && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Globe className="h-16 w-16 text-[var(--foreground)]/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              {t("languages.no_languages", "No languages available")}
            </h3>
            <p className="text-[var(--foreground)]/70 mb-6">
              {t("languages.no_languages_desc", "We're working on adding more languages. Check back soon!")}
            </p>
            <Button asChild>
              <Link href="/contact">
                {t("languages.contact_us", "Contact us for more info")}
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
