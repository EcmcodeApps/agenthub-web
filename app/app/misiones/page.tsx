"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

// ── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "assignment", label: "Misiones", href: "/app/misiones" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "analytics", label: "Reportes", href: "/app/reportes" },
  { icon: "smart_toy", label: "Agentes", href: "/app/agentes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

// ── Filter tabs ──────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "todas", label: "Todas", count: 12 },
  { key: "progreso", label: "En progreso", count: 3 },
  { key: "completadas", label: "Completadas", count: 6 },
  { key: "pendientes", label: "Pendientes", count: 2 },
  { key: "fallidas", label: "Fallidas", count: 1 },
];

// ── Mission data ─────────────────────────────────────────────────────────────

type MissionStatus = "progreso" | "completada" | "pendiente" | "fallida";

type Mission = {
  id: string;
  status: MissionStatus;
  title: string;
  desc?: string;
  progress?: number;
  time: string;
  timeIcon: string;
  agents?: { src: string; alt: string }[];
  errorMsg?: string;
  priority?: string;
};

const AGENT_AVATARS = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvXH9tuSbO5-sYMd7rSdVVg9YJ7uGBbYjonJGPyVjVEPghCUo5UVJdH9m3I4rT7Fd0MCprflPkI7uEwk5hRgxB20a4lD_rPMeNPalyhrKBuKxt9eg5U9CTi-eHMXx3FYqsUCt_IQDSpR7E3EpymTe7HCH-ZzQceej1hh5009yndorqYcfuNxlLd51IEY4OkUzVsuOlz9ucw4mZ4c_jVYc0qExzXAA_or0M5luglKzFEiafsQIt2mDTXjFnJigcbC8NzBJUlfHMO4w",
    alt: "Agente Alpha",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfnAlMHXLNzdqTaIOUXd8KX98H-siaqZA5fXv23GlSnThfJeZ2zzB2vFQDSBP2e0T9WiKxEf3TYsYaLX7Zk2in_fCe6Swak04-09gQvH5KP2zw45Euw7E9bMvZU6UM6TwE-pn0Y3QmTJBKWOip1-KjJQjbgB-lw3JA3BCj7dPR-J1H4mlcOV6GCJvRsM5ZqlVImiH-jaerBbw1Eup1RQuPfMULwmzdv32Id3NdccgFiHodFgtOK51cwdbBWCRZB6XB-fkFWUwcHQ4",
    alt: "Agente Beta",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAPc1D3AtWIGk8s-st0J8rqBKWSDBxQ-YsdiGDzNPWBYSNDyYQemkyu-5JxCAtmVflX15Up3sOEYNFbgSFZZkd6vTn-dSW8RfZmB5b5kaBjrTIN0o7X0y4Jn3AcpBZRl3T1mvbrwwcqsn8H0uSo56EKlA95Qp9VKfsLx5BteomfN4v75NNITH1ammsbD6LLpu7OoY9ZomYtvzNJXzTNP11uGiFMbY6nR2gxQ6QxWlwYVYEOtJNjoR2qS9BhSWuzjbhhfiNnM60KNE",
    alt: "Agente Gamma",
  },
];

const MISSIONS: Mission[] = [
  {
    id: "#MIS-2094",
    status: "progreso",
    title: "Análisis de Inventario Regional Q4",
    progress: 67,
    time: "Hace 2h",
    timeIcon: "schedule",
    agents: AGENT_AVATARS,
  },
  {
    id: "#MIS-1988",
    status: "completada",
    title: "Reporte de Sentimientos — Redes Sociales",
    desc: "Análisis exitoso de 12,000 menciones en tiempo real. Se identificaron tendencias clave en la satisfacción del cliente y áreas de mejora logística.",
    time: "Ayer",
    timeIcon: "calendar_today",
  },
  {
    id: "#MIS-2105",
    status: "pendiente",
    title: "Optimización de Precios Competitivos",
    desc: "Monitorear y ajustar automáticamente los precios en base a los movimientos de la competencia principal y el inventario disponible.",
    priority: "Prioridad Alta",
    time: "Mañana",
    timeIcon: "event_repeat",
  },
  {
    id: "#MIS-1852",
    status: "fallida",
    title: "Integración CRM Automatizada",
    errorMsg: "API timeout: endpoint unreachable after 30000ms",
    time: "Hace 3 días",
    timeIcon: "history",
  },
];

// ── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  MissionStatus,
  { label: string; icon: string; classes: string; fill?: boolean; spin?: boolean }
> = {
  progreso: {
    label: "En progreso",
    icon: "sync",
    classes: "bg-secondary/10 text-secondary",
    spin: true,
  },
  completada: {
    label: "Completada",
    icon: "check_circle",
    classes: "bg-emerald-100 text-emerald-700",
    fill: true,
  },
  pendiente: {
    label: "Pendiente",
    icon: "pending",
    classes: "bg-amber-100 text-amber-700",
  },
  fallida: {
    label: "Fallida",
    icon: "error",
    classes: "bg-error-container text-on-error-container",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function MisionesPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState("todas");
  const [search, setSearch] = useState("");

  const filtered = MISSIONS.filter((m) => {
    const matchesFilter =
      activeFilter === "todas" ||
      (activeFilter === "progreso" && m.status === "progreso") ||
      (activeFilter === "completadas" && m.status === "completada") ||
      (activeFilter === "pendientes" && m.status === "pendiente") ||
      (activeFilter === "fallidas" && m.status === "fallida");
    const matchesSearch =
      !search || m.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container text-on-primary-container flex flex-col p-md shadow-sm z-50">
        <div className="flex items-center gap-md mb-2xl px-sm">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white shrink-0">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
          </div>
          <div>
            <h1 className="font-title-md font-bold text-on-primary-fixed">AgentHub</h1>
            <p className="font-label-sm text-label-sm opacity-70">Business Central</p>
          </div>
        </div>
        <nav className="flex-1 space-y-xs overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors ${
                  active
                    ? "bg-secondary text-on-secondary"
                    : "opacity-70 hover:bg-on-primary-fixed-variant hover:text-white hover:opacity-100"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-md border-t border-on-primary-fixed-variant/20 space-y-xs">
          <Link href="/app/configuracion" className="flex items-center gap-md px-md py-sm opacity-70 hover:bg-on-primary-fixed-variant hover:text-white rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Configuración</span>
          </Link>
          <Link href="#" className="flex items-center gap-md px-md py-sm opacity-70 hover:bg-on-primary-fixed-variant hover:text-white rounded-lg transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md">Soporte</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-[260px] flex-1 min-w-0 bg-background">

        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-margin-desktop py-md border-b border-outline-variant/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
            <div>
              <nav className="flex items-center gap-xs text-on-surface-variant font-label-sm mb-xs">
                <span>App</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-secondary font-medium">Misiones</span>
              </nav>
              <h2 className="font-headline-lg text-headline-lg text-primary">Mis Misiones</h2>
            </div>
            <div className="flex items-center gap-md">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar misiones..."
                  className="pl-10 pr-md py-sm bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-secondary focus:border-secondary w-64 transition-all outline-none"
                />
              </div>
              <button
                type="button"
                className="p-sm text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <Link
                href="/app/misiones/nueva"
                className="bg-secondary text-on-secondary px-lg py-sm rounded-full font-body-md flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined">add</span>
                Nueva Misión
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-sm overflow-x-auto pb-sm">
            {FILTERS.map((f) => {
              const active = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-lg py-xs rounded-full flex items-center gap-sm shrink-0 transition-colors ${
                    active
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span className="font-label-sm">{f.label}</span>
                  <span
                    className={`px-xs rounded text-[10px] ${
                      active ? "bg-white/20" : "bg-on-surface-variant/10"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Mission Grid */}
        <div className="px-margin-desktop py-lg grid grid-cols-1 xl:grid-cols-2 gap-lg">

          {filtered.map((mission) => {
            const cfg = STATUS_CONFIG[mission.status];
            return (
              <div
                key={mission.id}
                className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-md hover:shadow-lg hover:border-secondary/30 transition-all"
              >
                {/* Top row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant font-code-mono text-label-sm mb-xs uppercase tracking-wider">
                      {mission.id}
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface">{mission.title}</h3>
                  </div>
                  <div
                    className={`flex items-center gap-xs px-sm py-xs rounded-lg font-label-sm shrink-0 ml-md ${cfg.classes}`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{
                        fontVariationSettings: cfg.fill ? "'FILL' 1" : undefined,
                        animation: cfg.spin ? "spin 3s linear infinite" : undefined,
                      }}
                    >
                      {cfg.icon}
                    </span>
                    {cfg.label}
                  </div>
                </div>

                {/* Progress (En progreso) */}
                {mission.status === "progreso" && mission.progress !== undefined && (
                  <div className="space-y-sm">
                    <div className="flex justify-between text-label-sm font-label-sm">
                      <span className="text-on-surface-variant">Progreso total</span>
                      <span className="text-secondary font-bold">{mission.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-1000"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <p className="text-on-surface-variant text-body-md italic flex items-center gap-xs">
                      Agentes trabajando
                      <span className="inline-flex gap-px">
                        {[0, 200, 400].map((delay) => (
                          <span
                            key={delay}
                            className="inline-block"
                            style={{ animation: `pulseDot 1.4s ${delay}ms infinite ease-in-out` }}
                          >
                            .
                          </span>
                        ))}
                      </span>
                    </p>
                  </div>
                )}

                {/* Description */}
                {mission.desc && (
                  <p className="text-on-surface-variant text-body-md line-clamp-2">{mission.desc}</p>
                )}

                {/* Error block */}
                {mission.status === "fallida" && mission.errorMsg && (
                  <div className="p-sm bg-error-container/20 border border-error/10 rounded-lg flex items-start gap-sm">
                    <span className="material-symbols-outlined text-error text-[18px]">report</span>
                    <div>
                      <p className="text-on-error-container text-label-sm font-bold">
                        Error del Sistema
                      </p>
                      <p className="text-on-error-container/80 font-code-mono text-[11px]">
                        {mission.errorMsg}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer row */}
                <div className="flex items-center justify-between pt-sm mt-auto">
                  {/* Left side */}
                  {mission.status === "progreso" && mission.agents && (
                    <div className="flex -space-x-3">
                      {mission.agents.map((a, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-variant overflow-hidden"
                        >
                          <Image
                            src={a.src}
                            alt={a.alt}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {mission.status === "completada" && (
                    <Link
                      href="/app/reportes/AH-2024-0892"
                      className="text-secondary font-body-md flex items-center gap-xs hover:underline"
                    >
                      Ver reporte completo
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </Link>
                  )}

                  {mission.status === "pendiente" && mission.priority && (
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px]">bolt</span>
                      </div>
                      <span className="text-on-surface-variant text-label-sm font-medium">
                        {mission.priority}
                      </span>
                    </div>
                  )}

                  {mission.status === "fallida" && (
                    <button
                      type="button"
                      className="px-md py-xs border border-error text-error hover:bg-error hover:text-white rounded-lg text-label-sm font-bold transition-all active:scale-95"
                    >
                      Reintentar misión
                    </button>
                  )}

                  {/* Right side: time */}
                  <span className="text-on-surface-variant text-label-sm flex items-center gap-xs ml-auto">
                    <span className="material-symbols-outlined text-[16px]">{mission.timeIcon}</span>
                    {mission.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Empty state when filter yields nothing */}
          {filtered.length === 0 && (
            <div className="col-span-2 py-2xl flex flex-col items-center text-center gap-md">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-[40px]">assignment_late</span>
              </div>
              <p className="font-headline-md text-headline-md text-primary">
                No hay misiones en esta categoría
              </p>
              <p className="text-on-surface-variant text-body-lg">
                Prueba con otro filtro o crea una nueva misión.
              </p>
            </div>
          )}
        </div>

        {/* Empty State CTA */}
        <div className="px-margin-desktop py-2xl">
          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-2xl flex flex-col items-center text-center gap-md bg-surface-container-low/30">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/40 mb-sm">
              <span className="material-symbols-outlined text-[40px]">smart_toy</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-primary">
                ¿Listo para tu próxima misión?
              </h4>
              <p className="text-on-surface-variant text-body-lg mt-xs" style={{ maxWidth: "520px", margin: "4px auto 0" }}>
                Configura un nuevo agente y automatiza procesos complejos en cuestión de segundos.
              </p>
            </div>
            <Link
              href="/app/misiones/nueva"
              className="mt-md bg-primary text-on-primary px-xl py-md rounded-xl font-title-md hover:shadow-lg transition-all active:scale-95"
            >
              Crear nueva misión ahora
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-2xl border-t border-outline-variant bg-background py-xl">
          <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-title-md text-title-md font-bold text-primary">AgentHub</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
              </p>
            </div>
            <div className="flex gap-lg">
              {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Dot pulse animation */}
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
