"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Home as HomeIcon,
  Images,
  PartyPopper,
  Newspaper,
  Star,
  Users,
  Settings,
  FolderOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/admin/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/guest-houses", label: "Guest Houses", icon: HomeIcon },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/events", label: "Events", icon: PartyPopper },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/media", label: "Media Manager", icon: FolderOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ email, onNavigate }: { email: string | null; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="font-display text-lg font-semibold text-forest-950">SENTOB</span>
        <span className="rounded-full bg-forest-900/[0.06] px-2 py-0.5 text-[10px] font-semibold text-forest-700">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-forest-800 text-cream-50"
                  : "text-ink-600 hover:bg-forest-900/5 hover:text-forest-950"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-forest-900/10 p-4">
        <p className="truncate text-xs text-ink-600">{email}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-forest-900/5"
          >
            <LogOut size={16} /> Chiqish
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ email }: { email: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: fixed rail */}
      <aside className="hidden w-64 shrink-0 border-r border-forest-900/10 bg-cream-50 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent email={email} />
        </div>
      </aside>

      {/* Mobile: top bar with hamburger */}
      <div className="flex items-center justify-between border-b border-forest-900/10 bg-cream-50 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-semibold text-forest-950">SENTOB</span>
          <span className="rounded-full bg-forest-900/[0.06] px-2 py-0.5 text-[10px] font-semibold text-forest-700">
            ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menyu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-forest-900 hover:bg-forest-900/5"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile: slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-cream-50 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Yopish"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-forest-900 hover:bg-forest-900/5"
            >
              <X size={18} />
            </button>
            <SidebarContent email={email} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
