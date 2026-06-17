"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/app/misiones", label: "Misiones", icon: "🎯" },
  { href: "/app/reportes", label: "Reportes", icon: "📄" },
  { href: "/app/documentos", label: "Documentos", icon: "📁" },
  { href: "/app/agentes", label: "Agentes", icon: "🤖" },
  { href: "/app/tips", label: "Tips", icon: "💡" },
  { href: "/app/uso", label: "Uso y plan", icon: "📊" },
  { href: "/app/configuracion", label: "Configuración", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-40"
      style={{
        background: "var(--card)",
        borderRight: "1px solid var(--card-border)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--card-border)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--primary)" }}
          >
            AH
          </div>
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
            AgentHub
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "text-white"
                    : "hover:text-white"
                )}
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "white" : "var(--muted)",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--card-border)" }}>
        <Link
          href="/app/misiones/nueva"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          + Nueva misión
        </Link>
      </div>
    </aside>
  );
}
