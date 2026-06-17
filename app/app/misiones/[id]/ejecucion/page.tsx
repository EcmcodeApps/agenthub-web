"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";

// ── Sidebar nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "assignment", label: "Misiones", href: "/app/misiones" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "analytics", label: "Reportes", href: "/app/reportes" },
  { icon: "smart_toy", label: "Agentes", href: "/app/agentes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

// ── Log feed entries ──────────────────────────────────────────────────────────

type LogEntry = {
  id: string;
  agent: string;
  timestamp: string;
  icon: string;
  iconFill?: boolean;
  message: string;
  fileChip?: { name: string; size: string };
  warningChip?: string;
  subtext?: string;
  isActive?: boolean;
};

const LOG_ENTRIES: LogEntry[] = [
  {
    id: "e1",
    agent: "Agente Coordinador",
    timestamp: "14:20:05",
    icon: "account_tree",
    iconFill: true,
    message: "Iniciando misión estratégica de auditoría de inventario regional...",
  },
  {
    id: "e2",
    agent: "Agente de Datos",
    timestamp: "14:20:12",
    icon: "database",
    message: "Cargando dataset para el análisis histórico.",
    fileChip: { name: "Inventario_Q3.csv", size: "14.2 MB" },
  },
  {
    id: "e3",
    agent: "Agente de Análisis",
    timestamp: "14:22:45",
    icon: "analytics",
    message: "Calculando índice de rotación y detección de anomalías.",
    warningChip: "45 SKUs con stock >90 días en Nodo Sur",
  },
  {
    id: "e4",
    agent: "Agente de Precios",
    timestamp: "14:23:55",
    icon: "monitoring",
    message: "Consultando precios de mercado y comparativa competitiva...",
    subtext: "Scraping data from 8 global competitors in progress.",
  },
  {
    id: "e5",
    agent: "Agente Coordinador",
    timestamp: "Ahora",
    icon: "account_tree",
    iconFill: true,
    message: "Consolidando hallazgos finales...",
    isActive: true,
  },
];

// ── Donut config ──────────────────────────────────────────────────────────────

// r=80 → circumference = 2π*80 ≈ 502.65
// 67% done → offset = 502.65 * 0.33 ≈ 165.87
const DONUT_CIRCUMFERENCE = 502.65;
const DONUT_OFFSET = 165.87;

// ── Timer helper ──────────────────────────────────────────────────────────────

function formatTimer(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ApprovalState = "pending" | "approved" | "rejected";

export default function EjecucionPage() {
  const pathname = usePathname();
  const params = useParams();
  const missionId = (params?.id as string) ?? "MIS-2094";

  const [elapsed, setElapsed] = useState(263); // starts at 00:04:23
  const [credits, setCredits] = useState(4231);
  const [approval, setApproval] = useState<ApprovalState>("pending");

  // Elapsed timer
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Live credit counter
  useEffect(() => {
    const id = setInterval(
      () => setCredits((c) => c + Math.floor(Math.random() * 5)),
      1200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background font-body-md">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container text-on-primary-container flex flex-col p-md z-50">
        <div className="flex items-center gap-3 mb-xl px-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
          </div>
          <div>
            <h1 className="font-title-md text-title-md font-bold text-on-primary-container">
              Portal de Cliente
            </h1>
            <p className="text-xs opacity-70">AgentHub Business</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-md py-sm rounded-lg transition-colors ${
                  active
                    ? "bg-secondary text-on-secondary"
                    : "text-on-primary-container opacity-70 hover:bg-on-primary-fixed-variant hover:text-white hover:opacity-100"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/app/misiones/nueva"
          className="mb-lg w-full py-sm bg-on-primary-fixed-variant text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:brightness-110"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nueva Misión
        </Link>

        <div className="pt-md border-t border-on-primary-container/20 space-y-1">
          <Link
            href="/app/configuracion"
            className="w-full flex items-center gap-3 px-md py-sm text-on-primary-container opacity-70 hover:bg-on-primary-fixed-variant hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Configuración</span>
          </Link>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-md py-sm text-on-primary-container opacity-70 hover:bg-on-primary-fixed-variant hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md">Soporte</span>
          </button>
        </div>
      </aside>

      {/* ── Two-panel main ── */}
      <main className="ml-[260px] flex-1 flex flex-row overflow-hidden bg-background">

        {/* ════════════════════════════════════════
            LEFT — Terminal de Ejecución (60%)
        ════════════════════════════════════════ */}
        <section
          className="w-[60%] flex flex-col"
          style={{ backgroundColor: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Terminal header */}
          <header
            className="sticky top-0 z-10 px-lg py-md flex flex-col gap-2"
            style={{ backgroundColor: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-2 text-outline-variant font-label-sm uppercase tracking-wider">
                <Link
                  href="/app/misiones"
                  className="hover:text-secondary-fixed transition-colors"
                >
                  Misiones
                </Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span>#{missionId}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-secondary-fixed">Ejecución</span>
              </nav>
              <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span className="font-code-mono text-secondary-fixed text-sm">
                  ⏱ {formatTimer(elapsed)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <h2 className="font-headline-md text-headline-md text-white font-bold">
                Análisis de Inventario Regional Q4
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/70">
                  Retail
                </span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/70">
                  Estratégico
                </span>
                <span className="px-2 py-0.5 bg-secondary-container/30 border border-secondary-container rounded text-xs text-on-secondary-container">
                  En ejecución
                </span>
              </div>
            </div>
          </header>

          {/* Log feed */}
          <div className="flex-1 overflow-y-auto p-lg space-y-6 terminal-scroll">
            {LOG_ENTRIES.map((entry) => (
              <div key={entry.id} className="flex gap-4">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    entry.iconFill ? "bg-primary-container" : ""
                  }`}
                  style={
                    entry.iconFill
                      ? undefined
                      : { backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  <span
                    className="material-symbols-outlined text-white text-sm"
                    style={
                      entry.iconFill
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {entry.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{entry.agent}</span>
                    <span className="text-xs text-white/40">{entry.timestamp}</span>
                  </div>

                  {entry.isActive ? (
                    <div className="flex items-center gap-3">
                      <p className="text-secondary-fixed font-code-mono text-body-md">
                        {entry.message}
                      </p>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed typing-dot" />
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed typing-dot" />
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed typing-dot" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/80 font-code-mono text-body-md">{entry.message}</p>
                  )}

                  {entry.fileChip && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70">
                      <span className="material-symbols-outlined text-sm text-secondary-fixed">
                        description
                      </span>
                      <span>{entry.fileChip.name}</span>
                      <span className="text-xs opacity-50">{entry.fileChip.size}</span>
                    </div>
                  )}

                  {entry.warningChip && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span className="font-medium">{entry.warningChip}</span>
                    </div>
                  )}

                  {entry.subtext && (
                    <p className="text-xs text-white/40 italic mt-1">{entry.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Human Approval Gate ── */}
          <div
            className="px-lg py-lg"
            style={{
              backgroundColor: "rgba(30,41,59,0.5)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {approval === "pending" && (
              <div className="bg-surface-container-lowest rounded-xl p-lg shadow-2xl border-l-4 border-amber-500 flex items-center justify-between gap-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-amber-600">person_check</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-on-surface">
                      Aprobación Humana Requerida
                    </h4>
                    <p className="font-body-md text-on-surface-variant">
                      Confirme los parámetros de ajuste de precios sugeridos por la IA.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setApproval("rejected")}
                    className="px-xl py-2.5 rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-high transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproval("approved")}
                    className="px-xl py-2.5 rounded-lg bg-secondary text-white font-medium shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    Aprobar y continuar
                  </button>
                </div>
              </div>
            )}

            {approval === "approved" && (
              <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-emerald-600 text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <p className="font-title-md text-on-surface">Aprobado — continuando ejecución</p>
              </div>
            )}

            {approval === "rejected" && (
              <div className="bg-error-container rounded-xl p-md border border-error/20 flex items-center gap-4">
                <span className="material-symbols-outlined text-error text-2xl">cancel</span>
                <p className="font-title-md text-on-error-container">
                  Rechazado — ajuste de precios cancelado
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
            RIGHT — Panel de Control (40%)
        ════════════════════════════════════════ */}
        <aside className="w-[40%] flex flex-col bg-surface overflow-y-auto">
          <div className="p-lg space-y-lg">

            {/* Progress donut */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant/30 flex flex-col items-center">
              <h3 className="w-full text-left font-title-md text-title-md font-bold mb-lg">
                Progreso de la Misión
              </h3>
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-surface-container-high"
                  />
                  <circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={DONUT_CIRCUMFERENCE}
                    strokeDashoffset={DONUT_OFFSET}
                    className="text-secondary"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-on-surface">67%</span>
                  <span className="font-label-sm text-outline-variant uppercase text-[10px] tracking-wide">
                    Completado
                  </span>
                </div>
              </div>
              <div className="mt-lg w-full flex justify-between px-md">
                <div className="text-center">
                  <p className="text-[10px] text-outline-variant uppercase font-medium tracking-wide">
                    Estimado
                  </p>
                  <p className="font-title-md text-on-surface">12m</p>
                </div>
                <div className="border-r border-outline-variant/20" />
                <div className="text-center">
                  <p className="text-[10px] text-outline-variant uppercase font-medium tracking-wide">
                    Paso Actual
                  </p>
                  <p className="font-title-md text-on-surface">04 / 06</p>
                </div>
                <div className="border-r border-outline-variant/20" />
                <div className="text-center">
                  <p className="text-[10px] text-outline-variant uppercase font-medium tracking-wide">
                    Alertas
                  </p>
                  <p className="font-title-md text-error">1</p>
                </div>
              </div>
            </div>

            {/* Active agents */}
            <div className="space-y-md">
              <div className="flex justify-between items-center">
                <h3 className="font-title-md text-title-md font-bold">Agentes Activos</h3>
                <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-xs rounded-md">
                  3 total
                </span>
              </div>

              {/* Coordinador */}
              <div className="p-md bg-surface-container-lowest border border-outline-variant/30 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">account_tree</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Coordinador</p>
                      <p className="text-xs text-on-surface-variant">Gestión de flujo</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                    Ejecutando
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-outline-variant uppercase font-medium">
                    <span>Uso de Memoria</span>
                    <span>2.4 GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[45%]" />
                  </div>
                </div>
              </div>

              {/* Análisis */}
              <div className="p-md bg-surface-container-lowest border border-outline-variant/30 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface">psychology</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Análisis</p>
                      <p className="text-xs text-on-surface-variant">Cálculos estadísticos</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-secondary-fixed text-secondary text-[10px] font-bold uppercase rounded-full">
                    En espera
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-outline-variant uppercase font-medium">
                    <span>Tokens Consumidos</span>
                    <span>15.2k</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed-dim w-[82%]" />
                  </div>
                </div>
              </div>

              {/* Precios — amber / awaiting approval */}
              <div className="p-md bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-700">
                        monetization_on
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Precios</p>
                      <p className="text-xs text-on-surface-variant">Estrategia comercial</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      Aprobación
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-amber-700/60 uppercase font-medium">
                    <span>Carga del Sistema</span>
                    <span>Baja</span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Credits widget */}
            <div className="p-lg bg-primary-container rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-title-md font-bold">Consumo de Créditos</h3>
                  <span className="material-symbols-outlined text-secondary-fixed">info</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-code-mono font-bold">
                    {credits.toLocaleString("es-CO")}
                  </span>
                  <span className="text-outline-variant font-body-md">/ 10,000 unidades</span>
                </div>
                <div className="mt-lg w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((credits / 10000) * 100, 100).toFixed(1)}%`,
                      background: "linear-gradient(to right, #0058be, #adc6ff)",
                      transition: "width 1.2s ease",
                    }}
                  />
                </div>
                <p className="mt-md text-sm text-white/60">
                  Tasa de consumo actual:{" "}
                  <span className="text-secondary-fixed">8.5 / seg</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 pt-lg pb-margin-desktop">
              <button
                type="button"
                className="w-full py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-all group"
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                  pause_circle
                </span>
                Pausar Misión
              </button>
              <button
                type="button"
                className="w-full py-3 border border-error text-error font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-error-container transition-all group"
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                  stop_circle
                </span>
                Detener y Abortar
              </button>
              <button
                type="button"
                className="w-full py-3 bg-on-surface text-surface rounded-xl font-medium flex items-center justify-center gap-2 hover:brightness-125 transition-all"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                Ver borrador de reporte
              </button>
            </div>

          </div>
        </aside>
      </main>

      {/* Animations + terminal scrollbar */}
      <style>{`
        .typing-dot { animation: typing 1.4s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        .terminal-scroll::-webkit-scrollbar { width: 6px; }
        .terminal-scroll::-webkit-scrollbar-track { background: #1e293b; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </div>
  );
}
