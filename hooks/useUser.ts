"use client";

import { useQuery } from "@tanstack/react-query";
import { http, getToken } from "@/lib/api";

export type AppUser = {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  roles?: any[];
  [key: string]: any;
} | null;

function hasRole(user: AppUser, roleName: string): boolean {
  if (!user) return false;
  if (user.role && String(user.role).toLowerCase() === roleName) return true;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  // roles might be an array of strings or objects with name
  return roles.some((r) => {
    if (!r) return false;
    if (typeof r === "string") return r.toLowerCase() === roleName;
    const n = (r.name || r.role || r.title || "").toString().toLowerCase();
    return n === roleName;
  });
}

export default function useUser() {
  const token = typeof window !== "undefined" ? getToken() : null;
  const query = useQuery<AppUser>({
    queryKey: ["user", token],
    queryFn: async () => {
      const res = await http.get<AppUser>("/user");
      return res.data as AppUser;
    },
    retry: 1,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  const user = query.data ?? null;
  const isAuthed = !!user;
  const isAdmin = hasRole(user, "admin");
  const isStudent = hasRole(user, "student");

  return { token, user, isAuthed, isAdmin, isStudent, ...query } as const;
}
