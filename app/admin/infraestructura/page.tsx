"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ADMIN_NAV = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/usuarios", icon: "group", label: "Usuarios" },
  { href: "/admin/modelos-costos", icon: "smart_toy", label: "Modelos & Costos" },
  { href: "/admin/infraestructura", icon: "hub", label: "Infraestructura" },
  { href: "/admin/alertas", icon: "notifications_active", label: "Alertas", badge: 2 },
  { href: "/admin/crm", icon: "database", label: "CRM" },
  { href: "/admin/logs", icon: "terminal", label: "Logs" },
];

const SERVICES = [
  { name: "API Gateway", status: "ok", latency: "42ms", uptime: "100%", update: "2m ago" },
  { name: "Agent Orchestrator", status: "ok", latency: "128ms", uptime: "99.8%", update: "1m ago" },
  { name: "Document Processor", status: "warn", latency: "840ms", uptime: "98.2%", update: "Just now" },
  { name: "Modelo LLM Router", status: "ok", latency: "310ms", uptime: "99.9%", update: "5m ago" },
  { name: "Auth Service", status: "ok", latency: "15ms", uptime: "100%", update: "30s ago" },
  { name: "Storage Service", status: "ok", latency: "85ms", uptime: "99.9%", update: "8m ago" },
];

const RESOURCES = [
  { label: "Uso de CPU", icon: "memory", pct: 68, fill: "bg-secondary", sub: "Allocated: 12.2 / 18 Cores", tag: "Shared Pool" },
  { label: "Uso de RAM", icon: "memory_alt", pct: 71, fill: "bg-on-tertiary-container", sub: "Used: 45.4 / 64 GB", tag: "High Pressure" },
  { label: "Almacenamiento", icon: "database", pct: 43, fill: "bg-emerald-500", sub: "Available: 1.2 / 2.8 TB", tag: "Optimized" },
];

const PODS = [
  { id: "api-7f", warn: false }, { id: "api-k8", warn: false },
  { id: "proc-x2", warn: true }, { id: "auth-p1", warn: false },
  { id: "rout-q3", warn: false }, { id: "rout-a9", warn: false },
  { id: "stor-f5", warn: false }, { id: "stor-m2", warn: false },
  { id: "orch-j1", warn: false }, { id: "proc-z7", warn: true },
  { id: "crm-v2", warn: false }, { id: "logs-r9", warn: false },
];

export default function InfraestructuraPage() {
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <>
      <style>{`
        .pulse-dot { animation: pulse-anim 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse-anim { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="bg-background font-body-md text-on-surface antialiased flex min-h-screen">
        {/* Admin Sidebar */}
        <aside className="w-[260px] h-screen fixed left-0 top-0 bg-inverse-surface flex flex-col z-50">
          <div className="p-lg flex items-center space-x-md">
            <div className="w-10 h-10 bg-on-tertiary-container rounded-lg flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
            </div>
            <div>
              <h1 className="text-white font-bold font-headline-md text-title-md leading-none">AgentHub</h1>
              <p className="text-on-primary-container font-code-mono text-[10px] tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 px-sm space-y-xs mt-md">
            {ADMIN_NAV.map(({ href, icon, label, badge }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-md py-sm px-md rounded-lg transition-all ${
                    isActive
                      ? "bg-secondary text-white shadow-md"
                      : "text-on-primary-container hover:bg-on-primary-fixed-variant group"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  <span className={`font-body-md ${isActive ? "font-bold" : "group-hover:text-white"}`}>{label}</span>
                  {badge && (
                    <span className="ml-auto bg-error text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-on-primary-fixed-variant p-lg">
            <div className="flex items-center space-x-md">
              <div className="w-10 h-10 rounded-full bg-on-secondary-fixed flex items-center justify-center text-secondary-fixed font-bold">
                SA
              </div>
              <div className="flex flex-col">
                <span className="text-white text-body-md font-medium">Super Admin</span>
                <span className="text-on-primary-container text-[11px] font-code-mono uppercase">System Level</span>
              </div>
              <button className="ml-auto text-on-primary-container hover:text-white transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-[260px] flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-16 sticky top-0 bg-white/80 backdrop-blur-md border-b border-outline-variant px-gutter flex items-center justify-between z-40">
            <div className="flex flex-col">
              <h2 className="text-title-md font-bold font-headline-md text-on-surface">Infraestructura</h2>
              <p className="text-on-surface-variant text-[12px]">Estado en tiempo real de los servicios</p>
            </div>
            <div className="flex items-center space-x-md">
              <div className="flex items-center space-x-sm bg-green-50 px-md py-1.5 rounded-full border border-green-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                <span className="text-[12px] font-medium text-emerald-700">Todos los sistemas operativos</span>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <span className={`material-symbols-outlined ${refreshing ? "animate-spin" : ""}`}>refresh</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="p-gutter space-y-lg">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
              <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col shadow-sm">
                <span className="text-on-surface-variant text-label-sm uppercase font-code-mono mb-sm">Uptime General</span>
                <div className="flex items-baseline space-x-sm">
                  <span className="text-headline-md font-bold text-on-surface">99.97%</span>
                  <span className="text-emerald-500 text-[12px] font-bold flex items-center">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+0.02%
                  </span>
                </div>
                <span className="text-on-surface-variant text-body-md mt-sm">Últimos 30 días</span>
              </div>

              <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col shadow-sm">
                <span className="text-on-surface-variant text-label-sm uppercase font-code-mono mb-sm">Latencia API</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-headline-md font-bold text-on-surface font-code-mono">142ms</span>
                  <span className="bg-blue-50 text-secondary text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Normal</span>
                </div>
                <span className="text-on-surface-variant text-body-md mt-sm">Promedio p95</span>
              </div>

              <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col shadow-sm">
                <span className="text-on-surface-variant text-label-sm uppercase font-code-mono mb-sm">Pods Activos</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-headline-md font-bold text-on-surface">24/24</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Healthy</span>
                </div>
                <span className="text-on-surface-variant text-body-md mt-sm">Kubernetes cluster</span>
              </div>

              <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col shadow-sm">
                <span className="text-on-surface-variant text-label-sm uppercase font-code-mono mb-sm">Alertas Activas</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-headline-md font-bold text-error">2</span>
                  <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Warning</span>
                </div>
                <span className="text-on-surface-variant text-body-md mt-sm">Requieren atención</span>
              </div>
            </div>

            {/* Two-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
              {/* Left 60% */}
              <div className="lg:col-span-3 space-y-lg">
                {/* Services table */}
                <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                  <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
                    <h3 className="font-bold text-title-md">Estado de Servicios</h3>
                    <Link href="/admin/logs" className="text-secondary font-medium text-[13px] hover:underline flex items-center">
                      Ver logs <span className="material-symbols-outlined text-[16px] ml-1">open_in_new</span>
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          <th className="px-lg py-md text-label-sm text-on-surface-variant uppercase">Servicio</th>
                          <th className="px-lg py-md text-label-sm text-on-surface-variant uppercase text-center">Estado</th>
                          <th className="px-lg py-md text-label-sm text-on-surface-variant uppercase text-right">Latencia</th>
                          <th className="px-lg py-md text-label-sm text-on-surface-variant uppercase text-right">Uptime</th>
                          <th className="px-lg py-md text-label-sm text-on-surface-variant uppercase text-right">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {SERVICES.map(({ name, status, latency, uptime, update }) => {
                          const warn = status === "warn";
                          return (
                            <tr
                              key={name}
                              className={`transition-colors ${warn ? "bg-amber-50/20 hover:bg-amber-50/50" : "hover:bg-surface-container-lowest"}`}
                            >
                              <td className="px-lg py-md font-medium">
                                <span className="flex items-center gap-2">
                                  {name}
                                  {warn && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                      Degradado
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="px-lg py-md text-center">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full inline-block ${warn ? "bg-amber-400" : "bg-emerald-500"}`}
                                />
                              </td>
                              <td className={`px-lg py-md text-right font-code-mono text-[13px] ${warn ? "text-amber-600" : ""}`}>
                                {latency}
                              </td>
                              <td className="px-lg py-md text-right font-code-mono text-[13px]">{uptime}</td>
                              <td className="px-lg py-md text-right text-on-surface-variant text-[12px]">{update}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg">
                  <h3 className="font-bold text-title-md mb-lg">Recursos del Cluster</h3>
                  <div className="space-y-xl">
                    {RESOURCES.map(({ label, icon, pct, fill, sub, tag }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-sm">
                          <span className="text-body-md font-medium flex items-center">
                            <span className="material-symbols-outlined mr-2 text-on-surface-variant">{icon}</span>
                            {label}
                          </span>
                          <span className="font-code-mono text-body-md font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                          <div className={`${fill} h-full rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between mt-xs text-[11px] text-on-surface-variant font-code-mono">
                          <span>{sub}</span>
                          <span>{tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 40% */}
              <div className="lg:col-span-2 space-y-lg">
                {/* Deployment pipeline */}
                <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg">
                  <h3 className="font-bold text-title-md mb-lg">Deployment Pipeline</h3>
                  <div className="relative pl-gutter space-y-xl before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                    {/* Build */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[10px]">check</span>
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface">Build</span>
                          <span className="text-[11px] font-code-mono bg-surface-container-low px-1.5 py-0.5 rounded">v2.4.1</span>
                        </div>
                        <p className="text-[13px] text-on-surface-variant">Compilación completada exitosamente</p>
                      </div>
                    </div>
                    {/* Test Suite */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[10px]">check</span>
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">Test Suite</span>
                        <p className="text-[13px] text-on-surface-variant">1,422 tests passed en 4m 12s</p>
                      </div>
                    </div>
                    {/* Staging */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm pulse-dot" />
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-secondary">Staging Deploy</span>
                          <span className="material-symbols-outlined text-secondary animate-spin text-[14px]">
                            progress_activity
                          </span>
                        </div>
                        <p className="text-[13px] text-on-surface-variant">Sincronizando pods en US-EAST-1...</p>
                      </div>
                    </div>
                    {/* Production */}
                    <div className="relative opacity-50">
                      <span className="absolute -left-[30px] top-1 w-4 h-4 bg-surface-container-highest rounded-full border-2 border-white shadow-sm" />
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">Production</span>
                        <p className="text-[13px] text-on-surface-variant">A la espera de aprobación manual</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pods grid */}
                <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg">
                  <div className="flex items-center justify-between mb-lg">
                    <h3 className="font-bold text-title-md">Pods Activos</h3>
                    <span className="text-[12px] font-code-mono text-on-surface-variant">Cluster: k8s-main-01</span>
                  </div>
                  <div className="grid grid-cols-4 gap-sm">
                    {PODS.map(({ id, warn }) => (
                      <div
                        key={id}
                        className={`h-10 rounded flex flex-col items-center justify-center ${
                          warn
                            ? "border border-amber-200 bg-amber-50 ring-2 ring-amber-100 ring-offset-1"
                            : "border border-emerald-100 bg-emerald-50"
                        }`}
                      >
                        <span className={`text-[8px] font-code-mono ${warn ? "text-amber-800" : "text-emerald-800"}`}>
                          {id}
                        </span>
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            warn ? "bg-amber-500 pulse-dot" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-lg flex items-center justify-center space-x-lg">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-on-surface-variant font-medium">22 Saludable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-[11px] text-on-surface-variant font-medium">2 Degrado</span>
                    </div>
                  </div>
                </div>

                {/* Maintenance notice */}
                <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
                  <div className="flex items-start space-x-md">
                    <span
                      className="material-symbols-outlined text-amber-600 bg-amber-50 p-2 rounded-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      warning
                    </span>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold">Mantenimiento Programado</span>
                      <p className="text-[12px] text-on-surface-variant mt-1">
                        Cluster <code className="font-code-mono">us-east</code> entrará en mantenimiento el 24/10 a las 03:00 GMT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
