"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ADMIN_NAV = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/usuarios", icon: "group", label: "Usuarios" },
  { href: "/admin/modelos-costos", icon: "payments", label: "Modelos & Costos" },
  { href: "/admin/infraestructura", icon: "dns", label: "Infraestructura" },
  { href: "/admin/alertas", icon: "notifications_active", label: "Alertas" },
  { href: "/admin/crm", icon: "hub", label: "CRM" },
  { href: "/admin/logs", icon: "terminal", label: "Logs del Sistema" },
];

type AlertFilter = "todas" | "criticas" | "advertencias";

const ACTIVE_ALERTS = [
  {
    id: "a1",
    severity: "critical" as const,
    icon: "dangerous",
    title: "Latencia elevada — Document Processor",
    badge: "Critical",
    badgeClass: "bg-error-container text-on-error-container",
    borderClass: "border-error",
    iconClass: "text-error",
    desc: "Percentil p95 > 850ms en las últimas 5 peticiones.",
    actions: ["Reconocer", "Ver logs"],
    filter: "criticas",
  },
  {
    id: "a2",
    severity: "warning" as const,
    icon: "warning",
    title: "RAM Cluster > 70%",
    badge: "Warning",
    badgeClass: "bg-amber-100 text-amber-800",
    borderClass: "border-amber-500",
    iconClass: "text-amber-500",
    desc: "Nodo kube-prod-02 está alcanzando límites de memoria.",
    actions: ["Reconocer", "Ignorar 1h"],
    filter: "advertencias",
  },
  {
    id: "a3",
    severity: "warning" as const,
    icon: "hourglass_empty",
    title: "Cola de agentes — tiempo de espera alto",
    badge: "Warning",
    badgeClass: "bg-amber-100 text-amber-800",
    borderClass: "border-amber-500",
    iconClass: "text-amber-500",
    descBold: "Agent Orchestrator:",
    desc: " 47 tareas pendientes en cola global.",
    actions: ["Gestionar"],
    filter: "advertencias",
  },
  {
    id: "a4",
    severity: "info" as const,
    icon: "info",
    title: "Nuevo pico de tráfico registrado",
    badge: "Info",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    borderClass: "border-secondary",
    iconClass: "text-secondary",
    descHighlight: "+34%",
    desc: " respecto a la media de la hora.",
    descPrefix: "Incremento del ",
    actions: ["Detalles"],
    filter: "todas",
  },
];

const HISTORY = [
  { name: "API Gateway timeout", status: "Resuelto", statusClass: "text-emerald-600", statusIcon: "check_circle", duration: "~23 min", date: "Hoy, 09:42" },
  { name: "SSL Certificate renewed", status: "Resuelto", statusClass: "text-emerald-600", statusIcon: "check_circle", duration: "--", date: "Hoy, 04:10" },
  { name: "Spike CPU Cluster Auth", status: "Resuelto", statusClass: "text-emerald-600", statusIcon: "check_circle", duration: "~12 min", date: "Ayer, 21:30" },
  { name: "Deploy fallido #451", status: "Rollback", statusClass: "text-error", statusIcon: "cancel", duration: "~4 min", date: "Ayer, 18:12" },
  { name: "Storage 80% usage", status: "Resuelto", statusClass: "text-emerald-600", statusIcon: "check_circle", duration: "~150 min", date: "Ayer, 11:05" },
];

const RULES_INIT = [
  { label: "Latencia API Global", delay: "Delay: 30s", on: true },
  { label: "Error Rate > 5%", delay: "Delay: 10s", on: true },
  { label: "RAM Nodo Crítico", delay: "Delay: 60s", on: true },
  { label: "CPU Spike Detect", delay: "Delay: 15s", on: false },
  { label: "Créditos empresa min.", delay: "Delay: 300s", on: true },
];

const CHANNELS = [
  { icon: "mail", name: "Email", detail: "alertas@agenthub.co", active: true },
  { icon: "chat", name: "Slack", detail: "#alertas-prod", active: true },
  { icon: "notification_important", name: "PagerDuty", detail: "Integración pendiente", active: false },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-secondary" : "bg-surface-variant"}`}
    >
      <span
        className="absolute top-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-200"
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export default function AlertasPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("todas");
  const [rules, setRules] = useState(RULES_INIT.map((r) => r.on));

  const filteredAlerts = ACTIVE_ALERTS.filter((a) => {
    if (activeFilter === "todas") return true;
    if (activeFilter === "criticas") return a.severity === "critical";
    if (activeFilter === "advertencias") return a.severity === "warning";
    return true;
  });

  return (
    <>
      <style>{`
        .alert-row { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .alert-row:hover { transform: translateX(4px); }
      `}</style>

      <div className="bg-background text-on-surface flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[260px] bg-inverse-surface flex flex-col h-screen fixed left-0 top-0 z-50 overflow-y-auto">
          <div className="p-lg flex items-center gap-md">
            <div className="w-10 h-10 bg-on-tertiary-container flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">AgentHub</h1>
              <p className="font-code-mono text-[10px] text-on-tertiary-container uppercase tracking-wider">Admin</p>
            </div>
          </div>

          <nav className="flex-1 px-md py-sm space-y-xs">
            {ADMIN_NAV.map(({ href, icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-secondary text-white font-bold"
                      : "text-on-primary-container opacity-80 hover:bg-secondary-container/50"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  <span className="text-body-md text-white">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-md border-t border-outline-variant/10">
            <div className="flex items-center gap-md p-sm bg-white/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">Super Admin</p>
                <p className="font-code-mono text-[10px] text-on-primary-container truncate">admin@agenthub.co</p>
              </div>
              <span className="material-symbols-outlined text-on-primary-container hover:text-white cursor-pointer">
                settings
              </span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-margin-desktop py-sm flex justify-between items-center h-20">
            <div>
              <h2 className="font-bold text-xl text-on-surface">Alertas</h2>
              <p className="text-body-md text-on-surface-variant">Centro de incidentes y reglas de monitoreo</p>
            </div>
            <div className="flex gap-md">
              <button className="px-md py-sm border border-secondary text-secondary rounded-lg font-medium hover:bg-secondary/5 transition-all active:scale-95">
                Nueva regla
              </button>
              <button className="px-md py-sm bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm">
                Crear alerta manual
              </button>
            </div>
          </header>

          <div className="p-margin-desktop space-y-lg">
            {/* Summary strip */}
            <div className="grid grid-cols-4 gap-0 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant shadow-sm">
              {[
                { label: "Críticas", value: "1", cls: "text-error" },
                { label: "Advertencias", value: "3", cls: "text-amber-600" },
                { label: "Informativas", value: "8", cls: "text-secondary" },
                { label: "Resueltas hoy", value: "14", cls: "text-emerald-600" },
              ].map(({ label, value, cls }, i, arr) => (
                <div key={label} className={`p-lg flex flex-col gap-xs ${i < arr.length - 1 ? "border-r border-outline-variant" : ""}`}>
                  <span className="font-code-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
                  <span className={`font-code-mono text-5xl font-bold leading-none ${cls}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-12 gap-lg items-start">
              {/* Left 8/12 */}
              <div className="col-span-12 lg:col-span-8 space-y-lg">
                {/* Active alerts */}
                <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                  <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-bold text-xl text-on-surface">Alertas Activas</h3>
                    <div className="flex gap-sm">
                      {(["todas", "criticas", "advertencias"] as AlertFilter[]).map((f) => (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-md py-xs rounded-full text-xs font-medium capitalize transition-colors ${
                            activeFilter === f
                              ? "bg-secondary-container text-on-secondary-container"
                              : "border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-sm">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`alert-row flex items-center gap-md p-md bg-surface-container-low border-l-4 ${alert.borderClass} rounded-r-lg`}
                      >
                        <span className={`material-symbols-outlined ${alert.iconClass} text-[32px]`}>{alert.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-sm flex-wrap">
                            <span className="font-bold text-on-surface">{alert.title}</span>
                            <span className={`font-code-mono text-[10px] ${alert.badgeClass} px-sm py-[2px] rounded uppercase`}>
                              {alert.badge}
                            </span>
                          </div>
                          <p className="text-body-md text-on-surface-variant">
                            {alert.id === "a3" && (
                              <strong className="font-code-mono">{alert.descBold}</strong>
                            )}
                            {alert.id === "a4" ? (
                              <>
                                {alert.descPrefix}
                                <span className="text-secondary font-bold font-code-mono">{alert.descHighlight}</span>
                                {alert.desc}
                              </>
                            ) : (
                              alert.desc
                            )}
                          </p>
                        </div>
                        <div className="flex gap-sm flex-shrink-0">
                          {alert.actions.map((action, i) => (
                            <button
                              key={action}
                              className={`px-md py-sm rounded text-xs font-medium transition-all active:scale-95 ${
                                i === 0 && alert.severity === "critical"
                                  ? "bg-primary-container text-white"
                                  : i === 0 && alert.severity === "warning"
                                  ? "bg-primary-container text-white"
                                  : "border border-outline text-on-surface-variant hover:bg-surface-variant"
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Incident history */}
                <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                  <h3 className="font-bold text-xl text-on-surface mb-lg">Historial Reciente</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="py-md px-sm font-code-mono text-xs text-on-surface-variant uppercase">Incidente</th>
                        <th className="py-md px-sm font-code-mono text-xs text-on-surface-variant uppercase">Estado</th>
                        <th className="py-md px-sm font-code-mono text-xs text-on-surface-variant uppercase">Duración</th>
                        <th className="py-md px-sm font-code-mono text-xs text-on-surface-variant uppercase text-right">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {HISTORY.map(({ name, status, statusClass, statusIcon, duration, date }) => (
                        <tr key={name} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-md px-sm text-body-md font-medium">{name}</td>
                          <td className="py-md px-sm">
                            <span className={`flex items-center gap-xs text-sm ${statusClass}`}>
                              <span className="material-symbols-outlined text-sm">{statusIcon}</span>
                              {status}
                            </span>
                          </td>
                          <td className="py-md px-sm">
                            <span className="font-code-mono text-xs bg-surface-container-high/50 px-sm py-[2px] rounded">
                              {duration}
                            </span>
                          </td>
                          <td className="py-md px-sm text-right font-code-mono text-on-surface-variant text-xs">{date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>

              {/* Right 4/12 */}
              <div className="col-span-12 lg:col-span-4 space-y-lg">
                {/* Alert rules */}
                <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                  <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-bold text-lg text-on-surface">Reglas activas</h3>
                    <span className="bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded font-code-mono text-xs font-bold">
                      12 reglas
                    </span>
                  </div>
                  <div className="space-y-sm">
                    {RULES_INIT.map(({ label, delay }, idx) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-body-md text-on-surface font-medium">{label}</span>
                          <span className="font-code-mono text-[10px] text-on-surface-variant">{delay}</span>
                        </div>
                        <Toggle on={rules[idx]} onChange={() => setRules((r) => r.map((v, i) => (i === idx ? !v : v)))} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Notification channels */}
                <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                  <h3 className="font-bold text-lg text-on-surface mb-lg">Canales de Notificación</h3>
                  <div className="space-y-md">
                    {CHANNELS.map(({ icon, name, detail, active }) => (
                      <div key={name} className={`flex items-center gap-md ${!active ? "opacity-60" : ""}`}>
                        <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-body-md text-on-surface font-medium">{name}</p>
                          <p className={`font-code-mono text-[11px] text-on-surface-variant ${!active ? "italic" : ""}`}>
                            {detail}
                          </p>
                        </div>
                        {active ? (
                          <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                        ) : (
                          <button className="text-[10px] bg-primary-container text-white px-sm py-[2px] rounded font-bold uppercase tracking-tighter">
                            Conectar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* MTTR stats */}
                <section className="bg-primary-container text-white rounded-xl p-lg shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-lg">
                    <h3 className="font-bold text-lg flex items-center gap-sm">
                      <span className="material-symbols-outlined">analytics</span>
                      Rendimiento Operativo
                    </h3>
                    <div className="grid grid-cols-2 gap-lg">
                      <div>
                        <p className="text-on-primary-container font-code-mono text-[10px] uppercase tracking-wider mb-xs">MTTA</p>
                        <div className="flex items-end gap-xs">
                          <span className="font-code-mono text-3xl font-bold">4.2</span>
                          <span className="text-xs mb-1">min</span>
                          <span className="material-symbols-outlined text-emerald-400 mb-1">arrow_downward</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-on-primary-container font-code-mono text-[10px] uppercase tracking-wider mb-xs">MTTR</p>
                        <div className="flex items-end gap-xs">
                          <span className="font-code-mono text-3xl font-bold">23</span>
                          <span className="text-xs mb-1">min</span>
                          <span className="material-symbols-outlined text-emerald-400 mb-1">arrow_downward</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-md border-t border-white/10">
                      <p className="text-on-primary-container font-code-mono text-[10px] uppercase tracking-wider mb-xs">SLA Disponibilidad</p>
                      <div className="flex justify-between items-center">
                        <span className="font-code-mono text-3xl font-bold text-emerald-400">98.3%</span>
                        <div className="h-2 w-24 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: "98.3%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-container blur-3xl opacity-30 rounded-full" />
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto px-margin-desktop py-lg border-t border-outline-variant flex justify-between items-center bg-surface-container-low/30">
            <p className="font-code-mono text-xs text-on-surface-variant">AGENTHUB PLATFORM V4.2.0-STABLE</p>
            <div className="flex items-center gap-md">
              <span className="flex items-center gap-xs text-emerald-600 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistemas Operativos
              </span>
              <span className="text-outline-variant">|</span>
              <p className="text-xs text-on-surface-variant">Región: latam-south-1</p>
            </div>
          </footer>
        </main>

        {/* FAB */}
        <div className="fixed bottom-margin-desktop right-margin-desktop z-50 group">
          <button className="w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[28px]">bolt</span>
          </button>
          <div className="absolute right-16 bottom-0 bg-inverse-surface text-white px-md py-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium shadow-lg">
            Diagnóstico Rápido
          </div>
        </div>
      </div>
    </>
  );
}
