"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "rocket_launch", label: "Misiones", href: "/app/misiones" },
  { icon: "data_usage", label: "Uso", href: "/app/uso" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "analytics", label: "Reportes", href: "/app/reportes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

// ── Bar chart data ────────────────────────────────────────────────────────────

// Heights as percentage of chart area (100% = 720 credits peak)
const BAR_DATA = [
  { day: "01", pct: 45 },
  { day: "02", pct: 60 },
  { day: "03", pct: 55 },
  { day: "04", pct: 30 },
  { day: "05", pct: 80 },
  { day: "06", pct: 70 },
  { day: "07", pct: 40 },
  { day: "08", pct: 65 },
  { day: "09", pct: 90 },
  { day: "10", pct: 100, peak: true },
  { day: "11", pct: 50 },
  { day: "12", pct: 45 },
  { day: "13", pct: 85 },
  { day: "14", pct: 60 },
];

// ── Agent consumption ─────────────────────────────────────────────────────────

const AGENT_ROWS = [
  {
    icon: "manage_accounts",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    barColor: "bg-indigo-600",
    name: "Agente Coordinador",
    pct: 44.7,
    tokens: "1,891",
  },
  {
    icon: "troubleshoot",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    barColor: "bg-cyan-600",
    name: "Agente de Análisis",
    pct: 21.0,
    tokens: "889",
  },
  {
    icon: "database",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    barColor: "bg-emerald-600",
    name: "Agente de Datos",
    pct: 15.4,
    tokens: "651",
  },
  {
    icon: "sell",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    barColor: "bg-amber-600",
    name: "Agente de Precios",
    pct: 12.1,
    tokens: "512",
  },
  {
    icon: "account_balance",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    barColor: "bg-rose-600",
    name: "Agente Financiero",
    pct: 6.9,
    tokens: "292",
  },
];

// ── Mission rows ──────────────────────────────────────────────────────────────

const MISSION_ROWS = [
  { id: "MIS-2094", name: "Análisis de Mercado Q3", statusLabel: "Activa", statusClass: "bg-green-100 text-green-700" },
  { id: "MIS-2091", name: "Procesamiento de Facturas", statusLabel: "En Pausa", statusClass: "bg-blue-100 text-blue-700" },
  { id: "MIS-2095", name: "Conciliación Bancaria", statusLabel: "Activa", statusClass: "bg-green-100 text-green-700" },
];

// ── Billing rows ──────────────────────────────────────────────────────────────

const BILLING_ROWS = [
  { period: "Mayo 2025", credits: "8,450 / 10,000", amount: "$450.00" },
  { period: "Abril 2025", credits: "9,120 / 10,000", amount: "$450.00" },
  { period: "Marzo 2025", credits: "6,740 / 10,000", amount: "$450.00" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsoPage() {
  const pathname = usePathname();

  return (
    <div className="flex bg-background text-on-surface font-body-md min-h-screen relative">

      {/* dot-grid bg */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(#0058be 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container flex flex-col p-4 shadow-md z-20">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-on-secondary-container rounded flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-primary-container leading-none">
              AgentHub
            </h1>
            <p className="text-[10px] text-on-primary-container/60 uppercase tracking-widest mt-1">
              Empresarial
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  active
                    ? "bg-secondary-container text-on-secondary-container font-medium shadow-sm"
                    : "text-on-primary-container hover:bg-on-primary-fixed-variant"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${active ? "" : "group-hover:scale-110 transition-transform"}`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-title-md text-title-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-on-primary-fixed-variant/30 pt-4">
          <button
            type="button"
            className="w-full text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)" }}
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span className="font-body-md text-body-md">Optimizar con Agente</span>
          </button>
          <div className="space-y-1">
            <Link
              href="/app/configuracion"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body-md text-body-md">Configuración</span>
            </Link>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
              <span className="font-body-md text-body-md">Ayuda</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-[260px] flex-1 min-h-screen flex flex-col">

        {/* Top app bar */}
        <header className="sticky top-0 z-10 w-full bg-surface-bright border-b border-outline-variant h-16 px-gutter flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-on-surface">Uso y Créditos</h2>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Período actual: 1–30 jun 2025
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">event_repeat</span>
              <span className="font-label-sm text-label-sm text-amber-700 font-medium">
                Renovación en 15 días
              </span>
            </div>
            <button
              type="button"
              className="bg-secondary text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 active:opacity-80 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              <span className="font-body-md text-body-md">Comprar créditos</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2" />
            <button type="button" className="text-on-surface-variant hover:text-secondary p-2 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="text-on-surface-variant hover:text-secondary p-2 transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-gutter space-y-gutter max-w-7xl mx-auto w-full">

          {/* ── Hero plan card ── */}
          <section
            className="rounded-xl p-8 text-white flex flex-col md:flex-row gap-8 items-center shadow-lg relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #131b2e 0%, #0058be 100%)" }}
          >
            {/* Decorative icon */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <span
                className="material-symbols-outlined text-[240px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>

            {/* Left — credits */}
            <div className="flex-1 w-full space-y-6 relative z-10">
              <div>
                <span className="bg-white/10 px-3 py-1 rounded-full font-label-sm text-label-sm text-on-secondary-container">
                  PLAN ACTUAL: BUSINESS PRO
                </span>
                <h3 className="text-[40px] font-bold leading-tight mt-4 font-code-mono">5,769</h3>
                <p className="text-on-secondary-container/80 font-body-lg text-body-lg">
                  créditos disponibles
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-label-sm text-label-sm uppercase tracking-wider">
                  <span>Uso del período</span>
                  <span className="font-code-mono">42%</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full w-[42%] transition-all duration-1000 ease-out" />
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-secondary-container/70 font-code-mono">
                  <span>4,231 USADOS</span>
                  <span>10,000 TOTAL</span>
                </div>
              </div>
            </div>

            {/* Right — stats box */}
            <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4 border border-white/10 relative z-10">
              {[
                { label: "Tasa actual", value: "8.5", unit: "/seg" },
                { label: "Misiones activas", value: "2", unit: "" },
                { label: "Estimado restante", value: "11.3 hrs", unit: "" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`flex justify-between items-center ${i < 2 ? "border-b border-white/10 pb-3" : "pb-3"}`}
                >
                  <span className="font-body-md text-body-md text-white/80">{s.label}</span>
                  <span className="font-title-md text-title-md font-bold font-code-mono">
                    {s.value}
                    {s.unit && (
                      <span className="text-[12px] font-normal"> {s.unit}</span>
                    )}
                  </span>
                </div>
              ))}
              <a
                href="#billing"
                className="flex items-center justify-center gap-2 text-white/90 hover:text-white font-body-md font-medium pt-2 transition-colors"
              >
                Ver historial de facturas
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </section>

          {/* ── Bar chart ── */}
          <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h4 className="font-title-md text-title-md font-bold text-on-surface">
                  Consumo diario
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Actividad de créditos del 1 al 14 de Junio
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pico</p>
                  <p className="font-title-md text-title-md font-bold font-code-mono text-secondary">720</p>
                </div>
                <div className="text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Promedio</p>
                  <p className="font-title-md text-title-md font-bold font-code-mono">302</p>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between h-48 gap-2 md:gap-4 border-b border-outline-variant pb-2">
              {BAR_DATA.map((bar) => (
                <div key={bar.day} className="group relative flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      bar.peak
                        ? "bg-secondary"
                        : "bg-secondary-container/30 group-hover:bg-secondary"
                    }`}
                    style={{ height: `${bar.pct}%` }}
                  />
                  {bar.peak && (
                    <div className="absolute -top-10 bg-on-surface text-white text-[10px] px-2 py-1 rounded font-code-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      720 credits
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-6 text-[10px] font-code-mono ${
                      bar.peak ? "font-bold text-secondary" : "text-outline"
                    }`}
                  >
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary chips */}
            <div className="mt-12 flex flex-wrap gap-4 items-center">
              <span className="font-body-md text-body-md text-on-surface-variant font-medium">
                Resumen del período:
              </span>
              {[
                { dot: "bg-secondary", label: "Pico:", value: "720 (Jun 10)" },
                { dot: "bg-on-primary-container", label: "Promedio:", value: "302" },
                { dot: "bg-on-secondary-fixed-variant", label: "Total:", value: "4,231" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant"
                >
                  <span className={`w-2 h-2 rounded-full ${chip.dot}`} />
                  <span className="font-label-sm text-label-sm font-medium">
                    {chip.label}{" "}
                    <span className="font-code-mono">{chip.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Two-column row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-gutter">

            {/* Agent consumption (60%) */}
            <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-title-md text-title-md font-bold">Consumo por Agente</h4>
                <button type="button" className="text-secondary font-body-md font-medium hover:underline">
                  Ver detalles
                </button>
              </div>
              <div className="space-y-6">
                {AGENT_ROWS.map((agent) => (
                  <div key={agent.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded ${agent.iconBg} flex items-center justify-center`}
                        >
                          <span
                            className={`material-symbols-outlined ${agent.iconColor} text-[20px]`}
                          >
                            {agent.icon}
                          </span>
                        </div>
                        <span className="font-body-lg text-body-lg font-medium">{agent.name}</span>
                      </div>
                      <span className="font-code-mono font-medium">
                        {agent.pct}% ({agent.tokens})
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full">
                      <div
                        className={`${agent.barColor} h-full rounded-full`}
                        style={{ width: `${agent.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column (40%) */}
            <div className="lg:col-span-4 flex flex-col gap-gutter">

              {/* Consumo por misión */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex-1">
                <h4 className="font-title-md text-title-md font-bold mb-4">Consumo por Misión</h4>
                <div className="space-y-4">
                  {MISSION_ROWS.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant transition-all cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-body-md text-body-md font-bold font-code-mono">
                          {m.id}
                        </span>
                        <span className="text-[12px] text-on-surface-variant">{m.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${m.statusClass}`}
                      >
                        {m.statusLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Límites del plan */}
              <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
                <h4 className="font-title-md text-title-md font-bold mb-4">Límites del plan</h4>
                <div className="space-y-4">
                  {[
                    { label: "Créditos mensuales", value: "10,000", isError: false },
                    { label: "Misiones simultáneas", value: "5 max", isError: false },
                    { label: "Agentes por misión", value: "10/10", isError: true },
                    { label: "Almacenamiento IA", value: "50 GB", isError: false },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center font-body-md text-body-md">
                      <span className="text-on-surface-variant">{row.label}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-code-mono font-medium ${
                            row.isError ? "font-bold text-error" : ""
                          }`}
                        >
                          {row.value}
                        </span>
                        {row.isError && (
                          <span className="material-symbols-outlined text-error text-[18px]">
                            warning
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full mt-4 border border-outline-variant py-2 rounded-lg font-body-md font-medium hover:bg-surface-container transition-colors"
                  >
                    Mejorar Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Billing history ── */}
          <section
            id="billing"
            className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mb-12"
          >
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-title-md text-title-md font-bold">Historial de facturación</h4>
              <button
                type="button"
                className="flex items-center gap-2 text-secondary font-body-md font-medium hover:underline"
              >
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                Descargar Reporte Anual
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low font-label-sm text-label-sm uppercase text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Período</th>
                    <th className="px-6 py-4 font-semibold">Créditos</th>
                    <th className="px-6 py-4 font-semibold">Monto</th>
                    <th className="px-6 py-4 font-semibold text-center">Estado</th>
                    <th className="px-6 py-4 font-semibold text-right">Factura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {BILLING_ROWS.map((row) => (
                    <tr key={row.period} className="hover:bg-surface-container transition-colors group">
                      <td className="px-6 py-4 font-title-md text-title-md text-on-primary-fixed">
                        {row.period}
                      </td>
                      <td className="px-6 py-4 font-code-mono">{row.credits}</td>
                      <td className="px-6 py-4 font-code-mono font-medium">{row.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-full">
                          Pagado
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-on-surface-variant hover:text-secondary group-hover:text-secondary p-1 transition-colors"
                        >
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Mobile sticky bottom */}
        <div className="md:hidden sticky bottom-0 w-full bg-white border-t border-outline-variant p-4 flex justify-between items-center shadow-2xl z-30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Créditos actuales</span>
            <span className="font-title-md text-title-md font-bold font-code-mono">5,769</span>
          </div>
          <button
            type="button"
            className="bg-secondary text-white px-6 py-2 rounded-lg font-medium"
          >
            Recargar
          </button>
        </div>
      </main>
    </div>
  );
}
