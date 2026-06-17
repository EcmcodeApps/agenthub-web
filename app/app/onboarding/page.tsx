"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AGENT_ICONS = [
  { icon: "smart_toy", fill: true, opacity: "" },
  { icon: "psychology", fill: false, opacity: "opacity-60" },
  { icon: "hub", fill: true, opacity: "" },
  { icon: "insights", fill: false, opacity: "opacity-80" },
  { icon: "terminal", fill: true, opacity: "" },
  { icon: "monitoring", fill: false, opacity: "" },
];

const INDUSTRIES = [
  {
    id: "retail",
    label: "Retail",
    icon: "shopping_bag",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7JsIXzi4iB2Ut9SamjujFKuyrtjJUQ0_s7KUVpPl7LYmE4p15_lj-m35cKcqnadounjvN8j254dTDLFdOiBoX4MhBAeiz6hQw8kCOR1TxXz06K2Ctbk-EO6_3RP1lp2h6Y0pBnO763kVVV4GTuuEltf7ppRLE_F80tf6ueW0tg5W-Uxih-L1txezNvVX7IXrR64sogRPa1r-vL0qhAWC-ShNfiNr3ENVYV6Ratc7vt8goXlKga80ICWMcYCh7P7hFb55pTF1XMRw",
    alt: "Tienda retail moderna con diseño minimalista",
  },
  {
    id: "restaurantes",
    label: "Restaurantes",
    icon: "restaurant",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqoK4DIHea1wOS8uPzhBdA_578e0_RaTZ6Mn1-9o_ho01uaziAVkt3NWesTqk0Q615vqHJo-gRYfjJsV7Fmt_kl3Am_PVKT7T8AKeLVrUJf5gVVvYg-lNw6gMdZ4zdELGo3RN8ECjqZ2BdF1FK_x2LGccmOm05VLrMT7XJbPvadWnb1ZSYC5jvdNdb1gXeaAsUPoLhIzrfH_Wd7hc5INso2_uBqG5A_PMVKi_hVAo2mJ9Rvv7WEy-PoMylHyPNxyJ3hI18z4i6P0A",
    alt: "Restaurante elegante con iluminación cálida",
  },
  {
    id: "logistica",
    label: "Logística",
    icon: "local_shipping",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTqwRJwyU1P8pJ-zJPtqQPXeGeRz07HIZavpToPLkIsRt4ev_1ybbBf6KiXb5CBVgzxWz-cjg3y3y6LMfMEV_M6ICSaHtv02HOsyerv9diSk4Pe6KlR86GxcDEITg3lUZO0bLe4boFVS9m-CyeOU3LyNbbM9WmjMlKOP_aMS94HIin8WmiuotHCLlpeaRD4X1x-sz1p1eOcUM-WDcoHvdq0fvVpFAQWhwuBbli_3h6iWAsQzjMvBssIKonQnSpyeQ6nqM504bK8P8",
    alt: "Centro de distribución logística moderno",
  },
  {
    id: "servicios",
    label: "Servicios",
    icon: "business_center",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGkHE9jzImGbyI8bgUFVWVAA_nBVY8CXL7IEy9ZeqRytwHdQej5vIaQovPF564JvbR2P0WWkHyeXa2HAaiCBDdRLQvq9mwwoN9cm035cVIHFnVYwXpUit5g4GK5o0HKFEGoShTwpr0IpRwk5aK6-rhcsK5n05t2KqTt5k-vpAKxDjQlHTyXtEA_L9K0jv4v7IpOSY0xqKHukDtkxncwlyzhofdInfp_ddwr1oFcnCBS4jViYxv7mvGw3oRc1yesziWcQPiCxdAM9c",
    alt: "Sala de reuniones corporativa moderna",
  },
];

const STEPS = ["Bienvenida", "Tu empresa", "Agentes"];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState("retail");

  const handleContinue = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-background font-body-md">

      {/* ── Left Panel ── */}
      <aside className="hidden md:flex w-[40%] bg-gradient-to-br from-primary-container to-secondary flex-col p-margin-desktop relative overflow-hidden">

        {/* Brand */}
        <div className="z-10">
          <span className="font-headline-md text-headline-md font-bold text-white tracking-tight">
            AgentHub
          </span>
        </div>

        {/* Illustration */}
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="w-full max-w-sm aspect-square relative">
            {/* Atmosphere glow */}
            <div className="absolute inset-0 opacity-40">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
            </div>
            <div className="relative z-20 flex flex-col items-center justify-center space-y-6">
              {/* Agent grid */}
              <div
                className="grid grid-cols-3 gap-4"
                style={{ animation: "float 4s ease-in-out infinite" }}
              >
                {AGENT_ICONS.map((a, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${a.opacity} ${
                      i === 4 ? "bg-white/20" : ""
                    }`}
                    style={{
                      background: i === 4 ? undefined : "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-white text-3xl"
                      style={a.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {a.icon}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h2 className="font-headline-md text-headline-md text-white mb-2">
                  Potencia tu Empresa con IA
                </h2>
                <p className="text-white/70 font-body-md">
                  Misiones automatizadas de alta precisión.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-lg z-10">
          {[
            { value: "+500", label: "Empresas" },
            { value: "99.9%", label: "Uptime" },
            { value: "Optimizada", label: "IA Motor" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-title-md text-white font-bold">{s.value}</p>
              <p className="font-label-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Decorative blob */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-container rounded-full blur-[100px] -mb-32 -mr-32 opacity-30 pointer-events-none" />
      </aside>

      {/* ── Right Panel ── */}
      <main className="w-full md:w-[60%] bg-surface flex flex-col overflow-y-auto">

        {/* Progress bar */}
        <div className="sticky top-0 w-full h-1 bg-surface-container-highest z-50">
          <div
            className="h-full bg-secondary transition-all duration-1000"
            style={{ width: "25%" }}
          />
        </div>

        <div className="max-w-2xl mx-auto w-full px-margin-mobile py-xl md:px-margin-desktop flex flex-col min-h-full">

          {/* Step Indicator */}
          <nav className="flex items-center space-x-4 mb-12">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border transition-all ${
                    i === 0
                      ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                      : "bg-surface-container-low text-on-surface-variant border-transparent"
                  }`}
                >
                  <span className="font-label-sm">{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-2 h-px bg-outline-variant" />
                )}
              </div>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-grow">
            <header className="mb-10">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                Hola Carlos, configuremos tu equipo de agentes IA
              </h1>
              <p className="font-body-lg text-on-surface-variant">
                En 3 minutos tendrás tu primer equipo listo para ejecutar misiones.
              </p>
            </header>

            {/* Industry Selector */}
            <div className="mb-10">
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-4 tracking-widest">
                Selecciona tu industria
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INDUSTRIES.map((ind) => {
                  const selected = selectedIndustry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setSelectedIndustry(ind.id)}
                      className={`relative h-[160px] rounded-xl overflow-hidden group text-left transition-all duration-300 ${
                        selected
                          ? "border-2 border-secondary ring-4 ring-secondary/5"
                          : "border border-outline-variant hover:border-secondary"
                      }`}
                    >
                      {/* Background image */}
                      <Image
                        src={ind.src}
                        alt={ind.alt}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          selected ? "grayscale-[30%]" : "grayscale-[50%]"
                        }`}
                      />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Selection overlay */}
                      {selected && (
                        <div className="absolute inset-0 bg-secondary/40" />
                      )}

                      {/* Hover overlay (unselected) */}
                      {!selected && (
                        <div className="absolute inset-0 group-hover:bg-secondary/10 transition-all duration-300" />
                      )}

                      {/* Checkmark */}
                      {selected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-base" style={{ fontSize: "16px" }}>
                            check
                          </span>
                        </div>
                      )}

                      {/* Label */}
                      <div className="absolute bottom-4 left-4 flex flex-col">
                        <span className="material-symbols-outlined text-white mb-1 opacity-80">
                          {ind.icon}
                        </span>
                        <span className="font-title-md text-white">{ind.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8 pb-12">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-14 bg-secondary text-on-secondary rounded-xl font-title-md flex items-center justify-center space-x-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
              >
                <span>Continuar</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center mt-4 font-label-sm text-label-sm text-on-surface-variant">
                ¿Necesitas ayuda?{" "}
                <a href="#" className="text-secondary hover:underline">
                  Habla con soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
