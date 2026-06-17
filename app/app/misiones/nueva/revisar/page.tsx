"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/app/dashboard", icon: "dashboard", label: "Panel de Control" },
  { href: "/app/misiones", icon: "assignment", label: "Misiones" },
  { href: "/app/empresas", icon: "business", label: "Empresas" },
  { href: "/app/agentes", icon: "smart_toy", label: "Agentes" },
  { href: "/app/configuracion", icon: "settings", label: "Configuración" },
];

const SPECIALISTS = [
  { icon: "analytics", label: "Analista de Mercado", tokens: "35 tok/min" },
  { icon: "database", label: "Gestor de Datos", tokens: "30 tok/min" },
  { icon: "trending_up", label: "Predictor de Tendencias", tokens: "30 tok/min" },
];

const DOCS = [
  { icon: "table_chart", iconClass: "text-secondary", name: "Catalogo_Productos_2025.xlsx" },
  { icon: "picture_as_pdf", iconClass: "text-error", name: "Competencia_Q1.pdf" },
];

const CHECKLIST = [
  "Agentes configurados y listos",
  "Créditos corporativos validados",
  "Contexto de misión cargado",
  "Objetivos de KPI definidos",
];

export default function RevisarPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    setLaunching(true);
    setTimeout(() => {
      router.push("/app/misiones/nueva-mision-id/ejecucion");
    }, 1500);
  }

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%   { box-shadow: 0 0 0 0 rgba(33,112,228,0.4); }
          70%  { box-shadow: 0 0 0 15px rgba(33,112,228,0); }
          100% { box-shadow: 0 0 0 0 rgba(33,112,228,0); }
        }
        .btn-launch-pulse:hover { animation: pulse-glow 1.5s infinite; }
      `}</style>

      <div className="bg-background text-on-surface min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-[260px] h-screen sticky left-0 top-0 bg-primary-container flex flex-col py-lg px-md shrink-0">
          <div className="mb-2xl px-sm">
            <h1 className="font-bold text-xl text-on-secondary-container">AgentHub</h1>
            <p className="font-code-mono text-xs text-on-primary-container mt-xs">Corporativo v2.1</p>
          </div>

          <nav className="flex-1 space-y-sm">
            {NAV_ITEMS.map(({ href, icon, label }) => {
              const isActive = href === "/app/misiones";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container font-bold"
                      : "text-on-primary-container hover:bg-white/10"
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-body-md">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-md bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-code-mono text-xs text-on-primary-container">Sistema Activo</span>
            </div>
            <Link
              href="/app/misiones/nueva"
              className="w-full py-sm px-md bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nueva Misión
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* Step header */}
          <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant px-gutter h-20 flex items-center justify-center">
            <div className="max-w-4xl w-full flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0">
                <div className="w-full h-full bg-secondary" />
              </div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-xs">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <span className="font-code-mono text-xs text-on-surface-variant">Configuración</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-xs">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <span className="font-code-mono text-xs text-on-surface-variant">Equipo</span>
              </div>

              {/* Step 3 — active */}
              <div className="relative z-10 flex flex-col items-center gap-xs">
                <div className="w-10 h-10 rounded-full bg-secondary-container border-2 border-secondary flex items-center justify-center text-white">
                  <span className="font-bold">3</span>
                </div>
                <span className="font-code-mono text-xs font-bold text-on-surface">Revisar</span>
              </div>
            </div>
          </header>

          {/* Content grid */}
          <div className="flex-1 p-gutter grid grid-cols-12 gap-gutter max-w-[1440px] mx-auto w-full pb-32">
            {/* Left: review details */}
            <section className="col-span-12 lg:col-span-7 space-y-gutter">
              {/* Mission details */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                <h2 className="font-bold text-lg text-primary-container mb-lg border-l-4 border-secondary pl-md">
                  Detalles de la Misión
                </h2>
                <div className="space-y-md">
                  <div>
                    <p className="font-code-mono text-xs text-on-surface-variant mb-xs">Nombre del Proyecto</p>
                    <h3 className="font-extrabold text-2xl text-on-surface">
                      Análisis de competencia retail Q2 2025
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-sm">
                    <span className="px-sm py-xs bg-secondary-fixed text-on-secondary-fixed font-code-mono text-xs rounded-lg font-bold uppercase">
                      Retail & Logística
                    </span>
                    <span className="px-sm py-xs bg-tertiary-fixed text-on-tertiary-fixed font-code-mono text-xs rounded-lg font-bold uppercase">
                      Profunda (Alto impacto)
                    </span>
                    <span className="px-sm py-xs bg-surface-container-high text-on-surface-variant font-code-mono text-xs rounded-lg font-bold flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Inicio: Inmediata
                    </span>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                <h2 className="font-bold text-lg text-primary-container mb-lg border-l-4 border-secondary pl-md">
                  Equipo Asignado
                </h2>
                <div className="space-y-sm">
                  {/* Coordinator */}
                  <div className="flex items-center justify-between p-md bg-secondary-container/5 rounded-lg border border-secondary/20">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">supervisor_account</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Agente Coordinador</p>
                        <p className="font-code-mono text-xs text-on-surface-variant">Liderazgo & Orquestación</p>
                      </div>
                    </div>
                    <span className="font-code-mono text-sm font-bold text-secondary">45 tok/min</span>
                  </div>

                  {/* Specialists */}
                  <div className="divide-y divide-outline-variant/30">
                    {SPECIALISTS.map(({ icon, label, tokens }) => (
                      <div key={label} className="flex items-center justify-between p-md">
                        <div className="flex items-center gap-md">
                          <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                          </div>
                          <span className="text-body-md text-on-surface">{label}</span>
                        </div>
                        <span className="font-code-mono text-sm text-on-surface-variant">{tokens}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-md pt-md border-t-2 border-dashed border-outline-variant flex justify-between items-center px-md">
                    <span className="font-bold text-on-surface">Consumo Total del Equipo</span>
                    <span className="font-code-mono text-xl font-bold text-secondary-container">140 tok/min</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                <h2 className="font-bold text-lg text-primary-container mb-lg border-l-4 border-secondary pl-md">
                  Documentos de Contexto
                </h2>
                <div className="flex flex-wrap gap-sm">
                  {DOCS.map(({ icon, iconClass, name }) => (
                    <div
                      key={name}
                      className="flex items-center gap-sm px-md py-sm bg-surface-container-high border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${iconClass}`}>{icon}</span>
                      <span className="font-code-mono text-xs">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right: launch card */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="sticky top-24 bg-surface-container-lowest border-2 border-secondary shadow-lg rounded-xl p-lg overflow-hidden">
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ background: "linear-gradient(90deg, #0058be, #7073ff)" }}
                />

                <div className="flex items-center justify-between mb-lg">
                  <h2 className="font-extrabold text-lg text-on-surface">Resumen de Inversión</h2>
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    rocket_launch
                  </span>
                </div>

                {/* Cost table */}
                <table className="w-full mb-lg">
                  <tbody className="divide-y divide-outline-variant/30">
                    {[
                      { label: "Equipo base", value: "315 cr." },
                      { label: "Procesamiento Docs", value: "40 cr." },
                      { label: "Costos Operativos", value: "25 cr." },
                    ].map(({ label, value }) => (
                      <tr key={label}>
                        <td className="py-sm text-on-surface-variant text-body-md">{label}</td>
                        <td className="py-sm text-right font-code-mono text-sm">{value}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="pt-md text-on-surface text-lg">Total estimado</td>
                      <td className="pt-md text-right font-code-mono text-2xl text-secondary">380 cr.</td>
                    </tr>
                  </tbody>
                </table>

                {/* Duration */}
                <div className="bg-surface-container p-md rounded-lg mb-lg border border-outline-variant/50">
                  <p className="font-code-mono text-xs text-on-surface-variant mb-xs">Duración estimada de ejecución</p>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary">timer</span>
                    <span className="font-code-mono text-2xl font-bold text-on-surface">45 – 90 min</span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-sm mb-xl">
                  {CHECKLIST.map((item) => (
                    <div key={item} className="flex items-center gap-md">
                      <span
                        className="material-symbols-outlined text-emerald-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span className="font-code-mono text-xs text-on-surface">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Launch button */}
                <button
                  onClick={handleLaunch}
                  disabled={launching}
                  className="btn-launch-pulse w-full py-md px-lg text-white rounded-xl font-bold text-lg flex items-center justify-center gap-md transition-all active:scale-95 shadow-md disabled:opacity-70"
                  style={{ background: "linear-gradient(90deg, #0058be 0%, #7073ff 100%)" }}
                >
                  {launching ? "Iniciando..." : "Lanzar Misión"}
                  {!launching && <span className="material-symbols-outlined">rocket</span>}
                </button>

                <p className="text-center font-code-mono text-xs text-on-surface-variant mt-md italic">
                  *Al lanzar se descontarán 380 créditos de la cuenta corporativa.
                </p>
              </div>
            </aside>
          </div>

          {/* Fixed bottom bar */}
          <footer className="fixed bottom-0 left-[260px] right-0 h-20 bg-surface border-t border-outline-variant px-gutter flex items-center justify-between z-50">
            <div className="flex items-center gap-md">
              <Link
                href="/app/misiones/nueva/equipo"
                className="px-xl py-sm border border-outline text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Atrás
              </Link>
              <button className="px-xl py-sm text-secondary font-bold hover:bg-secondary/5 rounded-lg transition-colors">
                Guardar borrador
              </button>
            </div>
            <div className="flex items-center gap-gutter">
              <div className="hidden md:block text-right">
                <p className="font-code-mono text-xs text-on-surface-variant">Créditos disponibles</p>
                <p className="font-code-mono text-sm font-bold text-on-surface">12,450 cr.</p>
              </div>
              <button
                onClick={handleLaunch}
                disabled={launching}
                className="px-2xl py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-70"
              >
                {launching ? "Iniciando..." : "Lanzar Misión"}
              </button>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
