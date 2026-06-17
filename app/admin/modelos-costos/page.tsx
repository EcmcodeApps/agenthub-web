"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { icon: "group", label: "CRM", href: "/admin/crm" },
  { icon: "dns", label: "Infraestructura", href: "/admin/infraestructura" },
  { icon: "psychology", label: "Modelos", href: "/admin/modelos-costos" },
  { icon: "monetization_on", label: "Costos", href: "/admin/modelos-costos", active: true },
  { icon: "notification_important", label: "Alertas", href: "/admin/alertas" },
];

const PROVIDERS = [
  {
    initials: "DS",
    bg: "bg-primary",
    name: "DeepSeek",
    model: "V3-Chat",
    status: "Activo",
    active: true,
    latency: "420ms",
    errorRate: "0.02%",
    errorPct: 2,
  },
  {
    initials: "MI",
    bg: "bg-tertiary-container",
    name: "Mistral",
    model: "Large-2407",
    status: "Activo",
    active: true,
    latency: "890ms",
    errorRate: "0.15%",
    errorPct: 15,
  },
  {
    initials: "GK",
    bg: "bg-primary",
    name: "Grok",
    model: "Grok-1.5-Vision",
    status: "Standby",
    active: false,
    latency: "1250ms",
    errorRate: "0.00%",
    errorPct: 0,
  },
];

const INFRA_CARDS = [
  { icon: "storage", label: "Cache Hit Rate", value: "94.2%", isError: false },
  { icon: "speed", label: "Tokens / Seg", value: "12.5k", isError: false },
  { icon: "warning", label: "Presupuesto Diario", value: "92% Usado", isError: true, pct: 92 },
];

type RoutingRule = {
  label: string;
  category: string;
  model: string;
  modelBg: string;
  badge: string;
  badgeColor: string;
  enabled: boolean;
};

const INITIAL_RULES: RoutingRule[] = [
  {
    label: "Low cost tasks",
    category: "Operativo",
    model: "DeepSeek-V3",
    modelBg: "bg-primary-container",
    badge: "AHORRO 85%",
    badgeColor: "bg-green-100 text-green-700",
    enabled: true,
  },
  {
    label: "Strategic reports",
    category: "Análisis",
    model: "Mistral-Large",
    modelBg: "bg-tertiary-container",
    badge: "CALIDAD MAX",
    badgeColor: "bg-blue-100 text-blue-700",
    enabled: true,
  },
];

export default function ModelosCostosPage() {
  const pathname = usePathname();
  const [rules, setRules] = useState<RoutingRule[]>(INITIAL_RULES);
  const [revenue, setRevenue] = useState(12450);
  const [margin, setMargin] = useState(35);

  // Revenue ticker
  useEffect(() => {
    const id = setInterval(() => {
      setRevenue((v) => +(v + (Math.random() * 10 - 4)).toFixed(2));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const toggleRule = (idx: number) => {
    setRules((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">

      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-on-tertiary-container/5 blur-[100px] rounded-full" />
      </div>

      {/* ── Admin Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-inverse-surface flex flex-col p-lg z-50 shadow-md">
        <div className="mb-2xl">
          <h1 className="font-headline-md text-headline-md text-secondary-fixed-dim">Admin Central</h1>
          <p className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">
            Control Maestro
          </p>
        </div>
        <nav className="flex-1 space-y-sm">
          {ADMIN_NAV.map((item) => {
            const active = item.active || pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-md p-md rounded-md transition-colors ${
                  active
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-sm text-label-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 pt-md">
          <div className="flex items-center gap-md p-md text-outline-variant">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label-sm text-label-sm">Logs del Sistema</span>
          </div>
          <div className="flex items-center gap-md p-md mt-md">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAncvQyLKZ2c9wcqwSeqWs7xREQaJUdff-qXPsP7381zlM3QctNi4lloggOHOJ1eh-uX8ihcXyfyacpVTTacQ4I-lJaootqRbRA5ReL5TBcaySbnFtWWjYyloEycj1MXDDd1T7UhGqnXyeUQO_qg1wNUXmlXYeP-zyxTqYcNwS3zEMULElY5hGBkjhxV_SbjUkl-qFJgWcTcuEsOp6dFdIl4fdgfXhi4fzuvnNoLSgbyY916DISjjDpkwTy8-eLZxpRC_RJclgY-WY"
              alt="Avatar de Administrador"
              width={32}
              height={32}
              className="rounded-full border border-outline-variant flex-shrink-0"
            />
            <div className="overflow-hidden">
              <p className="font-label-sm text-label-sm text-inverse-on-surface truncate">Admin Root</p>
              <p className="text-[10px] text-outline-variant">SysOp Nivel 4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="ml-[260px] p-margin-desktop min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-end mb-2xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Modelos &amp; Administración de Costos
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Gestión avanzada de proveedores LLM, enrutamiento semántico y márgenes operativos.
            </p>
          </div>
          <div className="flex gap-md">
            <button
              type="button"
              className="px-lg py-md bg-surface-container-highest border border-outline-variant text-on-surface-variant font-body-md rounded-lg flex items-center gap-sm hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">download</span> Descargar Reporte
            </button>
            <Link
              href="/app/misiones/nueva"
              className="px-lg py-md bg-secondary text-on-secondary font-body-md rounded-lg flex items-center gap-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span> Crear Nueva Misión
            </Link>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-gutter">

          {/* ── Margin Calculator ── */}
          <section className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h3 className="font-title-md text-title-md text-primary">Calculadora de Margen</h3>
              <span className="material-symbols-outlined text-secondary">analytics</span>
            </div>
            <div className="space-y-md">
              <div className="p-md bg-surface-container rounded-lg">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Ingresos Estimados (USD)
                </p>
                <p className="font-headline-md text-headline-md text-primary">
                  ${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-md bg-error-container/20 rounded-lg border border-error-container">
                <p className="font-label-sm text-label-sm text-on-error-container uppercase">
                  Costo de Tokens (Acumulado)
                </p>
                <p className="font-headline-md text-headline-md text-on-error-container">$4,120.35</p>
              </div>
              <div className="pt-sm">
                <div className="flex justify-between mb-xs">
                  <span className="font-body-md font-bold">Margen Bruto</span>
                  <span className="font-body-md font-bold text-secondary">66.9%</span>
                </div>
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[67%]" />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-auto w-full py-md bg-primary text-on-primary rounded-lg font-body-md ia-glow"
            >
              Optimizar con Agente
            </button>
          </section>

          {/* ── Providers Table ── */}
          <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-title-md text-title-md text-primary">
                Estado de Proveedores y Latencia
              </h3>
              <span className="px-sm py-xs bg-secondary/10 text-secondary text-[10px] rounded font-bold uppercase">
                Real-time
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    {["Proveedor", "Modelo", "Status", "Latencia (Avg)", "Error Rate"].map((h) => (
                      <th
                        key={h}
                        className="px-lg py-md font-label-sm text-label-sm text-outline uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {PROVIDERS.map((p) => (
                    <tr key={p.name} className="hover:bg-surface-container transition-colors">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div
                            className={`w-8 h-8 rounded ${p.bg} flex items-center justify-center text-white font-bold text-xs`}
                          >
                            {p.initials}
                          </div>
                          <span className="font-title-md text-primary">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant font-code-mono">{p.model}</td>
                      <td className="px-lg py-md">
                        <span
                          className={`flex items-center gap-xs ${p.active ? "text-secondary" : "text-outline"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${p.active ? "bg-secondary animate-pulse" : "bg-outline"}`}
                          />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant">{p.latency}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <span className="font-body-md">{p.errorRate}</span>
                          <div className="w-16 h-1 bg-surface-variant rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary"
                              style={{ width: `${p.errorPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Routing Rules ── */}
          <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-title-md text-title-md text-primary">
                Reglas de Enrutamiento Inteligente
              </h3>
              <button
                type="button"
                className="text-secondary font-label-sm text-label-sm flex items-center gap-xs hover:underline"
              >
                <span className="material-symbols-outlined text-sm">settings_input_component</span>
                Gestionar Prioridades
              </button>
            </div>
            <div className="space-y-md">
              {rules.map((rule, idx) => (
                <div
                  key={rule.label}
                  className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant/30 rounded-lg hover:border-secondary transition-all group"
                >
                  <div className="flex items-center gap-lg">
                    <div className="flex flex-col">
                      <span className="font-body-lg text-primary">{rule.label}</span>
                      <span className="text-[10px] text-outline-variant">Categoría: {rule.category}</span>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary">
                      arrow_forward
                    </span>
                    <div
                      className={`px-md py-xs ${rule.modelBg} text-white rounded text-xs font-code-mono`}
                    >
                      {rule.model}
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className={`px-sm py-xs text-[10px] font-bold rounded ${rule.badgeColor}`}>
                      {rule.badge}
                    </span>
                    {/* Toggle switch */}
                    <button
                      type="button"
                      onClick={() => toggleRule(idx)}
                      className={`w-10 h-5 rounded-full relative p-xs transition-colors ${
                        rule.enabled ? "bg-secondary" : "bg-outline-variant"
                      }`}
                      aria-label={rule.enabled ? "Desactivar regla" : "Activar regla"}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                          rule.enabled ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add rule row */}
              <div className="flex items-center justify-between p-md bg-surface-container-low border border-dashed border-outline-variant/30 rounded-lg">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-sm text-on-surface-variant font-label-sm py-sm hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir Regla de Enrutamiento
                </button>
              </div>
            </div>
          </section>

          {/* ── Token Pricing ── */}
          <section className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <h3 className="font-title-md text-title-md text-primary mb-lg">
              Configuración de Precios (per 1M tokens)
            </h3>
            <div className="space-y-lg">
              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-outline block">
                  MARGEN OPERATIVO (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md text-primary font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                  <span className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant">%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-sm">
                  <label className="font-label-sm text-label-sm text-outline block">
                    COSTO INPUT (AVG)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="$0.15"
                    className="w-full bg-surface-container-high border-none rounded-lg px-md py-md text-on-surface-variant font-code-mono"
                  />
                </div>
                <div className="space-y-sm">
                  <label className="font-label-sm text-label-sm text-outline block">
                    PRECIO CLIENTE
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="$0.22"
                    className="w-full bg-surface-container-high border-none rounded-lg px-md py-md text-secondary font-bold font-code-mono"
                  />
                </div>
              </div>
              <div className="p-md bg-primary text-white rounded-lg flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <p className="font-label-sm opacity-70">Ajuste Global Sugerido por IA</p>
                  <p className="font-title-md">+5.2% basado en latencia</p>
                </div>
                <button
                  type="button"
                  className="relative z-10 px-md py-xs bg-white text-primary rounded font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── Infrastructure Status ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-2xl">
          {INFRA_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-lg shadow-sm relative overflow-hidden"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  card.isError
                    ? "bg-error-container/20 text-error"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={card.isError ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {card.icon}
                </span>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant">{card.label}</p>
                <p className={`font-headline-md ${card.isError ? "text-error" : "text-primary"}`}>
                  {card.value}
                </p>
              </div>
              {card.isError && card.pct !== undefined && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-error"
                  style={{ width: `${card.pct}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="ml-[260px] border-t border-outline-variant bg-background py-xl">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-md md:mb-0">
            <p className="font-title-md text-title-md font-bold text-primary mb-sm">AgentHub</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
            </p>
          </div>
          <nav className="flex gap-lg">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-label-sm text-label-sm text-on-surface-variant hover:underline transition-all"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
