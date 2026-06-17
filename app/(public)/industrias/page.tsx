"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

const INDUSTRIES_SMALL = [
  {
    icon: "work",
    color: "text-on-tertiary-container",
    title: "Servicios profesionales",
    desc: "Propuestas, resúmenes de reuniones y automatización de flujo documental corporativo.",
    colSpan: "md:col-span-4",
    variant: "glass",
  },
  {
    icon: "real_estate_agent",
    color: "text-secondary-fixed-dim",
    title: "Inmobiliarias",
    desc: "Avalúos, comparar propiedades e informes detallados para clientes exigentes.",
    colSpan: "md:col-span-4",
    variant: "dark",
  },
  {
    icon: "restaurant",
    color: "text-error",
    title: "Restaurantes",
    desc: "Analizar menú, identificar platos rentables y gestión automatizada de reseñas.",
    colSpan: "md:col-span-4",
    variant: "glass",
  },
  {
    icon: "agriculture",
    color: "text-on-secondary-fixed-variant",
    title: "Agro",
    desc: "Reportes técnicos de campo, análisis de costos operativos y pronóstico de clima.",
    colSpan: "md:col-span-4",
    variant: "glow",
    bgMotif: "potted_plant",
  },
];

const STATS = [
  { value: "+2.5M", label: "Tokens procesados hoy", color: "text-secondary" },
  { value: "99.9%", label: "Uptime Garantizado", color: "text-primary" },
  { value: "500+", label: "Misiones Activas", color: "text-primary" },
];

export default function IndustriasPage() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".glass-card");
    const enter = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
    };
    const leave = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0px)";
    };
    cards.forEach((c) => {
      c.addEventListener("mouseenter", enter);
      c.addEventListener("mouseleave", leave);
    });
    return () => {
      cards.forEach((c) => {
        c.removeEventListener("mouseenter", enter);
        c.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* ── Nav ── */}
      <nav className="bg-background flex justify-between items-center px-margin-desktop py-md w-full max-w-7xl mx-auto sticky top-0 z-50">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          AgentHub
        </Link>

        <div className="hidden md:flex gap-xl items-center">
          <Link
            href="/industrias"
            className="font-body-md text-body-md text-secondary border-b-2 border-secondary hover:text-secondary transition-colors"
          >
            Industrias
          </Link>
          <Link href="/precios" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">
            Precios
          </Link>
          <a href="#recursos" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">
            Recursos
          </a>
        </div>

        <Link
          href="/login"
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-md text-body-md hover:opacity-80 transition-all"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-2xl">
        {/* Hero */}
        <header className="mb-2xl text-center md:text-left">
          <h1 className="font-display-xl text-display-xl text-primary mb-md">
            Agentes IA por industria
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Soluciones de Inteligencia Artificial diseñadas específicamente para los retos operativos
            de su sector en Latinoamérica.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

          {/* Comercio Minorista — card grande */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-xl glass-card p-lg ai-border-glow transition-all hover:shadow-lg">
            <div className="flex flex-col h-full justify-between gap-xl">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-sm">
                  <div className="flex items-center gap-sm text-secondary">
                    <span className="material-symbols-outlined text-headline-md">shopping_bag</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest">
                      Retail &amp; Commerce
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">Comercio minorista</h3>
                  <ul className="flex flex-wrap gap-xs mt-sm">
                    {["Analizar ventas", "Inventario lento", "Campañas WhatsApp"].map((tag) => (
                      <li
                        key={tag}
                        className="bg-secondary-fixed text-on-secondary-fixed-variant px-sm py-xs rounded font-label-sm text-label-sm"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden md:block w-32 h-32 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiE3yMFBs0vjSEHLhw9TGVmK3vevw8WMgFmxcr4CMwj2uNXP4l-CUl9qZt_l8KIS4NYeg8RsZuoffeb4z3zuLaJxgmVSp5bM1vrbLllA1wUu8WIw6EJzHAf5KtKwIkwOPD3inqP5PyV9rzi-sGocohIpguqNbUl_ylGt10qQtBD8VjnSCge_jPeMJbSFGadNRSTYusA_fuPHS4CujP6eUCypWnOmvOJUGpiROnT_cvRE95sENKXr6Zp0VdWTGPbpDofZ8H5PGAAJk"
                    alt="Tienda de comercio minorista moderna"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <button className="flex items-center justify-center gap-sm bg-primary text-on-primary w-full md:w-fit px-xl py-md rounded-lg font-title-md text-title-md hover:bg-on-primary-fixed-variant transition-colors group">
                Ver misiones sugeridas
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Cards pequeñas */}
          {INDUSTRIES_SMALL.map((ind) => {
            if (ind.variant === "dark") {
              return (
                <div
                  key={ind.title}
                  className={`${ind.colSpan} group rounded-xl bg-primary-container p-lg transition-all hover:shadow-lg border border-on-primary-fixed-variant flex flex-col justify-between`}
                >
                  <div>
                    <div className={`${ind.color} mb-md`}>
                      <span className="material-symbols-outlined text-headline-md">{ind.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-primary mb-sm">{ind.title}</h3>
                    <p className="font-body-md text-body-md text-on-primary-container mb-lg">{ind.desc}</p>
                  </div>
                  <button className="text-secondary-fixed font-title-md text-title-md flex items-center gap-xs hover:opacity-80">
                    Ver misiones sugeridas
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              );
            }

            if (ind.variant === "glow") {
              return (
                <div
                  key={ind.title}
                  className={`${ind.colSpan} group rounded-xl glass-card p-lg transition-all hover:shadow-lg ai-border-glow flex flex-col justify-between overflow-hidden relative`}
                >
                  <div className="relative z-10">
                    <div className={`${ind.color} mb-md`}>
                      <span className="material-symbols-outlined text-headline-md">{ind.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-sm">{ind.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-lg">{ind.desc}</p>
                  </div>
                  <button className="relative z-10 text-secondary font-title-md text-title-md flex items-center gap-xs hover:underline">
                    Ver misiones sugeridas
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                  {ind.bgMotif && (
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 scale-150 pointer-events-none">
                      <span className="material-symbols-outlined text-[120px]">{ind.bgMotif}</span>
                    </div>
                  )}
                </div>
              );
            }

            // glass (default)
            return (
              <div
                key={ind.title}
                className={`${ind.colSpan} group rounded-xl glass-card p-lg transition-all hover:shadow-lg border-outline-variant flex flex-col justify-between`}
              >
                <div>
                  <div className={`${ind.color} mb-md`}>
                    <span className="material-symbols-outlined text-headline-md">{ind.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-sm">{ind.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg">{ind.desc}</p>
                </div>
                <button className="text-secondary font-title-md text-title-md flex items-center gap-xs hover:underline">
                  Ver misiones sugeridas
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <section className="mt-2xl grid grid-cols-1 md:grid-cols-3 gap-lg border-t border-outline-variant pt-2xl">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-xs">
              <span className={`font-display-xl text-display-xl ${s.color}`}>{s.value}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-background border-t border-outline-variant py-xl mt-2xl">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="font-title-md text-title-md font-bold text-primary">AgentHub Empresarial</div>
          <div className="flex gap-xl">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a key={l} href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all duration-300">
                {l}
              </a>
            ))}
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant text-center md:text-right">
            © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
          </p>
        </div>
      </footer>
    </div>
  );
}
