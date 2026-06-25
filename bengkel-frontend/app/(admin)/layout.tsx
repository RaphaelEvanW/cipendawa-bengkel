"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "@/lib/api/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router, pathname]);

  if (!isLoggedIn()) return null;

  return (
    <div className="min-h-screen flex bg-navy">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">{children}</main>
    </div>
  );
}