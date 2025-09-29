"use client";

import AdminLayout from "@/components/admin/layout";
import AdminGuard from "@/components/admin/guard";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
