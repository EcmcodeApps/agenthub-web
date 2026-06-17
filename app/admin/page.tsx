"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { icon: "dashboard", label: "Centro de Control", href: "/admin" },
  { icon: "group", label: "CRM", href: "/admin/crm" },
  { icon: "dns", label: "Infraestructura", href: "/admin/infraestructura" },
  { icon: "psychology", label: "Modelos IA", href: "/admin/modelos-costos" },
  { icon: "monetization_on", label: "Costos", href: "/admin/modelos-costos" },
  { icon: "notification_important", label: "Alertas", href: "/admin/alertas" },
];

const METRICS = [
  { label: "Empresas", value: "124", sub: "+4 este mes", subColor: "text-secondary" },
  { label: "Misiones", value: "2.4k", sub: "89% éxito", subColor: "text-secondary" },
  { label: "Costo IA", valueJsx: true, sub: "Últimas 24h", subColor: "text-on-surface-variant" },
  { label: "Margen", valueKey: "margin", sub: "Optimizado por IA", subColor: "text-on-tertiary-container", accent: true },
];

const CHART_BARS = [
  { color: "#3F465C", h: 40 },
  { color: "#0058BE", h: 85 },
  { color: "#7073FF", h: 60 },
  { color: "#3F465C", h: 55 },
  { color: "#0058BE", h: 95 },
];

const AI_MODELS = [
  { icon: "bolt", name: "DeepSeek V3", price: "0.12$ / 1M Tokens", online: true },
  { icon: "auto_awesome", name: "Mistral Large", price: "2.00$ / 1M Tokens", online: true },
  { icon: "hub", name: "Grok-1", price: "0.80$ / 1M Tokens", online: false },
];

const AT_RISK = [
  {
    initial: "T",
    name: "TechNova Latam",
    id: "TN-9021",
    spend: "$1,240 USD",
    errors: "24 errores",
    health: "12%",
  },
  {
    initial: "B",
    name: "Banco del Norte",
    id: "BN-4432",
    spend: "$8,900 USD",
    errors: "42 errores",
    health: "28%",
  },
  {
    initial: "S",
    name: "SmartLogistics SA",
    id: "SL-1120",
    spend: "$450 USD",
    errors: "15 errores",
    health: "35%",
  },
];

export default function AdminPage() {
  const pathname = usePathname();
  const [margin, setMargin] = useState(91.0);
  const [clickedRow, setClickedRow] = useState<number | null>(null);

  // Margin fluctuation every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setMargin((v) => parseFloat((v + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const handleRowClick = (idx: number) => {
    setClickedRow(idx);
    setTimeout(() => setClickedRow(null), 150);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-on-background font-body-md">

      {/* ── Admin Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-inverse-surface text-inverse-on-surface flex flex-col p-lg shadow-md z-50">
        <div className="mb-xl">
          <h1 className="font-headline-md text-headline-md text-secondary-fixed-dim tracking-tight">
            AgentHub
          </h1>
          <p className="font-label-sm text-label-sm text-outline-variant opacity-80 mt-xs uppercase tracking-widest">
            Admin Central
          </p>
        </div>
        <nav className="flex-1 space-y-sm">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-md p-md rounded-md transition-all ${
                  active
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant pt-lg">
          <Link
            href="#"
            className="flex items-center gap-md p-md text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant rounded-md transition-all"
          >
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label-sm text-label-sm">Logs del Sistema</span>
          </Link>
          <div className="mt-md flex items-center gap-md px-md">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0j3zq-thOQKhW7HRtc4FA7vLodE75IvY18o9yiFi4UCCZvJD_6nVmRPGE4SsK8yZzneKTGC8ts2O1dNIjsaNwBg8RXqKO-tiGsOog9DoUvAf5RtHnBHMtuODHQ_-mbOOof3oOKwGVQ_SqYKewNCqkaFkyXSisMrRsWNRaHLzcj_imIu-PNRFnlmi4LjsqWJX51RBDk9-_LdffGjk5HERgeY0Vx89G4akXJPu635DPqnAnfnuYytAPrfttfHg8vuXEFd99iN3vKqU"
                alt="Avatar Admin"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-label-sm text-label-sm text-inverse-on-surface truncate">
                Control Maestro
              </p>
              <p className="text-[10px] text-outline-variant opacity-60 truncate">
                admin@agenthub.ia
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="ml-[260px] flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-margin-desktop py-md flex items-center justify-between border-b border-outline-variant/30">
          <div>
            <h2 className="font-title-md text-title-md text-on-background">Monitor Global</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Estado en tiempo real de la infraestructura
            </p>
          </div>
          <div className="flex gap-lg items-center">
            <div className="flex flex-col items-end">
              <span className="font-label-sm text-label-sm text-outline">Balance de Créditos</span>
              <div className="w-32 h-1.5 bg-surface-container rounded-full mt-xs overflow-hidden">
                <div className="bg-secondary h-full w-[75%]" />
              </div>
            </div>
            <button
              type="button"
              className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-md hover:opacity-90 transition-all flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Optimizar con Agente
            </button>
          </div>
        </header>

        <div className="p-margin-desktop space-y-lg">

          {/* ── Metrics Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Empresas</p>
              <p className="font-display-xl text-display-xl text-primary mt-xs">124</p>
              <span className="text-secondary font-label-sm">+4 este mes</span>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Misiones</p>
              <p className="font-display-xl text-display-xl text-primary mt-xs">2.4k</p>
              <span className="text-secondary font-label-sm">89% éxito</span>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Costo IA</p>
              <p className="font-display-xl text-display-xl text-primary mt-xs">
                $87 <span className="text-title-md">USD</span>
              </p>
              <span className="text-on-surface-variant font-label-sm">Últimas 24h</span>
            </div>
            {/* Accent card */}
            <div
              className="bg-surface-container-lowest p-lg rounded-xl shadow-sm"
              style={{
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(90deg, #4F46E5, #06B6D4)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Margen</p>
              <p className="font-display-xl text-display-xl text-primary mt-xs">{margin}%</p>
              <span className="text-on-tertiary-container font-label-sm">Optimizado por IA</span>
            </div>
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-12 gap-gutter h-fit">

            {/* Usage Chart */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="font-title-md text-title-md text-on-surface">Uso por Proveedor</h3>
                <div className="flex gap-md">
                  {[
                    { color: "#3F465C", label: "DeepSeek" },
                    { color: "#0058BE", label: "Mistral" },
                    { color: "#7073FF", label: "Grok" },
                  ].map((l) => (
                    <span key={l.label} className="flex items-center gap-xs font-label-sm text-label-sm">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-end gap-gutter px-md">
                {CHART_BARS.map((bar, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-surface-container rounded-t-lg relative group"
                    style={{ height: `${bar.h}%` }}
                  >
                    <div
                      className="absolute inset-0 opacity-80 rounded-t-lg transition-opacity group-hover:opacity-100"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-md border-t border-outline-variant/20 pt-md">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Ingresos en el tiempo (Proyectado)
                </p>
                <Link
                  href="/app/reportes"
                  className="text-secondary font-label-sm flex items-center gap-xs hover:underline"
                >
                  Ver reporte completo
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* AI Models Widget */}
            <div className="col-span-12 lg:col-span-4 bg-inverse-surface rounded-xl shadow-md p-lg flex flex-col text-inverse-on-surface">
              <h3 className="font-title-md text-title-md mb-lg">Modelos IA Activos</h3>
              <div className="space-y-md flex-1">
                {AI_MODELS.map((model) => (
                  <div
                    key={model.name}
                    className="flex justify-between items-center p-md bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-secondary-fixed-dim">
                        {model.icon}
                      </span>
                      <div>
                        <p className="font-body-md text-body-md">{model.name}</p>
                        <p className="text-[10px] text-outline-variant uppercase">{model.price}</p>
                      </div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        model.online
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-lg py-md border border-white/20 rounded-lg font-label-sm text-label-sm hover:bg-white/10 transition-all uppercase tracking-widest"
              >
                Gestionar Despliegue
              </button>
            </div>

            {/* At-Risk Clients Table */}
            <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
              <div className="p-lg border-b border-outline-variant/20 flex justify-between items-center">
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface">
                    Clientes en Riesgo
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Salud de cuenta por debajo del 40%
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-surface-container px-md py-sm rounded-lg text-on-surface-variant font-label-sm hover:bg-surface-variant transition-all"
                >
                  Ver todos los clientes
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-surface-container/50">
                  <tr>
                    {["Empresa", "Consumo Mensual", "Misiones Fallidas", "Health Score", ""].map(
                      (h, i) => (
                        <th
                          key={i}
                          className={`px-lg py-md font-label-sm text-label-sm text-outline ${
                            h === "Health Score" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {AT_RISK.map((client, idx) => (
                    <tr
                      key={client.id}
                      onClick={() => handleRowClick(idx)}
                      className={`transition-all cursor-pointer hover:bg-secondary/[0.04] ${
                        clickedRow === idx ? "scale-[0.99] brightness-110" : ""
                      }`}
                    >
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center font-bold text-primary flex-shrink-0">
                            {client.initial}
                          </div>
                          <div>
                            <p className="font-title-md text-title-md text-primary">{client.name}</p>
                            <p className="text-[12px] text-on-surface-variant">ID: {client.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-md text-body-md">{client.spend}</td>
                      <td className="px-lg py-md">
                        <span className="bg-error-container text-on-error-container px-sm py-xs rounded-full font-label-sm text-label-sm">
                          {client.errors}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <span className="text-error font-bold font-title-md">{client.health}</span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <button
                          type="button"
                          className="material-symbols-outlined text-outline hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          more_vert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-outline-variant bg-background py-xl">
          <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center">
            <div className="mb-md md:mb-0">
              <p className="font-title-md text-title-md font-bold text-primary">AgentHub</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
              </p>
            </div>
            <div className="flex gap-xl">
              {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-label-sm text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
