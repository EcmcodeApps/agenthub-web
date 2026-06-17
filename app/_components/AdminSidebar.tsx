"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin/dashboard",       icon: "dashboard",     label: "Dashboard" },
  { href: "/admin/usuarios",        icon: "group",         label: "Usuarios" },
  { href: "/admin/modelos",         icon: "psychology",    label: "Modelos & Costos" },
  { href: "/admin/infraestructura", icon: "dns",           label: "Infraestructura" },
  { href: "/admin/alertas",         icon: "notifications", label: "Alertas", badge: 2 },
  { href: "/admin/crm",             icon: "hub",           label: "CRM" },
  { href: "/admin/logs",            icon: "terminal",      label: "Logs del Sistema" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface flex flex-col z-50 border-r border-outline-variant">
      {/* Logo */}
      <div className="p-lg flex items-center gap-sm">
        <div className="w-10 h-10 bg-on-tertiary-container rounded-lg flex items-center justify-center shadow-lg">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            hub
          </span>
        </div>
        <div>
          <h1 className="text-white font-extrabold text-xl tracking-tight leading-none">AgentHub</h1>
          <p className="text-outline font-code-mono text-[11px] uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-md mt-md space-y-1">
        {ADMIN_NAV.map(({ href, icon, label, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-secondary text-white font-bold shadow-md"
                  : "text-outline hover:bg-white/10"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="flex-1 font-medium">{label}</span>
              {badge && !isActive && (
                <span className="bg-error text-white font-code-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-md border-t border-white/10">
        <div className="flex items-center gap-md px-md py-sm bg-white/5 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-code-mono text-lg border-2 border-white/20">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">Super Admin</p>
            <p className="text-outline text-[11px] font-code-mono truncate">admin@agenthub.io</p>
          </div>
          <button className="text-outline hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
