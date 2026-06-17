"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "rocket_launch", label: "Misiones", href: "/app/misiones" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "analytics", label: "Reportes", href: "/app/reportes" },
  { icon: "smart_toy", label: "Agentes", href: "/app/agentes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

// ── Specialist agents ─────────────────────────────────────────────────────────

type SpecialistAgent = {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  category: string;
  categoryBg: string;
  categoryColor: string;
  description: string;
  accuracy: string;
  tokens: number;
};

const SPECIALISTS: SpecialistAgent[] = [
  {
    id: "analisis",
    name: "Agente de Análisis",
    icon: "query_stats",
    iconBg: "bg-[#F3E8FF]",
    iconColor: "text-purple-600",
    category: "Análisis",
    categoryBg: "bg-purple-100",
    categoryColor: "text-purple-700",
    description:
      "Detecta patrones complejos, anomalías y tendencias predictivas en sets de datos masivos.",
    accuracy: "94.7%",
    tokens: 12,
  },
  {
    id: "datos",
    name: "Agente de Datos",
    icon: "database",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
    category: "Datos",
    categoryBg: "bg-blue-100",
    categoryColor: "text-blue-700",
    description:
      "Ingesta, limpia y transforma fuentes heterogéneas para asegurar la calidad de la información.",
    accuracy: "97.1%",
    tokens: 8,
  },
  {
    id: "precios",
    name: "Agente de Precios",
    icon: "sell",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    category: "Ventas",
    categoryBg: "bg-orange-100",
    categoryColor: "text-orange-700",
    description:
      "Especialista en benchmark de mercado y optimización dinámica de márgenes.",
    accuracy: "92.0%",
    tokens: 15,
  },
  {
    id: "financiero",
    name: "Agente Financiero",
    icon: "account_balance",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    category: "Finanzas",
    categoryBg: "bg-teal-100",
    categoryColor: "text-teal-700",
    description:
      "Auditoría contable profunda y proyección de flujo de caja corporativo.",
    accuracy: "99.1%",
    tokens: 18,
  },
];

const MAX_SPECIALISTS = 3;
const COORDINATOR_TOKENS = 45;
const OVERHEAD = 315; // extra overhead on top of token rates

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EquipoPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<string>>(
    new Set(["analisis", "datos"])
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SPECIALISTS) {
        next.add(id);
      }
      return next;
    });
  }

  const selectedAgents = SPECIALISTS.filter((a) => selected.has(a.id));
  const totalTokens =
    COORDINATOR_TOKENS + selectedAgents.reduce((s, a) => s + a.tokens, 0);
  const totalCredits = totalTokens + OVERHEAD;
  const emptySlots = MAX_SPECIALISTS - selected.size;

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary-container flex flex-col p-4 gap-4 shadow-md z-50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-primary-fixed leading-tight">
              AgentHub
            </h1>
            <p className="font-label-sm text-label-sm text-on-primary-container">
              Portal de Cliente
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "text-on-primary bg-secondary"
                    : "text-on-primary-container hover:bg-surface-variant/10"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className={`font-body-md ${active ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-on-primary-container/20 pt-4">
          <Link
            href="/app/configuracion"
            className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-surface-variant/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-sm">Configuración</span>
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-surface-variant/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">help_center</span>
            <span className="font-label-sm">Soporte</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-[260px] flex-1 flex flex-col h-screen overflow-y-auto bg-surface relative">

        {/* Progress wizard header */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-margin-desktop py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {/* Step 1 — completed */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <span className="font-label-sm text-on-surface-variant">Definir Misión</span>
              </div>
              <div className="flex-1 h-[2px] mx-4 bg-secondary" />

              {/* Step 2 — active */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  2
                </div>
                <span className="font-label-sm text-secondary font-bold">
                  Equipo de Agentes
                </span>
              </div>
              <div className="flex-1 h-[2px] mx-4 bg-outline-variant" />

              {/* Step 3 — upcoming */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant text-on-surface-variant flex items-center justify-center font-bold">
                  3
                </div>
                <span className="font-label-sm text-on-surface-variant">
                  Revisar y Lanzar
                </span>
              </div>
            </div>

            {/* Progress bar 66% */}
            <div className="w-full bg-surface-container rounded-full h-1.5">
              <div className="bg-secondary h-1.5 rounded-full w-[66%] transition-all duration-700" />
            </div>
          </div>
        </header>

        {/* Two-column content */}
        <div className="flex flex-col md:flex-row gap-gutter px-margin-desktop py-xl max-w-7xl mx-auto w-full pb-32">

          {/* ═══════════════════════════════
              LEFT — Agent selection (60%)
          ═══════════════════════════════ */}
          <section className="w-full md:w-3/5 flex flex-col gap-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-1">
                Selecciona tus Agentes
              </h2>
              <p className="font-body-md text-on-surface-variant">
                El Agente Coordinador siempre está incluido. Añade hasta{" "}
                {MAX_SPECIALISTS} especialistas para esta misión.
              </p>
            </div>

            {/* Coordinator card */}
            <div
              className="rounded-xl p-lg text-white flex items-start gap-lg shadow-lg relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #131b2e 0%, #1e293b 100%)" }}
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 blur-3xl rounded-full pointer-events-none" />
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-4xl text-secondary-fixed"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
              </div>
              <div className="flex-1 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-title-md text-title-md font-bold">
                    Agente Coordinador
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    Incluido
                  </span>
                </div>
                <p className="font-body-md text-white/80 mb-4">
                  Siempre incluido — orquesta todo el equipo, gestiona el flujo de trabajo y
                  sintetiza los resultados finales.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Latencia", value: "< 2s" },
                    { label: "Precisión", value: "98.2%" },
                    { label: "Capacidad", value: "Multimodal" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 p-2 rounded-lg text-center">
                      <p className="text-[10px] uppercase text-white/40 mb-1">{stat.label}</p>
                      <p className="font-label-sm font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specialist grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {SPECIALISTS.map((agent) => {
                const isSelected = selected.has(agent.id);
                const isDisabled = !isSelected && selected.size >= MAX_SPECIALISTS;

                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => toggle(agent.id)}
                    disabled={isDisabled}
                    className={`rounded-xl p-md flex flex-col gap-3 shadow-sm text-left transition-all hover:shadow-md ${
                      isSelected
                        ? "border-2 border-secondary bg-[#f0f7ff]"
                        : isDisabled
                        ? "bg-white border border-outline-variant opacity-50 cursor-not-allowed"
                        : "bg-white border border-outline-variant hover:border-secondary/50 group"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className={`w-12 h-12 ${agent.iconBg} ${agent.iconColor} rounded-lg flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined">{agent.icon}</span>
                      </div>
                      {isSelected ? (
                        <span
                          className="material-symbols-outlined text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-secondary transition-colors" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-title-md text-on-surface font-bold">
                          {agent.name}
                        </h4>
                        <span
                          className={`${agent.categoryBg} ${agent.categoryColor} px-2 py-0.5 rounded text-[10px] font-bold`}
                        >
                          {agent.category}
                        </span>
                      </div>
                      <p className="font-body-md text-on-surface-variant text-sm line-clamp-2">
                        {agent.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
                      <span className="text-xs font-medium text-on-surface-variant">
                        {agent.accuracy} Accuracy
                      </span>
                      <span
                        className={`font-label-sm font-bold ${
                          isSelected ? "text-secondary" : "text-on-surface-variant"
                        }`}
                      >
                        {agent.tokens} tokens/hr
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info banner */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
              <span className="material-symbols-outlined text-amber-600 shrink-0">bolt</span>
              <p className="font-body-md text-amber-800">
                <strong>Tip:</strong> Una configuración con más agentes permite mayor cobertura y
                profundidad en los hallazgos, pero incrementa el consumo proporcional de créditos
                por hora de ejecución.
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════
              RIGHT — Mission summary (40%)
          ═══════════════════════════════ */}
          <aside className="w-full md:w-2/5 flex flex-col gap-lg h-fit sticky top-40">
            <div className="bg-white rounded-xl shadow-md border border-outline-variant overflow-hidden">
              <div className="bg-surface-container-low px-lg py-4 border-b border-outline-variant">
                <h3 className="font-title-md text-on-surface font-bold">Resumen de Misión</h3>
              </div>

              <div className="p-lg flex flex-col gap-lg">
                {/* Mission recap */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Misión Seleccionada
                  </h4>
                  <div className="p-3 bg-surface-container rounded-lg">
                    <p className="font-title-md text-primary font-bold mb-1">
                      Análisis de Inventario Regional Q4
                    </p>
                    <p className="font-body-md text-on-surface-variant text-sm mb-3 italic">
                      "Auditar stock crítico y detectar fugas de eficiencia en nodos logísticos."
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-white px-2 py-1 rounded-md border border-outline-variant text-[10px] font-bold text-on-surface">
                        Retail
                      </span>
                      <span className="bg-white px-2 py-1 rounded-md border border-outline-variant text-[10px] font-bold text-on-surface">
                        Estratégico
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team list */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Equipo Configurado ({selected.size + 1}/{MAX_SPECIALISTS + 1})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {/* Coordinator — locked */}
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      <span className="font-body-md text-on-surface">
                        Coordinador (Principal)
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant text-xs ml-auto">
                        lock
                      </span>
                    </div>

                    {/* Selected specialists */}
                    {selectedAgents.map((a) => (
                      <div key={a.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                        <span className="font-body-md text-on-surface">{a.name}</span>
                        <button
                          type="button"
                          onClick={() => toggle(a.id)}
                          className="material-symbols-outlined text-error text-xs ml-auto hover:scale-110 transition-transform"
                        >
                          close
                        </button>
                      </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant/50"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span className="text-xs font-medium">Espacio disponible (Especialista)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost estimate */}
                <div className="pt-4 border-t border-outline-variant">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-label-sm text-on-surface-variant">Costo Estimado</span>
                    <p className="font-code-mono text-xl font-bold text-secondary">
                      ~{totalCredits} créditos / hora
                    </p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant text-right">
                    Base: {totalTokens} tokens/hr + overhead operativo
                  </p>
                </div>

                {/* Plan usage */}
                <div className="bg-surface-container-high p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-label-sm text-on-surface font-semibold">
                      Saldo disponible
                    </span>
                    <span className="font-label-sm font-bold text-on-surface">
                      5,769 créditos
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[82%]" />
                  </div>
                </div>

                {/* Files */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Archivos de Contexto
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: "csv", name: "Inventario_Q3.csv" },
                      { icon: "table", name: "Ventas_Historico.xlsx" },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center gap-2 p-2 bg-surface-container rounded-md"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">
                          {f.icon}
                        </span>
                        <span className="text-xs truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom action bar */}
        <footer className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-outline-variant px-margin-desktop py-4 z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Link
            href="/app/misiones/nueva"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Definir Misión
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-all active:scale-95"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => router.push("/app/misiones/nueva/revisar")}
              className="px-8 py-2.5 rounded-xl bg-secondary text-white font-bold hover:shadow-lg hover:shadow-secondary/20 flex items-center gap-2 transition-all active:scale-95"
            >
              Continuar: Revisar y Lanzar
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </footer>

        {/* Background decoration */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none -z-10 opacity-30">
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full" />
        </div>
      </main>
    </div>
  );
}
