"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { http, getToken } from "@/lib/api";

// Guards student routes by verifying the current user and role
export default function StudentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = typeof window !== "undefined" ? getToken() : null;
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["user", token],
    queryFn: async () => {
      const res = await http.get<any>("/user");
      return res.data;
    },
    retry: 1,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  useEffect(() => {
    if (isLoading) return;
    // If no token, redirect to login
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    const user = data;
    const isStudent = user && (user.role === "student" || user.roles?.includes?.("student"));
    if (!isStudent) {
      router.replace("/auth/login");
    }
  }, [isLoading, data, router, token]);

  if (isLoading) return <div className="p-6">Checking permissions…</div>;
  if (isError) return <div className="p-6 text-red-600">Unable to verify permissions.</div>;
  return <>{children}</>;
}
