"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n";

type Settings = {
  allow_guest_languages: boolean;
  allow_guest_teachers: boolean;
  allow_guest_quizzes: boolean;
};

type GetSettingsResponse = { data: Settings };

type UpdateSettingsPayload = Partial<Settings>;

type UpdateSettingsResponse = { data: UpdateSettingsPayload };

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-800">{label}</span>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { t } = useI18n();

  const settingsQ = useQuery<GetSettingsResponse>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await http.get<GetSettingsResponse>("/admin/settings");
      return res.data;
    },
  });

  const mutation = useMutation<UpdateSettingsResponse, Error, UpdateSettingsPayload>({
    mutationFn: async (payload) => {
      const res = await http.patch<UpdateSettingsResponse>("/admin/settings", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });

  const settings = settingsQ.data?.data;

  const handleToggle = (key: keyof Settings, value: boolean) => {
    mutation.mutate({ [key]: value } as UpdateSettingsPayload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("admin.settings.title", "Admin Settings")}</h1>
        <Link href="/admin" className="text-sm text-green-700 hover:underline">{t("common.back_to_dashboard", "Back to dashboard")}</Link>
      </div>

      {settingsQ.isLoading && <div className="bg-white border rounded-xl p-4">{t("admin.settings.loading", "Loading settings…")}</div>}
      {settingsQ.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{t("admin.settings.load_error", "Failed to load settings.")}</div>
      )}

      {settings && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">{t("admin.settings.guest_access", "Guest Access")}</h2>
          <div className="divide-y">
            <Toggle
              label={t("admin.settings.allow_guest_languages", "Allow guests to view languages")}
              checked={!!settings.allow_guest_languages}
              onChange={(v) => handleToggle("allow_guest_languages", v)}
            />
            <Toggle
              label={t("admin.settings.allow_guest_teachers", "Allow guests to view teachers")}
              checked={!!settings.allow_guest_teachers}
              onChange={(v) => handleToggle("allow_guest_teachers", v)}
            />
            <Toggle
              label={t("admin.settings.allow_guest_quizzes", "Allow guests to attempt quizzes")}
              checked={!!settings.allow_guest_quizzes}
              onChange={(v) => handleToggle("allow_guest_quizzes", v)}
            />
          </div>

          {mutation.isPending && (
            <div className="mt-3 text-sm text-gray-500">{t("common.saving", "Saving…")}</div>
          )}
          {mutation.isError && (
            <div className="mt-3 text-sm text-red-600">{t("common.save_error", "Failed to save changes. Please try again.")}</div>
          )}
          {mutation.isSuccess && (
            <div className="mt-3 text-sm text-green-700">{t("common.saved", "Saved.")}</div>
          )}
        </div>
      )}
    </div>
  );
}
