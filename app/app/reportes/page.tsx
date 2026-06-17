"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "task", label: "Misiones", href: "/app/misiones" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "assessment", label: "Reportes", href: "/app/reportes" },
  { icon: "smart_toy", label: "Agentes", href: "/app/agentes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

// ── Filter tabs ───────────────────────────────────────────────────────────────

const FILTER_TABS = ["Todos", "Estratégicos", "Operativos", "Financieros", "Borradores"];

// ── Report data ───────────────────────────────────────────────────────────────

type ReportStatus = "completado" | "en-proceso" | "borrador";

type Report = {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  category: string;
  status: ReportStatus;
  precision?: string;
  progress?: number;
  meta?: string;
  footer?: string;
  extras?: string;
  progressEta?: string;
};

const REPORTS: Report[] = [
  {
    id: "r1",
    icon: "route",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
    title: "Optimización de Rutas Logísticas — Nodo Norte",
    category: "Estratégico",
    status: "completado",
    precision: "91.3%",
    meta: "Estratégico",
  },
  {
    id: "r2",
    icon: "trending_up",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed-variant",
    title: "Proyección de Demanda Q3 — Categoría Electrónica",
    category: "Operativo",
    status: "en-proceso",
    progress: 68,
    meta: "Operativo · ID: T-492-X",
    progressEta: "Estimado: 12 min restantes",
  },
  {
    id: "r3",
    icon: "account_balance",
    iconBg: "bg-on-tertiary-fixed",
    iconColor: "text-tertiary-fixed-dim",
    title: "Conciliación Bancaria Mensual — Mayo 2025",
    category: "Financiero",
    status: "completado",
    precision: "99.1%",
    meta: "Financiero",
    extras: "3 anexos",
  },
  {
    id: "r4",
    icon: "analytics",
    iconBg: "bg-surface-container",
    iconColor: "text-on-surface-variant",
    title: "Análisis de Competidores — Segmento Premium",
    category: "Estratégico",
    status: "borrador",
    progress: 45,
    meta: "Estratégico · Progreso: 45%",
  },
  {
    id: "r5",
    icon: "inventory_2",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
    title: "Auditoría de Proveedores — Cadena de Suministro",
    category: "Operativo",
    status: "completado",
    precision: "96.2%",
    meta: "Operativo",
    footer: "Aprobado por: Dir. Logística",
  },
];

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ReportStatus }) {
  if (status === "completado")
    return (
      <span className="flex items-center gap-1 font-code-mono text-label-sm text-on-surface-variant">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Completado
      </span>
    );
  if (status === "en-proceso")
    return (
      <span className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
        </span>
        <span className="font-label-sm font-bold text-secondary">En proceso</span>
      </span>
    );
  return (
    <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[11px] font-bold uppercase">
      Borrador
    </span>
  );
}

// ── Donut SVG (featured) ──────────────────────────────────────────────────────

// r=40 → circumference ≈ 251.2
const FEATURED_CIRCUMFERENCE = 251.2;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportesPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container flex flex-col p-md overflow-y-auto z-50">
        <div className="mb-8 px-4 py-2">
          <h1 className="text-headline-md font-headline-md font-bold text-on-primary">
            AgentHub
          </h1>
          <p className="font-label-sm text-label-sm text-on-primary-container">Empresarial</p>
        </div>

        <nav className="flex flex-col gap-1 grow">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "text-on-secondary-container bg-secondary-container shadow-sm"
                    : "text-on-primary-fixed-variant hover:text-on-primary hover:bg-on-primary-fixed-variant/10"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className={`font-body-md ${active ? "font-bold" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-md border-t border-outline-variant/20">
          <button
            type="button"
            className="w-full bg-secondary-container text-on-secondary-container py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-body-md font-bold hover:opacity-90 transition-all active:scale-95"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            Optimizar con Agente
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-[260px] min-h-screen">

        {/* Top app bar */}
        <header className="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 h-16 flex justify-between items-center px-gutter">
          <div className="shrink-0">
            <h2 className="font-title-md text-title-md text-on-surface">
              Reportes de Misiones
            </h2>
            <p className="text-xs text-on-surface-variant">
              Análisis generados automáticamente por tus agentes de IA
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 grow max-w-xl mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar reportes o agentes..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-body-md font-medium hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">download</span>
              Exportar
            </button>
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhgI0FONEcMzFCpd8EqclM-I_FWOguCF_QattvvtxpAJpa9kFSEZxor9NAzRonM8HWaFd0fokmEAFE3_NT1YtHOQdK2Q4cFw7U3bsWXTAy8NHqXuTe96KU0hVqRMv2LkOG683lX-0QAP153WsBwyEOlgAkqfC_bUmTlGU50IPiyUJSnHeKO4r8AK_3OHdXUd1IzoM1sRiuYexpb1kfrRvgU9nsim_NWOwaIubrXqUfIHvwJfe0rzTqCktz734K0Ko2qoGojkRiajU"
                alt="Usuario"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        <div className="p-gutter space-y-gutter max-w-[1200px] mx-auto">

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total reportes", value: "28", icon: "description", mono: true },
              { label: "Esta semana", value: "6", icon: "new_releases", mono: true, badge: "nuevos" },
              { label: "Promedio precisión", value: "93.4%", icon: "verified", mono: true },
              { label: "Tiempo promedio", value: "47 min", icon: "timer", mono: true },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {s.label}
                  </span>
                  <span className="material-symbols-outlined text-secondary">{s.icon}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-code-mono text-headline-md text-on-surface">{s.value}</p>
                  {s.badge && (
                    <span className="text-xs font-medium text-secondary">{s.badge}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2 font-body-md font-medium rounded-lg transition-colors active:scale-95 ${
                    activeFilter === tab
                      ? "bg-surface-container-lowest text-secondary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-body-md"
              >
                Ordenar por: Recientes
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              <div className="flex items-center border border-outline-variant rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-surface-container-high text-secondary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-surface-container-high text-secondary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured report */}
          <section>
            <div className="group bg-surface-container-lowest border border-outline-variant/30 border-l-4 border-l-secondary rounded-xl p-xl flex flex-col md:flex-row gap-8 items-center transition-all hover:shadow-lg">
              {/* SVG donut — 100% */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    strokeWidth="8"
                    className="text-surface-container stroke-current"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-secondary stroke-current"
                    style={{
                      strokeDasharray: FEATURED_CIRCUMFERENCE,
                      strokeDashoffset: 0,
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                      transition: "stroke-dashoffset 0.35s",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="font-code-mono text-xl font-bold">100%</span>
                  <span className="text-[10px] uppercase text-on-surface-variant">Listo</span>
                </div>
              </div>

              {/* Content */}
              <div className="grow space-y-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full font-label-sm text-label-sm font-bold">
                    Estratégico
                  </span>
                  <span className="font-code-mono text-label-sm text-on-surface-variant">
                    ID: R-2025-Q4-001
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Generado hoy, 09:12 AM
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Análisis de Inventario Regional Q4 — Informe Ejecutivo
                </h3>
                <p className="font-body-md text-on-surface-variant max-w-2xl">
                  Revisión exhaustiva de la rotación de stock y optimización de almacenes para el
                  cierre de año. Identificación de 12 puntos críticos de mejora.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <Link
                  href="/app/reportes/R-2025-Q4-001"
                  className="bg-secondary text-on-secondary py-3 px-8 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  Ver reporte
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Report grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {REPORTS.map((report) => (
              <div
                key={report.id}
                className={`bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-lg transition-all group ${
                  report.status === "borrador"
                    ? "opacity-80 hover:opacity-100"
                    : "hover:border-secondary/40"
                }`}
              >
                {/* Top */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl ${report.iconBg} ${report.iconColor}`}
                  >
                    <span className="material-symbols-outlined">{report.icon}</span>
                  </div>
                  {report.status === "completado" && report.precision ? (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[11px] font-bold">
                      {report.precision} Precisión
                    </span>
                  ) : report.status === "en-proceso" ? (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                      </span>
                      <span className="font-label-sm font-bold text-secondary">
                        En proceso ({report.progress}%)
                      </span>
                    </div>
                  ) : (
                    <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[11px] font-bold uppercase">
                      Borrador
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-title-md text-title-md text-on-surface mb-1">
                  {report.title}
                </h4>

                {/* Meta */}
                <div className="flex items-center gap-4 font-code-mono text-label-sm text-on-surface-variant mb-6">
                  <StatusDot status={report.status} />
                  <span>{report.meta}</span>
                </div>

                {/* Progress bar (in-progress or draft) */}
                {report.progress !== undefined && (
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        report.status === "borrador" ? "bg-outline" : "bg-secondary"
                      }`}
                      style={{ width: `${report.progress}%` }}
                    />
                  </div>
                )}

                {/* Card footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/20">
                  {report.status === "en-proceso" ? (
                    <>
                      <span className="text-xs text-on-surface-variant italic">
                        {report.progressEta}
                      </span>
                      <button
                        type="button"
                        className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </>
                  ) : report.status === "borrador" ? (
                    <>
                      <button
                        type="button"
                        className="font-body-md font-medium text-on-surface-variant hover:text-secondary transition-colors"
                      >
                        Continuar edición
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        {report.extras ? (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-on-surface-variant text-sm">
                              attach_file
                            </span>
                            <span className="text-xs text-on-surface-variant">{report.extras}</span>
                          </div>
                        ) : report.footer ? (
                          <span className="text-xs text-on-surface-variant">{report.footer}</span>
                        ) : (
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container text-[10px] flex items-center justify-center font-bold">
                              AI
                            </div>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/app/reportes/${report.id}`}
                        className="text-secondary font-bold font-body-md flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Detalles
                        <span className="material-symbols-outlined">chevron_right</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state card */}
            <Link
              href="/app/misiones/nueva"
              className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center group hover:border-secondary/50 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-4 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-4xl">add_circle</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface mb-2">Nueva Misión</h4>
              <p className="font-body-md text-on-surface-variant max-w-[200px]">
                Lanza una nueva misión para generar tu próximo reporte
              </p>
            </Link>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 py-8">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-4 py-2 font-body-md font-medium text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors active:scale-95 ${
                    page === p
                      ? "bg-secondary text-on-secondary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={page === 3}
              onClick={() => setPage((p) => Math.min(3, p + 1))}
              className="flex items-center gap-2 px-4 py-2 font-body-md font-medium text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <p className="text-center text-xs text-on-surface-variant font-code-mono -mt-4 pb-4">
            Mostrando 6 de 28 reportes
          </p>
        </div>

        {/* Footer */}
        <footer className="p-gutter text-center border-t border-outline-variant/20 mt-8">
          <p className="text-xs text-on-surface-variant font-code-mono">
            AgentHub v2.4.0 — LatAm Corporate Infrastructure
          </p>
        </footer>
      </main>
    </div>
  );
}
