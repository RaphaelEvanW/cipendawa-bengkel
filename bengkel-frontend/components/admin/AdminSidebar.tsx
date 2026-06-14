"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Wrench,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/api/auth";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reservasi", label: "Reservasi", icon: CalendarCheck },
  { href: "/jadwal", label: "Jadwal & Operasional", icon: Calendar },
  { href: "/layanan", label: "Layanan", icon: Wrench },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy-light border-r border-white/10 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-lg font-bold text-white">
          Cipendawa<span className="text-lime">Motor</span>
        </span>
        <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-lime text-navy"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}