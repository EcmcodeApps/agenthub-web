"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { icon: "assignment", label: "Misiones", href: "/app/misiones" },
  { icon: "description", label: "Documentos", href: "/app/documentos" },
  { icon: "analytics", label: "Reportes", href: "/app/reportes" },
  { icon: "smart_toy", label: "Agentes", href: "/app/agentes" },
  { icon: "payments", label: "Facturación", href: "/app/facturacion" },
];

const CHART_BARS = [
  { label: "Electro", value: 92, pct: 90, featured: false },
  { label: "Hogar", value: 65, pct: 65, featured: false },
  { label: "Moda", value: 110, pct: 100, featured: true },
  { label: "Otros", value: 40, pct: 40, featured: false },
];

const FINDINGS = [
  {
    icon: "trending_up",
    color: "text-secondary",
    title: "Crecimiento Orgánico en Moda",
    desc: "El algoritmo detectó un aumento del 22% en búsquedas sin correlación de stock.",
  },
  {
    icon: "warning",
    color: "text-error",
    title: "Excedente en Línea Blanca",
    desc: "45 unidades de refrigeración con más de 90 días en bodega.",
  },
  {
    icon: "bolt",
    color: "text-on-tertiary-container",
    title: "Eficiencia Logística",
    desc: "Reducción del tiempo de entrega en un 12% gracias a la IA.",
  },
];

const RECOMMENDATIONS = [
  "Ejecutar una campaña de liquidación para la categoría \"Electrónica\" con descuentos escalonados del 15% al 30%.",
  "Reabastecer de forma inmediata el inventario de \"Moda\" para cubrir la demanda proyectada del próximo mes.",
  "Activar el Agente de Precios para monitoreo 24/7 de la competencia en el segmento de periféricos gaming.",
];

const AGENTS = [
  {
    name: "Agente de Ventas",
    tokens: "12,450 units",
    pct: 65,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA72QmmiQvypSI6x5nI-f73OX_NSzSux6I3ZVZ86DwlkMZ0VXt7JjEcEri1O0HbBuzRma2X1vjXSjnJOMdMq-I931JFdQWdUVZRNAJ0NPTkuRcRbxjDtSF8iVUdNBtwKuQ7OWBHS6AS0DkuzIvDrF4-0pn0yZjOfQ37qoilBg5bREEsuYsua_ValLIn_YXcbt_P2OfVvU5SiFrHn1ZStaNIeXJ5ldu7GzmtNr6CiidQVD4Z_lFvjHCHeZdbzPPEAdigtfMvLF3sjLg",
    alt: "Avatar Agente de Ventas",
  },
  {
    name: "Agente de Precios",
    tokens: "8,922 units",
    pct: 40,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsysvbq9I2YLKbdzf5wcirrwIHBXXHanMpKIQnYjRvdDg8wNq1dx0dSQntwYscyF4JxzSv5EpfUXGB_rWTF0by-JPz_tVg0A7yzRXdMFeA8Cr22uPnF26PQuXtYRD-rNMHSWO7bAHkEhAIaXttEDJ6c9Mpkm5_87B-7iNZBD8fXl_LDXjjTz0HC1pS8L96fUlL_76SF20p40NEoQc5njQBgG02Bb5CJia8orQDW7q55oQg8PCR0qtHoKwFhBGxU924SP-ymNrbDSk",
    alt: "Avatar Agente de Precios",
  },
];

const METADATA = [
  { label: "Fecha de Análisis", value: "14 de Oct, 2024", mono: false },
  { label: "Fuentes de Datos", value: "ERP, CRM, API-Comp", mono: false },
  { label: "Confianza Algorítmica", value: "98.2%", highlight: true },
];

export default function ReporteDetallePage() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [barHeights, setBarHeights] = useState(CHART_BARS.map(() => 0));
  const animatedRef = useRef(false);

  // Animate bars on mount
  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    CHART_BARS.forEach((bar, i) => {
      setTimeout(() => {
        setBarHeights((prev) => {
          const next = [...prev];
          next[i] = bar.pct;
          return next;
        });
      }, 200 + i * 100);
    });
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container text-on-primary-container flex-col p-md shadow-sm hidden md:flex print:hidden z-50">
        <div className="mb-xl">
          <h1 className="font-headline-md text-headline-md font-bold">AgentHub</h1>
          <p className="font-label-sm text-label-sm opacity-70">Control Maestro</p>
        </div>
        <nav className="flex-grow space-y-sm">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md p-sm rounded-lg transition-all ${
                  active
                    ? "bg-secondary text-on-secondary"
                    : "text-outline-variant hover:bg-on-primary-fixed-variant hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-sm pt-md border-t border-on-primary-fixed-variant">
          <Link href="/app/configuracion" className="flex items-center gap-md p-sm text-outline-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Configuración</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="md:ml-[260px] p-margin-mobile md:p-margin-desktop max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg mb-2xl">
          <div>
            <nav className="flex items-center gap-xs text-on-surface-variant font-label-sm mb-sm">
              <Link href="/app/reportes" className="hover:text-primary transition-colors">
                Reportes
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">Detalle de Análisis</span>
            </nav>
            <h1 className="font-display-xl text-display-xl text-primary">
              Análisis de Inventario y Ventas
            </h1>
            <p className="text-on-surface-variant font-body-lg">
              ID Reporte: #AH-2024-0892 • Generado por Motor IA v4.2
            </p>
          </div>
          <div className="flex flex-wrap gap-sm print:hidden">
            <button
              type="button"
              onClick={handleCopy}
              className={`px-lg py-sm border border-outline-variant rounded-lg font-body-md transition-colors flex items-center gap-xs ${
                copied
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-surface-container-highest text-primary hover:bg-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined">
                {copied ? "check" : "content_copy"}
              </span>
              {copied ? "Copiado" : "Copiar resumen"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-lg py-sm bg-white border border-outline-variant rounded-lg font-body-md text-primary hover:bg-surface-variant transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Descargar PDF
            </button>
            <Link
              href="/app/misiones/nueva"
              className="px-lg py-sm ia-glow rounded-lg font-body-md text-primary font-semibold hover:opacity-90 transition-all flex items-center gap-xs"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Crear misión basada en este reporte
            </Link>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">

          {/* ── Left: Document ── */}
          <div className="lg:col-span-8 space-y-xl">

            {/* Executive Summary */}
            <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
              <div className="flex items-center gap-sm mb-md text-secondary">
                <span className="material-symbols-outlined">summarize</span>
                <h2 className="font-headline-md text-headline-md">Resumen Ejecutivo</h2>
              </div>
              <div className="space-y-md text-on-surface-variant leading-relaxed">
                <p className="font-body-lg">
                  El presente análisis integra datos transaccionales del último trimestre con los
                  niveles de stock actuales, identificando una desviación del{" "}
                  <span className="font-bold text-secondary">12.4%</span> en la rotación de
                  productos de alta demanda. Los Agentes de Ventas y Precios han colaborado para
                  determinar que el excedente en la categoría "Electrónica" está impactando
                  directamente el flujo de caja operativo.
                </p>
                <p className="font-body-lg">
                  Se ha detectado una oportunidad de optimización de ingresos mediante ajustes
                  dinámicos de precios en un 15% del catálogo, lo cual podría recuperar el margen
                  perdido por costos de almacenamiento acumulados.
                </p>
              </div>
            </section>

            {/* Key Findings */}
            <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
              <div className="flex items-center gap-sm mb-xl text-secondary">
                <span className="material-symbols-outlined">insights</span>
                <h2 className="font-headline-md text-headline-md">Hallazgos Principales</h2>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
                <div className="p-md bg-surface-container rounded-lg">
                  <p className="font-label-sm text-on-surface-variant mb-xs">Nivel de Optimización</p>
                  <div className="flex items-end gap-sm">
                    <span className="text-[32px] font-bold text-primary">84%</span>
                    <span className="text-on-secondary-fixed-variant font-label-sm mb-1">
                      +5.2% vs mes anterior
                    </span>
                  </div>
                  <div className="w-full bg-outline-variant h-1.5 mt-md rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[84%]" />
                  </div>
                </div>
                <div className="p-md bg-surface-container rounded-lg">
                  <p className="font-label-sm text-on-surface-variant mb-xs">
                    Riesgo de Ruptura de Stock
                  </p>
                  <div className="flex items-end gap-sm">
                    <span className="text-[32px] font-bold text-error">Bajo</span>
                    <span className="text-on-surface-variant font-label-sm mb-1">
                      3 SKUs en alerta roja
                    </span>
                  </div>
                  <div className="flex gap-1 mt-md">
                    <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                    <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                    <div className="h-1.5 flex-1 bg-outline-variant rounded-full" />
                    <div className="h-1.5 flex-1 bg-outline-variant rounded-full" />
                  </div>
                </div>
              </div>

              {/* Chart + Findings */}
              <div className="flex flex-col md:flex-row gap-lg">
                {/* Bar Chart */}
                <div className="flex-1 border border-outline-variant p-md rounded-lg">
                  <h3 className="font-title-md text-title-md mb-md">Ventas por Categoría</h3>
                  <div className="h-48 w-full flex items-end justify-between px-md gap-4">
                    {CHART_BARS.map((bar, i) => (
                      <div
                        key={bar.label}
                        className={`w-full rounded-t-sm relative group ${
                          bar.featured ? "bg-secondary" : "bg-secondary-fixed-dim"
                        }`}
                        style={{
                          height: `${barHeights[i]}%`,
                          transition: "height 1s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {bar.value}k
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-sm text-on-surface-variant font-label-sm px-md">
                    {CHART_BARS.map((bar) => (
                      <span key={bar.label}>{bar.label}</span>
                    ))}
                  </div>
                </div>

                {/* Finding Items */}
                <div className="flex-1 space-y-md">
                  {FINDINGS.map((f, i) => (
                    <div
                      key={f.title}
                      className={`flex gap-md items-start p-sm ${
                        i < FINDINGS.length - 1 ? "border-b border-surface-variant" : ""
                      }`}
                    >
                      <span className={`material-symbols-outlined ${f.color}`}>{f.icon}</span>
                      <div>
                        <p className="font-body-md font-bold">{f.title}</p>
                        <p className="font-label-sm text-on-surface-variant">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recommendations */}
            <section className="bg-secondary-fixed text-on-secondary-fixed p-lg rounded-xl shadow-sm">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined">assignment_turned_in</span>
                <h2 className="font-headline-md text-headline-md">Recomendaciones Accionables</h2>
              </div>
              <ul className="space-y-md">
                {RECOMMENDATIONS.map((rec, i) => (
                  <li key={i} className="flex items-start gap-md">
                    <span className="bg-on-secondary-fixed text-secondary-fixed rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-[12px]">
                      {i + 1}
                    </span>
                    <p className="font-body-lg">{rec}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="lg:col-span-4 space-y-xl">

            {/* Participating Agents */}
            <section className="space-y-md">
              <h3 className="font-title-md text-title-md text-on-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">group</span>
                Agentes que participaron
              </h3>
              {AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-md mb-md">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant flex-shrink-0">
                      <Image
                        src={agent.src}
                        alt={agent.alt}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-title-md text-primary">{agent.name}</p>
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Activo
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-label-sm text-on-surface-variant">
                    <span>Consumo de Tokens:</span>
                    <span className="font-code-mono text-primary">{agent.tokens}</span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 mt-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary h-full transition-all duration-500"
                      style={{ width: `${agent.pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full mt-md py-xs text-secondary font-label-sm border border-secondary rounded-lg hover:bg-secondary-fixed transition-colors"
                  >
                    Configurar Agente
                  </button>
                </div>
              ))}
            </section>

            {/* Metadata */}
            <section className="bg-surface-container-highest p-md rounded-xl border border-dashed border-outline-variant">
              <h3 className="font-label-sm text-on-surface-variant uppercase mb-md tracking-wider">
                Metadatos del Reporte
              </h3>
              <div className="space-y-sm">
                {METADATA.map((m) => (
                  <div key={m.label} className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-label-sm">{m.label}</span>
                    <span
                      className={
                        m.highlight
                          ? "text-secondary font-bold"
                          : "font-body-md font-medium"
                      }
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
                <div className="pt-sm border-t border-outline-variant flex justify-between items-center">
                  <span className="text-on-surface-variant font-label-sm">Créditos IA Utilizados</span>
                  <span className="font-code-mono">245.50</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-2xl py-xl border-t border-outline-variant bg-background print:hidden">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="font-title-md text-title-md font-bold text-primary">AgentHub</span>
            <span className="text-on-surface-variant font-label-sm">|</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
            </p>
          </div>
          <div className="flex gap-lg">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Print watermark */}
      <div className="hidden print:block fixed bottom-4 right-4 text-outline font-label-sm opacity-50">
        AgentHub Empresarial - Confidencial
      </div>
    </div>
  );
}
