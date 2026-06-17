"use client";

import Link from "next/link";
import { useState } from "react";

type Plan = "Pro" | "Starter" | "Trial";
type Status = "Activo" | "Alerta" | "Inactivo";
type PlanFilter = "todos" | "pro" | "starter" | "trial" | "churned";
type PanelTab = "resumen" | "usuarios" | "facturas" | "actividad";

interface Company {
  name: string;
  domain: string;
  plan: Plan;
  users: number;
  usagePct: number;
  usageLabel?: string;
  mrr: string;
  status: Status;
  time: string;
}

const COMPANIES: Company[] = [
  { name: "Nexus AI Systems", domain: "nexus-ai.com", plan: "Pro",     users: 128, usagePct: 82, usageLabel: "4.1k/5k", mrr: "$1,450", status: "Activo",   time: "Hace 2m" },
  { name: "Logistics Cloud",  domain: "logicloud.io",  plan: "Starter", users: 15,  usagePct: 24, usageLabel: "120/500", mrr: "$299",   status: "Activo",   time: "Hace 1h" },
  { name: "Fintech Flow",     domain: "fflow.co",      plan: "Pro",     users: 42,  usagePct: 65, mrr: "$890",   status: "Activo",   time: "14m" },
  { name: "Global Devs",      domain: "gdevs.net",     plan: "Starter", users: 8,   usagePct: 92, mrr: "$199",   status: "Alerta",   time: "5h" },
  { name: "HealthTech AI",    domain: "htai.med",      plan: "Pro",     users: 212, usagePct: 45, mrr: "$2,200", status: "Activo",   time: "2m" },
  { name: "Retail One",       domain: "retail.one",    plan: "Trial",   users: 3,   usagePct: 10, mrr: "$0",     status: "Inactivo", time: "3d" },
  { name: "Stream Engine",    domain: "stream.io",     plan: "Pro",     users: 56,  usagePct: 78, mrr: "$1,100", status: "Activo",   time: "12m" },
  { name: "Block Alpha",      domain: "balpha.com",    plan: "Starter", users: 12,  usagePct: 33, mrr: "$299",   status: "Activo",   time: "22h" },
  { name: "Zenith Space",     domain: "zenith.sp",     plan: "Trial",   users: 5,   usagePct: 98, mrr: "$0",     status: "Alerta",   time: "1h" },
  { name: "Aero Dynamics",    domain: "aero.dyn",      plan: "Pro",     users: 89,  usagePct: 55, mrr: "$1,450", status: "Activo",   time: "45m" },
];

const PLAN_BADGE: Record<Plan, string> = {
  Pro:     "bg-secondary-fixed text-on-secondary-fixed-variant",
  Starter: "bg-surface-container-highest text-on-surface-variant",
  Trial:   "bg-tertiary-fixed text-on-tertiary-fixed",
};

const STATUS_DOT: Record<Status, string> = {
  Activo:   "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
  Alerta:   "bg-amber-500",
  Inactivo: "bg-outline",
};

const TOTAL_PAGES = 35;

export default function UsuariosPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PlanFilter>("todos");
  const [page, setPage] = useState(1);
  const [panelCompany, setPanelCompany] = useState<Company | null>(null);
  const [panelTab, setPanelTab] = useState<PanelTab>("resumen");

  function openPanel(company: Company) {
    setPanelCompany(company);
    setPanelTab("resumen");
  }

  function closePanel() {
    setPanelCompany(null);
  }

  const FILTER_LABELS: { key: PlanFilter; label: string }[] = [
    { key: "todos",   label: "Todos" },
    { key: "pro",     label: "Pro" },
    { key: "starter", label: "Starter" },
    { key: "trial",   label: "Trial" },
    { key: "churned", label: "Churned" },
  ];

  const PANEL_TABS: { key: PanelTab; label: string }[] = [
    { key: "resumen",   label: "Resumen" },
    { key: "usuarios",  label: "Usuarios" },
    { key: "facturas",  label: "Facturas" },
    { key: "actividad", label: "Actividad" },
  ];

  return (
    <>
      <main className="h-screen flex flex-col overflow-hidden bg-background w-full">
          {/* Top bar */}
          <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md px-lg py-md flex justify-between items-center border-b border-outline-variant">
            <div>
              <h2 className="text-on-surface font-bold text-2xl">Usuarios</h2>
              <p className="text-on-surface-variant text-body-md">Gestión de cuentas y empresas activas en la plataforma.</p>
            </div>
            <div className="flex items-center gap-md">
              <button className="flex items-center gap-sm px-lg py-sm rounded-lg border border-outline-variant text-on-surface-variant font-medium hover:bg-surface-container-high transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exportar CSV
              </button>
              <button className="flex items-center gap-sm px-lg py-sm rounded-lg bg-secondary text-white font-bold shadow-lg hover:bg-on-secondary-fixed-variant transition-all active:scale-95">
                <span className="material-symbols-outlined">add</span>
                Nuevo usuario
              </button>
            </div>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-lg py-lg space-y-lg">
            {/* KPI strip */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              {[
                { icon: "business",      iconClass: "text-secondary bg-secondary-fixed", label: "Total empresas",  value: "342",     badge: "+12 hoy",  badgeClass: "text-outline" },
                { icon: "person",        iconClass: "text-secondary bg-secondary-fixed", label: "Usuarios activos", value: "1,847",   badge: "+84 hoy",  badgeClass: "text-outline" },
                { icon: "payments",      iconClass: "text-secondary bg-secondary-fixed", label: "MRR",             value: "$42,300", badge: "+8.2%",    badgeClass: "text-secondary-container font-bold" },
                { icon: "trending_down", iconClass: "text-error bg-error/10",            label: "Churn",           value: "3",       badge: "- 0.9%",   badgeClass: "text-error font-bold" },
              ].map(({ icon, iconClass, label, value, badge, badgeClass }) => (
                <div
                  key={label}
                  className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-secondary transition-colors"
                >
                  <div className="flex justify-between items-start mb-sm">
                    <span className={`material-symbols-outlined p-sm rounded-lg ${iconClass}`}>{icon}</span>
                    <span className={`font-code-mono text-[11px] ${badgeClass}`}>{badge}</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-medium uppercase tracking-wide">{label}</p>
                  <h3 className="text-on-surface font-bold text-2xl font-code-mono">{value}</h3>
                </div>
              ))}
            </section>

            {/* Filter bar */}
            <section className="flex flex-col lg:flex-row justify-between items-center gap-md">
              <div className="relative w-full lg:w-1/3">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar empresa o usuario..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-on-surface"
                />
              </div>
              <div className="flex items-center gap-sm overflow-x-auto w-full lg:w-auto">
                {FILTER_LABELS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-md py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                      activeFilter === key
                        ? "bg-secondary text-white"
                        : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <div className="h-6 w-px bg-outline-variant mx-sm hidden lg:block" />
                <button className="flex items-center gap-xs px-md py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">sort</span>
                  Ordenar
                </button>
              </div>
            </section>

            {/* Table */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant">
                      {["Empresa", "Plan", "Usuarios", "Créditos", "MRR", "Estado", "Última actividad", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-lg py-md font-code-mono text-[11px] text-outline font-semibold uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {COMPANIES.map((c) => (
                      <tr
                        key={c.name}
                        className="hover:bg-surface-container-low cursor-pointer transition-colors group"
                        onClick={() => openPanel(c)}
                      >
                        {/* Company */}
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-md">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline font-bold font-code-mono border border-outline-variant group-hover:border-secondary transition-colors flex-shrink-0">
                              {c.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface">{c.name}</p>
                              <p className="font-code-mono text-[11px] text-outline">{c.domain}</p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-lg py-md">
                          <span
                            className={`px-sm py-0.5 rounded-full font-code-mono text-[11px] font-bold uppercase tracking-wide ${PLAN_BADGE[c.plan]}`}
                          >
                            {c.plan}
                          </span>
                        </td>

                        {/* Users */}
                        <td className="px-lg py-md font-code-mono text-on-surface">{c.users}</td>

                        {/* Credits */}
                        <td className="px-lg py-md">
                          <div className="w-24">
                            {c.usageLabel && (
                              <div className="flex justify-between font-code-mono text-[10px] text-outline mb-1">
                                <span>{c.usagePct}%</span>
                                <span>{c.usageLabel}</span>
                              </div>
                            )}
                            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{ width: `${c.usagePct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* MRR */}
                        <td className="px-lg py-md font-code-mono font-semibold text-on-surface">{c.mrr}</td>

                        {/* Status */}
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[c.status]}`} />
                            <span className="text-body-md text-on-surface-variant font-medium">{c.status}</span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-lg py-md font-code-mono text-outline">{c.time}</td>

                        {/* Actions */}
                        <td className="px-lg py-md text-right">
                          <button
                            className="text-outline hover:text-on-surface transition-colors p-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-lg py-md bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
                <p className="font-code-mono text-[11px] text-outline font-medium">
                  Mostrando{" "}
                  <span className="text-on-surface font-code-mono">10</span> de{" "}
                  <span className="text-on-surface font-code-mono">342</span> empresas
                </p>
                <div className="flex gap-xs items-center">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded border border-outline-variant bg-surface-container-lowest text-outline hover:bg-surface-container-high transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded font-bold text-sm transition-colors ${
                        page === n
                          ? "bg-secondary text-white"
                          : "hover:bg-surface-container-high text-on-surface-variant font-medium"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                    disabled={page === TOTAL_PAGES}
                    className="p-1 rounded border border-outline-variant bg-surface-container-lowest text-outline hover:bg-surface-container-high transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

      {/* Overlay */}
      {panelCompany && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={closePanel}
        />
      )}

      {/* Detail panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[420px] bg-background shadow-2xl z-[70] border-l border-outline-variant overflow-y-auto transition-transform duration-300 ease-out ${
          panelCompany ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 p-2 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-full transition-all"
          onClick={closePanel}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {panelCompany && (
          <div className="p-xl space-y-xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-md">
              <div className="w-24 h-24 rounded-2xl bg-secondary-container flex items-center justify-center border-4 border-surface shadow-xl relative">
                <span className="text-5xl font-extrabold text-on-secondary-container">
                  {panelCompany.name[0]}
                </span>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-surface shadow-md" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-on-surface">{panelCompany.name}</h3>
                <div className="mt-xs flex items-center justify-center gap-sm">
                  <span
                    className={`px-sm py-0.5 rounded-full font-code-mono text-[11px] font-bold uppercase tracking-wide ${PLAN_BADGE[panelCompany.plan]}`}
                  >
                    {panelCompany.plan} Account
                  </span>
                  <span className="font-code-mono text-[11px] text-outline">• ID: AGH-20349</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-outline-variant px-sm">
              {PANEL_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPanelTab(key)}
                  className={`flex-1 py-3 font-medium transition-colors text-sm ${
                    panelTab === key
                      ? "text-secondary font-bold border-b-2 border-secondary"
                      : "text-outline hover:text-on-surface"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            {panelTab === "resumen" && (
              <div className="space-y-lg">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-md">
                  {[
                    { label: "Usuarios",       value: "128 / 250" },
                    { label: "Agentes Activos", value: "12" },
                    { label: "Tokens Mes",      value: "4.2M" },
                    { label: "Última Factura",  value: "$1,450.00" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
                      <p className="font-code-mono text-[11px] text-outline mb-1">{label}</p>
                      <p className="font-code-mono font-bold text-lg">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Credit usage */}
                <div className="space-y-sm">
                  <div className="flex justify-between items-end">
                    <p className="font-semibold text-on-surface">Créditos de API</p>
                    <p className="font-code-mono text-[11px] text-outline">4,120 / 5,000</p>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[82%] relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                  <p className="font-code-mono text-[11px] text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Próximo ciclo de facturación: 12 de Octubre
                  </p>
                </div>

                {/* Recent activity */}
                <div className="space-y-md">
                  <h4 className="text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                    Actividad Reciente
                  </h4>
                  <div className="space-y-sm">
                    {[
                      { icon: "person_add", bg: "bg-secondary-fixed",  color: "text-secondary",             text: "Nuevo usuario invitado",          sub: "marcos.d@nexus-ai.com • Hace 5m" },
                      { icon: "smart_toy",  bg: "bg-tertiary-fixed",   color: "text-on-tertiary-fixed-variant", text: 'Agente "Soporte N1" configurado', sub: "Acción por Admin • Hace 2h" },
                    ].map(({ icon, bg, color, text, sub }) => (
                      <div
                        key={text}
                        className="flex items-start gap-md p-sm hover:bg-surface-container-low rounded-lg transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                          <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
                        </div>
                        <div>
                          <p className="text-on-surface font-medium text-sm">{text}</p>
                          <p className="text-outline font-code-mono text-[11px]">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-lg border-t border-outline-variant space-y-sm">
                  <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    Ver perfil completo
                  </button>
                  <button className="w-full py-3 border border-error text-error font-bold rounded-xl hover:bg-error/5 transition-all active:scale-95">
                    Suspender cuenta
                  </button>
                </div>
              </div>
            )}

            {panelTab !== "resumen" && (
              <div className="flex flex-col items-center justify-center py-2xl text-outline">
                <span className="material-symbols-outlined text-[48px] mb-md opacity-30">inbox</span>
                <p className="font-code-mono text-sm">Disponible próximamente</p>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
