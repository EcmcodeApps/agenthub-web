"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

const NAV_ITEMS = [
  { href: "/app/dashboard",    icon: "dashboard",    label: "Panel de Control" },
  { href: "/app/misiones",     icon: "assignment",   label: "Misiones" },
  { href: "/app/documentos",   icon: "description",  label: "Documentos" },
  { href: "/app/reportes",     icon: "assessment",   label: "Reportes" },
  { href: "/app/agentes",      icon: "smart_toy",    label: "Agentes" },
  { href: "/app/facturacion",  icon: "payments",     label: "Facturación" },
  { href: "/app/configuracion",icon: "settings",     label: "Configuración" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-primary-container flex flex-col py-lg px-md shadow-md z-50">
      {/* Logo */}
      <div className="mb-xl px-sm flex items-center gap-3">
        <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg">
          <span className="material-symbols-outlined text-white">hub</span>
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">AgentHub</h1>
          <p className="font-code-mono text-xs text-on-primary-fixed-variant opacity-70">Empresarial AI</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-md py-sm rounded-lg transition-colors ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-primary-fixed-variant hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-body-md">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer usuario */}
      <div className="mt-auto pt-lg border-t border-white/10">
        <div className="flex items-center gap-3 mb-md">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed flex-shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-body-md font-bold text-white truncate">{displayName}</p>
            <p className="font-code-mono text-xs text-on-primary-fixed-variant truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-on-primary-fixed-variant hover:text-white transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Nueva misión CTA */}
        <div className="p-md bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-sm mb-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-code-mono text-xs text-on-primary-fixed-variant">Sistema Activo</span>
          </div>
          <Link
            href="/app/misiones/nueva"
            className="w-full py-sm px-md bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva Misión
          </Link>
        </div>
      </div>
    </aside>
  );
}
