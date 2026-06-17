"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import Image from "next/image";

const STEPS = ["Bienvenida", "Tu empresa", "Agentes"] as const;

const INDUSTRIES = [
  { id: "retail",       label: "Retail",       icon: "shopping_bag",   src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7JsIXzi4iB2Ut9SamjujFKuyrtjJUQ0_s7KUVpPl7LYmE4p15_lj-m35cKcqnadounjvN8j254dTDLFdOiBoX4MhBAeiz6hQw8kCOR1TxXz06K2Ctbk-EO6_3RP1lp2h6Y0pBnO763kVVV4GTuuEltf7ppRLE_F80tf6ueW0tg5W-Uxih-L1txezNvVX7IXrR64sogRPa1r-vL0qhAWC-ShNfiNr3ENVYV6Ratc7vt8goXlKga80ICWMcYCh7P7hFb55pTF1XMRw", alt: "Retail" },
  { id: "restaurantes", label: "Restaurantes", icon: "restaurant",      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqoK4DIHea1wOS8uPzhBdA_578e0_RaTZ6Mn1-9o_ho01uaziAVkt3NWesTqk0Q615vqHJo-gRYfjJsV7Fmt_kl3Am_PVKT7T8AKeLVrUJf5gVVvYg-lNw6gMdZ4zdELGo3RN8ECjqZ2BdF1FK_x2LGccmOm05VLrMT7XJbPvadWnb1ZSYC5jvdNdb1gXeaAsUPoLhIzrfH_Wd7hc5INso2_uBqG5A_PMVKi_hVAo2mJ9Rvv7WEy-PoMylHyPNxyJ3hI18z4i6P0A", alt: "Restaurantes" },
  { id: "logistica",    label: "Logística",    icon: "local_shipping",  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTqwRJwyU1P8pJ-zJPtqQPXeGeRz07HIZavpToPLkIsRt4ev_1ybbBf6KiXb5CBVgzxWz-cjg3y3y6LMfMEV_M6ICSaHtv02HOsyerv9diSk4Pe6KlR86GxcDEITg3lUZO0bLe4boFVS9m-CyeOU3LyNbbM9WmjMlKOP_aMS94HIin8WmiuotHCLlpeaRD4X1x-sz1p1eOcUM-WDcoHvdq0fvVpFAQWhwuBbli_3h6iWAsQzjMvBssIKonQnSpyeQ6nqM504bK8P8", alt: "Logística" },
  { id: "servicios",    label: "Servicios",    icon: "business_center", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGkHE9jzImGbyI8bgUFVWVAA_nBVY8CXL7IEy9ZeqRytwHdQej5vIaQovPF564JvbR2P0WWkHyeXa2HAaiCBDdRLQvq9mwwoN9cm035cVIHFnVYwXpUit5g4GK5o0HKFEGoShTwpr0IpRwk5aK6-rhcsK5n05t2KqTt5k-vpAKxDjQlHTyXtEA_L9K0jv4v7IpOSY0xqKHukDtkxncwlyzhofdInfp_ddwr1oFcnCBS4jViYxv7mvGw3oRc1yesziWcQPiCxdAM9c", alt: "Servicios" },
];

const AGENT_TYPES = [
  { id: "ventas",    icon: "trending_up", label: "Agente de Ventas",    desc: "Analiza leads, prospecta y genera reportes de oportunidades." },
  { id: "soporte",   icon: "headset_mic", label: "Agente de Soporte",   desc: "Responde preguntas frecuentes y escala tickets complejos." },
  { id: "analista",  icon: "analytics",   label: "Analista de Datos",   desc: "Procesa documentos y entrega insights accionables." },
  { id: "marketing", icon: "campaign",    label: "Agente de Marketing", desc: "Crea contenido, monitorea campañas y sugiere mejoras." },
];

const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];

const AGENT_ICONS = [
  { icon: "smart_toy", fill: true  }, { icon: "psychology",  fill: false },
  { icon: "hub",       fill: true  }, { icon: "insights",    fill: false },
  { icon: "terminal",  fill: true  }, { icon: "monitoring",  fill: false },
];

const OBJECTIVES = [
  { id: "automatizar", icon: "autorenew",   label: "Automatizar tareas repetitivas" },
  { id: "analizar",    icon: "analytics",   label: "Analizar datos y generar reportes" },
  { id: "escalar",     icon: "trending_up", label: "Escalar operaciones sin aumentar equipo" },
  { id: "soporte",     icon: "headset_mic", label: "Mejorar atención al cliente" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "bienvenido";

  const [step, setStep]                     = useState(0);
  const [industry, setIndustry]             = useState("retail");
  const [teamSize, setTeamSize]             = useState("11-50");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["ventas"]);

  const progress = [33, 66, 100][step] ?? 33;

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
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: "#fcf8fa", fontFamily: "inherit" }}>

      {/* ── Panel izquierdo branding ── */}
      <aside style={{ width: "38%", background: "linear-gradient(135deg, #0f1f3d 0%, #0058be 60%, #1a3a6e 100%)", display: "flex", flexDirection: "column", padding: "2.5rem", position: "relative", overflow: "hidden", flexShrink: 0 }}
        className="hidden md:flex">
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.02em" }}>AgentHub</span>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>Empresarial AI</p>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", maxWidth: 320 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32, animation: "float 4s ease-in-out infinite" }}>
              {AGENT_ICONS.map((a, i) => (
                <div key={i} style={{ width: 64, height: 64, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", opacity: a.fill ? 1 : 0.6 }}>
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 28, fontVariationSettings: a.fill ? "'FILL' 1" : "'FILL' 0" }}>{a.icon}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>Potencia tu Empresa con IA</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>Misiones automatizadas de alta precisión.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s", background: i < step ? "#fff" : i === step ? "#60a5fa" : "rgba(255,255,255,0.2)", border: i === step ? "2px solid #fff" : "none" }}>
                    {i < step
                      ? <span className="material-symbols-outlined" style={{ color: "#0058be", fontSize: 16 }}>check</span>
                      : <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{i + 1}</span>
                    }
                  </div>
                  <span style={{ fontSize: 14, color: i === step ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: i === step ? 700 : 400, transition: "all 0.3s" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", position: "relative", zIndex: 1 }}>
          {[{ value: "+500", label: "Empresas" }, { value: "99.9%", label: "Uptime" }, { value: "15ms", label: "Latencia" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, right: 0, width: 256, height: 256, background: "rgba(96,165,250,0.15)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", transform: "translate(30%, 30%)" }} />
      </aside>

      {/* ── Panel derecho contenido ── */}
      <main style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* Barra de progreso */}
        <div style={{ position: "sticky", top: 0, width: "100%", height: 4, background: "#f3f4f6", zIndex: 50 }}>
          <div style={{ height: "100%", background: "#0058be", transition: "width 0.7s ease-out", width: `${progress}%` }} />
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", minHeight: "calc(100% - 4px)" }}>

          {/* Pills de pasos */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 999, fontSize: 13, transition: "all 0.2s",
                  background: i === step ? "#eff6ff" : i < step ? "#f3f4f6" : "#fafafa",
                  border: `1px solid ${i === step ? "#bfdbfe" : "#e5e7eb"}`,
                  color: i === step ? "#1d4ed8" : i < step ? "#0058be" : "#9ca3af",
                  fontWeight: i === step ? 700 : 400,
                }}>
                  {i < step && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>}
                  <span>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 16, height: 1, background: "#e5e7eb" }} />}
              </div>
            ))}
          </nav>

          {/* ── STEP 0: Bienvenida + Industria ── */}
          {step === 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 999, padding: "4px 12px", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#d97706", fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#d97706", letterSpacing: "0.06em", textTransform: "uppercase" }}>Configuración inicial</span>
                </div>
                <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.02em" }}>
                  Hola {firstName}, configuremos tu equipo de agentes IA
                </h1>
                <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7 }}>
                  En 3 minutos tendrás tu primer equipo listo para ejecutar misiones.
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                  ¿En qué industria opera tu empresa?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {INDUSTRIES.map((ind) => {
                    const sel = industry === ind.id;
                    return (
                      <button key={ind.id} type="button" onClick={() => setIndustry(ind.id)}
                        style={{ position: "relative", height: 160, borderRadius: 12, overflow: "hidden", textAlign: "left", border: sel ? "2px solid #0058be" : "1px solid #e5e7eb", boxShadow: sel ? "0 0 0 4px rgba(0,88,190,0.08)" : "none", transition: "all 0.2s", cursor: "pointer", background: "transparent", padding: 0 }}>
                        <Image src={ind.src} alt={ind.alt} fill style={{ objectFit: "cover", filter: sel ? "grayscale(20%)" : "grayscale(50%)", transition: "all 0.3s" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }} />
                        {sel && <div style={{ position: "absolute", inset: 0, background: "rgba(0,88,190,0.25)" }} />}
                        {sel && (
                          <div style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, background: "#0058be", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 14 }}>check</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                          <span className="material-symbols-outlined" style={{ color: "rgba(255,255,255,0.8)", fontSize: 20 }}>{ind.icon}</span>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{ind.label}</span>
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
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 999, padding: "4px 12px", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#0284c7" }}>corporate_fare</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0284c7", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tu empresa</span>
                </div>
                <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.02em" }}>
                  Cuéntanos sobre tu empresa
                </h1>
                <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7 }}>
                  Esto nos permite configurar los agentes con los parámetros correctos.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                    ¿Cuántas personas hay en tu empresa?
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {TEAM_SIZES.map((size) => (
                      <button key={size} type="button" onClick={() => setTeamSize(size)}
                        style={{ padding: "12px 0", borderRadius: 12, border: teamSize === size ? "2px solid #0058be" : "1px solid #e5e7eb", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", background: teamSize === size ? "#0058be" : "#fff", color: teamSize === size ? "#fff" : "#6b7280" }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                    ¿Cuál es tu objetivo principal con AgentHub?
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {OBJECTIVES.map(({ id, icon, label }) => (
                      <label key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}>
                        <input type="radio" name="objetivo" value={id} defaultChecked={id === "automatizar"} style={{ accentColor: "#0058be", width: 16, height: 16 }} />
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#9ca3af" }}>{icon}</span>
                        <span style={{ fontSize: 15, color: "#374151" }}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ color: "#0058be", flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>info</span>
                  <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.6 }}>
                    Usamos esta información solo para personalizar tu experiencia. Puedes cambiarla en cualquier momento desde <strong>Configuración</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Agentes ── */}
          {step === 2 && (
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "4px 12px", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "0.06em", textTransform: "uppercase" }}>Equipo de Agentes</span>
                </div>
                <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.02em" }}>
                  Elige tus primeros agentes
                </h1>
                <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7 }}>
                  Selecciona los agentes que necesitas. Puedes agregar más después.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {AGENT_TYPES.map(({ id, icon, label, desc }) => {
                  const sel = selectedAgents.includes(id);
                  return (
                    <button key={id} type="button" onClick={() => toggleAgent(id)}
                      style={{ position: "relative", padding: "16px", borderRadius: 12, textAlign: "left", border: sel ? "2px solid #0058be" : "1px solid #e5e7eb", background: sel ? "rgba(0,88,190,0.04)" : "#fff", boxShadow: sel ? "0 0 0 4px rgba(0,88,190,0.06)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                      {sel && (
                        <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, background: "#0058be", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 13 }}>check</span>
                        </div>
                      )}
                      <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, background: sel ? "#0058be" : "#f3f4f6" }}>
                        <span className="material-symbols-outlined" style={{ color: sel ? "#fff" : "#6b7280", fontVariationSettings: sel ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{label}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
                    </button>
                  );
                })}
              </div>

              <div style={{ background: "linear-gradient(135deg, #0f1f3d, #0058be)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                    {selectedAgents.length} agente{selectedAgents.length !== 1 ? "s" : ""} seleccionado{selectedAgents.length !== 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Tu equipo estará listo al finalizar la configuración.</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Plan Trial</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Gratis 14 días</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ paddingTop: 32, paddingBottom: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            <button type="button" onClick={handleNext}
              style={{ width: "100%", height: 56, background: "#0058be", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", boxShadow: "0 4px 20px rgba(0,88,190,0.25)" }}>
              <span>{step < STEPS.length - 1 ? "Continuar" : "Ir al Dashboard"}</span>
              <span className="material-symbols-outlined">{step < STEPS.length - 1 ? "arrow_forward" : "rocket_launch"}</span>
            </button>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                ← Volver
              </button>
            )}
            <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
              ¿Necesitas ayuda?{" "}
              <a href="#" style={{ color: "#0058be", textDecoration: "none", fontWeight: 600 }}>Habla con soporte</a>
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
