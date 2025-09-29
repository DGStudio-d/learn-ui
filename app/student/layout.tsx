"use client";

import StudentLayout from "@/components/student/layout";
import StudentGuard from "@/components/student/guard";

export default function StudentAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <StudentLayout>{children}</StudentLayout>
    </StudentGuard>
  );
}
