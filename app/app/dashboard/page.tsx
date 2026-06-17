"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";

const ACTIVE_MISSIONS = [
  { name: "Análisis competencia retail Q2", agents: "3 agentes AI", elapsed: "14 min",  status: "Ejecutando",     statusClass: "bg-green-100 text-green-800",  dotClass: "bg-green-500",  pulse: false, icon: null as string | null },
  { name: "Forecast demanda cadena fría",   agents: "2 agentes AI", elapsed: "-",       status: "En espera",      statusClass: "bg-blue-100 text-blue-800",    dotClass: "bg-secondary",  pulse: false, icon: null as string | null },
  { name: "Reporte proveedores mayo",       agents: "4 agentes AI", elapsed: "45 min",  status: "Revisión humana",statusClass: "bg-amber-100 text-amber-800",  dotClass: "bg-amber-500",  pulse: true,  icon: "warning" as string | null },
];

const ACTIVITY = [
  { bg: "bg-green-50",   color: "text-green-600",   icon: "check_circle",        bold: "Misión completada:",   text: "Análisis de Precios Amazon",         time: "Hace 12 min" },
  { bg: "bg-blue-50",    color: "text-blue-600",    icon: "description",          bold: "Documento procesado:", text: "Factura_INV_9021.pdf",               time: "Hace 28 min" },
  { bg: "bg-amber-50",   color: "text-amber-600",   icon: "pending_actions",      bold: "Aprobación requerida:",text: "Reporte Proveedores Mayo",            time: "Hace 45 min" },
  { bg: "bg-purple-50",  color: "text-purple-600",  icon: "assessment",           bold: "Reporte generado:",    text: "Insights Q1 Logística",              time: "Hace 2 horas" },
  { bg: "bg-indigo-50",  color: "text-indigo-600",  icon: "smart_toy",            bold: "Agente nuevo:",        text: "'LogisBot-4' activado correctamente", time: "Hace 4 horas" },
  { bg: "bg-emerald-50", color: "text-emerald-600", icon: "account_balance_wallet",bold: "Créditos recargados:", text: "+5,000 unidades",                   time: "Ayer, 18:45" },
];

const QUICK_ACTIONS = [
  { icon: "rocket_launch", label: "Nueva Misión",     href: "/app/misiones/nueva" },
  { icon: "upload_file",   label: "Subir Documento",  href: "/app/documentos" },
  { icon: "assessment",    label: "Nuevo Reporte",    href: "/app/reportes" },
  { icon: "smart_toy",     label: "Explorar Agentes", href: "/app/agentes" },
];

const CREDIT_BARS = [30, 45, 25, 60, 40, 75, 90];
const CREDIT_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Hoy"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Usuario";

  return (
    <>
      <style>{`
        .pulse-amber { animation: pulse-amber 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse-amber { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <main className="min-h-screen pb-xl flex-1">
        {/* Top bar */}
        <header className="h-16 sticky top-0 w-full flex justify-between items-center px-lg z-40 border-b border-outline-variant bg-white/80 backdrop-blur-md">
          <div>
            <h2 className="font-semibold text-xl text-on-surface">{getGreeting()}, {firstName}</h2>
            <p className="text-body-md text-on-surface-variant capitalize">{getFormattedDate()}</p>
          </div>
          <div className="flex items-center gap-md">
            <div className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="font-code-mono text-xs">0 misiones activas</span>
            </div>
            <Link
              href="/app/misiones/nueva"
              className="bg-secondary text-white px-lg py-sm rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Nueva Misión
            </Link>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        <div className="px-lg pt-lg space-y-gutter">
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-sm">
              <p className="font-code-mono text-xs text-on-surface-variant uppercase">Misiones este mes</p>
              <div className="flex items-baseline gap-2">
                <span className="font-code-mono text-5xl font-bold text-on-surface">0</span>
                <span className="bg-surface-container text-on-surface-variant font-code-mono text-xs px-xs py-[2px] rounded">Nuevo</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-sm">
              <p className="font-code-mono text-xs text-on-surface-variant uppercase">Créditos disponibles</p>
              <span className="font-code-mono text-5xl font-bold text-on-surface">1,000</span>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <p className="font-code-mono text-xs text-on-surface-variant">de 1,000 del plan gratuito</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-sm">
              <p className="font-code-mono text-xs text-on-surface-variant uppercase">Documentos procesados</p>
              <span className="font-code-mono text-5xl font-bold text-on-surface">0</span>
              <p className="font-code-mono text-xs text-on-surface-variant">Sube tu primer documento</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-sm">
              <p className="font-code-mono text-xs text-on-surface-variant uppercase">Tasa de éxito</p>
              <span className="font-code-mono text-5xl font-bold text-on-surface-variant">—</span>
              <p className="font-code-mono text-xs text-on-surface-variant">Sin misiones aún</p>
            </div>
          </div>

          {/* Active missions table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-semibold text-xl text-on-surface">Misiones Activas</h3>
              <Link href="/app/misiones" className="text-secondary font-bold text-body-md hover:underline">Ver todas</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {["Misión","Agentes","Tiempo","Estado"].map((h, i) => (
                      <th key={h} className={`px-lg py-sm font-code-mono text-xs text-on-surface-variant uppercase ${i === 3 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {ACTIVE_MISSIONS.map(({ name, agents, elapsed, status, statusClass, dotClass, pulse, icon }) => (
                    <tr key={name} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass} ${pulse ? "pulse-amber" : ""}`} />
                          <span className="font-medium text-on-surface">{name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-body-md text-on-surface-variant">{agents}</td>
                      <td className="px-lg py-md font-code-mono text-sm text-on-surface">{elapsed}</td>
                      <td className="px-lg py-md text-right">
                        <span className={`${statusClass} font-code-mono text-xs px-sm py-1 rounded-full font-bold inline-flex items-center gap-1`}>
                          {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom two-col */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-gutter pb-xl">
            {/* Activity */}
            <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col">
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-semibold text-xl text-on-surface">Actividad Reciente</h3>
              </div>
              <div className="p-lg space-y-md">
                {ACTIVITY.map(({ bg, color, icon, bold, text, time }) => (
                  <div key={text} className="flex items-start gap-md">
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center ${color} flex-shrink-0`}>
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md text-on-surface"><span className="font-bold">{bold}</span> {text}</p>
                      <p className="font-code-mono text-xs text-on-surface-variant">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col */}
            <div className="lg:col-span-2 space-y-gutter">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
                <h3 className="font-semibold text-xl text-on-surface mb-lg">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 gap-md">
                  {QUICK_ACTIONS.map(({ icon, label, href }) => (
                    <Link key={label} href={href} className="flex flex-col items-center justify-center p-md bg-surface-container-low border border-outline-variant rounded-xl hover:bg-secondary-fixed transition-colors group">
                      <span className="material-symbols-outlined text-[32px] text-secondary mb-2 group-hover:scale-110 transition-transform">{icon}</span>
                      <span className="font-code-mono text-xs text-on-surface-variant text-center">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-primary-container text-white rounded-xl border border-white/10 p-lg shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary opacity-20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-lg">
                    <div>
                      <h4 className="font-semibold text-white">Consumo de Créditos</h4>
                      <p className="font-code-mono text-xs text-on-primary-fixed-variant">Próxima renovación en 18 días</p>
                    </div>
                    <span className="material-symbols-outlined text-on-primary-fixed-variant">trending_up</span>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-2 mb-md">
                    {CREDIT_BARS.map((pct, i) => (
                      <div key={i} className={`flex-1 rounded-t-sm ${i === CREDIT_BARS.length - 1 ? "bg-secondary" : "bg-white/20"}`} style={{ height: `${pct}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between font-code-mono text-[10px] text-on-primary-fixed-variant uppercase tracking-wider">
                    {CREDIT_DAYS.map((d, i) => (
                      <span key={d} className={i === CREDIT_DAYS.length - 1 ? "text-white" : ""}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
