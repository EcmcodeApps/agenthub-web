"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import Image from "next/image";

const STEPS = ["Bienvenida", "Tu empresa", "Agentes"] as const;

const INDUSTRIES = [
  { id: "retail",      label: "Retail",      icon: "shopping_bag",      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7JsIXzi4iB2Ut9SamjujFKuyrtjJUQ0_s7KUVpPl7LYmE4p15_lj-m35cKcqnadounjvN8j254dTDLFdOiBoX4MhBAeiz6hQw8kCOR1TxXz06K2Ctbk-EO6_3RP1lp2h6Y0pBnO763kVVV4GTuuEltf7ppRLE_F80tf6ueW0tg5W-Uxih-L1txezNvVX7IXrR64sogRPa1r-vL0qhAWC-ShNfiNr3ENVYV6Ratc7vt8goXlKga80ICWMcYCh7P7hFb55pTF1XMRw", alt: "Retail" },
  { id: "restaurantes",label: "Restaurantes",icon: "restaurant",          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqoK4DIHea1wOS8uPzhBdA_578e0_RaTZ6Mn1-9o_ho01uaziAVkt3NWesTqk0Q615vqHJo-gRYfjJsV7Fmt_kl3Am_PVKT7T8AKeLVrUJf5gVVvYg-lNw6gMdZ4zdELGo3RN8ECjqZ2BdF1FK_x2LGccmOm05VLrMT7XJbPvadWnb1ZSYC5jvdNdb1gXeaAsUPoLhIzrfH_Wd7hc5INso2_uBqG5A_PMVKi_hVAo2mJ9Rvv7WEy-PoMylHyPNxyJ3hI18z4i6P0A", alt: "Restaurantes" },
  { id: "logistica",   label: "Logística",   icon: "local_shipping",     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTqwRJwyU1P8pJ-zJPtqQPXeGeRz07HIZavpToPLkIsRt4ev_1ybbBf6KiXb5CBVgzxWz-cjg3y3y6LMfMEV_M6ICSaHtv02HOsyerv9diSk4Pe6KlR86GxcDEITg3lUZO0bLe4boFVS9m-CyeOU3LyNbbM9WmjMlKOP_aMS94HIin8WmiuotHCLlpeaRD4X1x-sz1p1eOcUM-WDcoHvdq0fvVpFAQWhwuBbli_3h6iWAsQzjMvBssIKonQnSpyeQ6nqM504bK8P8", alt: "Logística" },
  { id: "servicios",   label: "Servicios",   icon: "business_center",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGkHE9jzImGbyI8bgUFVWVAA_nBVY8CXL7IEy9ZeqRytwHdQej5vIaQovPF564JvbR2P0WWkHyeXa2HAaiCBDdRLQvq9mwwoN9cm035cVIHFnVYwXpUit5g4GK5o0HKFEGoShTwpr0IpRwk5aK6-rhcsK5n05t2KqTt5k-vpAKxDjQlHTyXtEA_L9K0jv4v7IpOSY0xqKHukDtkxncwlyzhofdInfp_ddwr1oFcnCBS4jViYxv7mvGw3oRc1yesziWcQPiCxdAM9c", alt: "Servicios" },
];

const AGENT_TYPES = [
  { id: "ventas",     icon: "trending_up",    label: "Agente de Ventas",       desc: "Analiza leads, prospecta y genera reportes de oportunidades." },
  { id: "soporte",    icon: "headset_mic",    label: "Agente de Soporte",       desc: "Responde preguntas frecuentes y escala tickets complejos." },
  { id: "analista",   icon: "analytics",      label: "Analista de Datos",       desc: "Procesa documentos y entrega insights accionables." },
  { id: "marketing",  icon: "campaign",       label: "Agente de Marketing",     desc: "Crea contenido, monitorea campañas y sugiere mejoras." },
];

const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];

const AGENT_ICONS = [
  { icon: "smart_toy", fill: true }, { icon: "psychology", fill: false },
  { icon: "hub", fill: true },       { icon: "insights", fill: false },
  { icon: "terminal", fill: true },  { icon: "monitoring", fill: false },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "bienvenido";

  const [step, setStep]                   = useState(0);
  const [industry, setIndustry]           = useState("retail");
  const [teamSize, setTeamSize]           = useState("11-50");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["ventas"]);

  const progress = [(step / (STEPS.length)) * 100, 33, 66, 100][step] ?? 100;

  function toggleAgent(id: string) {
    setSelectedAgents((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((a) => a !== id) : prev) : [...prev, id]
    );
  }

  function handleNext() {
    if (step < STEPS.length - 1) { setStep((s) => s + 1); return; }
    router.push("/app/dashboard");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-background font-body-md">

      {/* ── Left branding panel ── */}
      <aside className="hidden md:flex w-[38%] bg-gradient-to-br from-primary-container to-secondary flex-col p-margin-desktop relative overflow-hidden">
        <div className="z-10">
          <span className="font-headline-md text-headline-md font-bold text-white tracking-tight">AgentHub</span>
          <p className="font-code-mono text-xs text-white/60 mt-1 uppercase tracking-widest">Empresarial AI</p>
        </div>

        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="w-full max-w-sm">
            <div className="grid grid-cols-3 gap-4 mb-8" style={{ animation: "float 4s ease-in-out infinite" }}>
              {AGENT_ICONS.map((a, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${!a.fill ? "opacity-60" : ""}`}
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="material-symbols-outlined text-white text-3xl" style={a.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {a.icon}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="font-headline-sm text-white mb-2">Potencia tu Empresa con IA</h2>
              <p className="text-white/70 font-body-md text-sm">Misiones automatizadas de alta precisión.</p>
            </div>

            {/* Step progress visual */}
            <div className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    i < step ? "bg-white" : i === step ? "bg-secondary border-2 border-white" : "bg-white/20"
                  }`}>
                    {i < step
                      ? <span className="material-symbols-outlined text-primary-container text-sm">check</span>
                      : <span className="font-code-mono text-xs text-white font-bold">{i + 1}</span>
                    }
                  </div>
                  <span className={`font-body-md text-sm transition-all ${i === step ? "text-white font-bold" : "text-white/50"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-lg z-10">
          {[{ value: "+500", label: "Empresas" }, { value: "99.9%", label: "Uptime" }, { value: "15ms", label: "Latencia" }].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-title-md text-white font-bold">{s.value}</p>
              <p className="font-label-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-container rounded-full blur-[100px] -mb-32 -mr-32 opacity-30 pointer-events-none" />
      </aside>

      {/* ── Right content panel ── */}
      <main className="w-full md:w-[62%] bg-surface flex flex-col overflow-y-auto">

        {/* Progress bar */}
        <div className="sticky top-0 w-full h-1 bg-surface-container-highest z-50">
          <div className="h-full bg-secondary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="max-w-2xl mx-auto w-full px-margin-mobile py-xl md:px-margin-desktop flex flex-col min-h-full">

          {/* Step pills */}
          <nav className="flex items-center gap-2 mb-10 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm transition-all ${
                  i === step
                    ? "bg-secondary-container text-on-secondary-container border-secondary/20 font-bold"
                    : i < step
                    ? "bg-surface-container text-secondary border-secondary/20"
                    : "bg-surface-container-low text-on-surface-variant border-transparent"
                }`}>
                  {i < step && <span className="material-symbols-outlined text-[14px]">check</span>}
                  <span>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-outline-variant" />}
              </div>
            ))}
          </nav>

          {/* ── STEP 0: Bienvenida + Industria ── */}
          {step === 0 && (
            <div className="flex-grow">
              <header className="mb-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full font-code-mono text-xs uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Configuración inicial
                </span>
                <h1 className="font-headline-lg text-on-surface mb-2">
                  Hola {firstName}, configuremos tu equipo de agentes IA
                </h1>
                <p className="font-body-lg text-on-surface-variant">
                  En 3 minutos tendrás tu primer equipo listo para ejecutar misiones.
                </p>
              </header>

              <div className="mb-8">
                <label className="block font-label-sm text-on-surface-variant uppercase mb-4 tracking-widest">
                  ¿En qué industria opera tu empresa?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INDUSTRIES.map((ind) => {
                    const sel = industry === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setIndustry(ind.id)}
                        className={`relative h-[160px] rounded-xl overflow-hidden group text-left transition-all duration-300 ${
                          sel ? "border-2 border-secondary ring-4 ring-secondary/5" : "border border-outline-variant hover:border-secondary/50"
                        }`}
                      >
                        <Image src={ind.src} alt={ind.alt} fill className={`object-cover transition-transform duration-500 group-hover:scale-105 ${sel ? "grayscale-[20%]" : "grayscale-[50%]"}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        {sel && <div className="absolute inset-0 bg-secondary/30" />}
                        {sel && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>check</span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 flex flex-col">
                          <span className="material-symbols-outlined text-white mb-1 opacity-80">{ind.icon}</span>
                          <span className="font-title-md text-white">{ind.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Tu empresa ── */}
          {step === 1 && (
            <div className="flex-grow">
              <header className="mb-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-code-mono text-xs uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                  Tu empresa
                </span>
                <h1 className="font-headline-lg text-on-surface mb-2">Cuéntanos sobre tu empresa</h1>
                <p className="font-body-lg text-on-surface-variant">
                  Esto nos permite configurar los agentes con los parámetros correctos.
                </p>
              </header>

              <div className="space-y-6">
                {/* Tamaño equipo */}
                <div>
                  <label className="block font-label-sm text-on-surface-variant uppercase mb-3 tracking-widest">
                    ¿Cuántas personas hay en tu empresa?
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {TEAM_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTeamSize(size)}
                        className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                          teamSize === size
                            ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20"
                            : "border-outline-variant text-on-surface-variant hover:border-secondary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Objetivo principal */}
                <div>
                  <label className="block font-label-sm text-on-surface-variant uppercase mb-3 tracking-widest">
                    ¿Cuál es tu objetivo principal con AgentHub?
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "automatizar", icon: "autorenew",   label: "Automatizar tareas repetitivas" },
                      { id: "analizar",    icon: "analytics",   label: "Analizar datos y generar reportes" },
                      { id: "escalar",     icon: "trending_up", label: "Escalar operaciones sin aumentar equipo" },
                      { id: "soporte",     icon: "headset_mic", label: "Mejorar atención al cliente" },
                    ].map(({ id, icon, label }) => (
                      <label key={id} className="flex items-center gap-3 p-3 border border-outline-variant rounded-xl cursor-pointer hover:border-secondary/50 hover:bg-surface-container-low transition-all group">
                        <input type="radio" name="objetivo" value={id} defaultChecked={id === "automatizar"} className="accent-secondary w-4 h-4" />
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">{icon}</span>
                        <span className="font-body-md text-on-surface">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info card */}
                <div className="bg-secondary-fixed/10 border border-secondary/20 rounded-xl p-4 flex gap-3">
                  <span className="material-symbols-outlined text-secondary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  <p className="font-body-md text-on-surface-variant text-sm">
                    Usamos esta información solo para personalizar tu experiencia. Puedes cambiarla en cualquier momento desde <strong>Configuración</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Agentes ── */}
          {step === 2 && (
            <div className="flex-grow">
              <header className="mb-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full font-code-mono text-xs uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                  Equipo de Agentes
                </span>
                <h1 className="font-headline-lg text-on-surface mb-2">
                  Elige tus primeros agentes
                </h1>
                <p className="font-body-lg text-on-surface-variant">
                  Selecciona los agentes que necesitas. Puedes agregar más después.
                </p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {AGENT_TYPES.map(({ id, icon, label, desc }) => {
                  const sel = selectedAgents.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAgent(id)}
                      className={`relative p-4 rounded-xl border text-left transition-all group ${
                        sel
                          ? "border-secondary bg-secondary/5 ring-2 ring-secondary/10"
                          : "border-outline-variant hover:border-secondary/50 hover:bg-surface-container-low"
                      }`}
                    >
                      {sel && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>check</span>
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${sel ? "bg-secondary text-white" : "bg-surface-container text-on-surface-variant"}`}>
                        <span className="material-symbols-outlined" style={sel ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
                      </div>
                      <h3 className="font-bold text-on-surface mb-1">{label}</h3>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Summary card */}
              <div className="bg-primary-container text-white rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">
                    {selectedAgents.length} agente{selectedAgents.length !== 1 ? "s" : ""} seleccionado{selectedAgents.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-white/70 text-sm">Tu equipo estará listo al finalizar la configuración.</p>
                </div>
                <div className="font-code-mono text-xs text-white/60 text-right">
                  <p>Plan Trial</p>
                  <p className="text-white font-bold">Gratis 14 días</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-8 pb-10 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleNext}
              className="w-full h-14 bg-secondary text-on-secondary rounded-xl font-title-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
            >
              <span>{step < STEPS.length - 1 ? "Continuar" : "Ir al Dashboard"}</span>
              <span className="material-symbols-outlined">{step < STEPS.length - 1 ? "arrow_forward" : "rocket_launch"}</span>
            </button>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="text-center font-label-sm text-on-surface-variant hover:text-secondary transition-colors">
                ← Volver
              </button>
            )}
            <p className="text-center font-label-sm text-on-surface-variant">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="text-secondary hover:underline">Habla con soporte</a>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
