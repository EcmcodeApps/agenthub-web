"use client";

import Link from "next/link";

const W = {
  page:  { maxWidth: "1280px", margin: "0 auto" } as React.CSSProperties,
  prose: { maxWidth: "680px",  margin: "0 auto" } as React.CSSProperties,
  hero:  { maxWidth: "860px",  margin: "0 auto" } as React.CSSProperties,
  dash:  { maxWidth: "900px",  margin: "0 auto" } as React.CSSProperties,
  cards: { maxWidth: "960px",  margin: "0 auto" } as React.CSSProperties,
};

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900" style={{ overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-100" style={{ backdropFilter: "blur(12px)" }}>
        <div style={{ ...W.page, padding: "0 24px" }}>
          <div className="flex justify-between items-center" style={{ height: "64px" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
              <span className="font-bold text-xl">AgentHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8" style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>
              <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
              <a href="#industrias"    className="hover:text-blue-600 transition-colors">Industrias</a>
              <a href="#precios"       className="hover:text-blue-600 transition-colors">Precios</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login"    style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }} className="hover:text-blue-600 transition-colors">Iniciar sesión</Link>
              <Link href="/registro" style={{ fontSize: "14px", fontWeight: 700, background: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: "8px" }} className="hover:opacity-90 transition-opacity">
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", background: "linear-gradient(160deg,#f0f4ff 0%,#ffffff 55%,#f5f0ff 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 60, left: "20%", width: 400, height: 400, background: "rgba(147,197,253,0.3)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 20, right: "15%", width: 320, height: 320, background: "rgba(196,181,253,0.3)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ ...W.page, padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* Copy centrado */}
          <div className="text-center" style={{ marginBottom: "64px" }}>
            <span className="inline-flex items-center gap-2" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: "11px", fontWeight: 700, padding: "6px 14px", borderRadius: "999px", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span>
              INTELIGENCIA ARTIFICIAL PARA EMPRESAS
            </span>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, color: "#111827", marginBottom: "24px", ...W.hero }}>
              Tu equipo de agentes IA,{" "}
              <span style={{ color: "#2563eb" }}>listo en minutos</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#6b7280", lineHeight: 1.7, marginBottom: "40px", ...W.prose }}>
              Crea misiones, sube tus documentos y deja que agentes especializados analicen tus ventas,
              inventario y competencia — entregándote reportes accionables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ marginBottom: "16px" }}>
              <Link href="/registro" style={{ background: "#2563eb", color: "#fff", fontWeight: 700, padding: "16px 32px", borderRadius: "12px", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }} className="hover:opacity-90 transition-all">
                Crear mi primera misión
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>rocket_launch</span>
              </Link>
              <button style={{ background: "#fff", border: "2px solid #e5e7eb", color: "#374151", fontWeight: 600, padding: "16px 32px", borderRadius: "12px", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }} className="hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#2563eb" }}>play_circle</span>
                Ver demo
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>Sin tarjeta de crédito · 1,000 créditos gratis</p>
          </div>

          {/* Dashboard preview */}
          <div style={{ ...W.dash, position: "relative" }}>
            <div style={{ background: "#111827", borderRadius: "16px", border: "1px solid #374151", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
              {/* Window bar */}
              <div style={{ background: "#1f2937", borderBottom: "1px solid #374151", padding: "12px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ marginLeft: 16, fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>AgentHub · Dashboard</span>
              </div>
              <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {/* Agente ventas */}
                <div style={{ background: "#1f2937", borderRadius: "12px", padding: "16px", border: "1px solid #374151" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: 36, height: 36, background: "rgba(59,130,246,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ color: "#60a5fa", fontSize: "18px" }}>trending_up</span>
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Agente Ventas</p>
                      <p style={{ color: "#34d399", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} /> Activo
                      </p>
                    </div>
                  </div>
                  <div style={{ height: 4, background: "#374151", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: "75%", height: "100%", background: "#3b82f6", borderRadius: 4 }} />
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "6px" }}>Tokens: 1,240 / 5,000</p>
                </div>
                {/* Agente inventario */}
                <div style={{ background: "#1f2937", borderRadius: "12px", padding: "16px", border: "1px solid #374151" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: 36, height: 36, background: "rgba(139,92,246,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ color: "#a78bfa", fontSize: "18px" }}>inventory_2</span>
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Inventario AI</p>
                      <p style={{ color: "#fbbf24", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /> Analizando
                      </p>
                    </div>
                  </div>
                  <div style={{ height: 4, background: "#374151", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: "52%", height: "100%", background: "#8b5cf6", borderRadius: 4 }} />
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "6px" }}>Análisis: 52% completado</p>
                </div>
                {/* Misión activa */}
                <div style={{ background: "#2563eb", borderRadius: "12px", padding: "16px" }}>
                  <p style={{ color: "#bfdbfe", fontSize: "10px", fontWeight: 700, marginBottom: "4px", letterSpacing: "0.05em" }}>MISIÓN ACTIVA</p>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "13px", lineHeight: 1.4, marginBottom: "12px" }}>Optimización Stock Navidad</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ background: "#10b981", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>EN PROGRESO</span>
                    <span style={{ color: "#bfdbfe", fontSize: "11px" }}>4 CSV</span>
                  </div>
                </div>
              </div>
              {/* Stats bottom */}
              <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[{ label: "Reportes generados", val: "12" }, { label: "Créditos usados", val: "340" }, { label: "Ahorro estimado", val: "$1,200" }].map((s) => (
                  <div key={s.label} style={{ background: "#1f2937", borderRadius: "10px", padding: "12px", border: "1px solid #374151" }}>
                    <p style={{ color: "#6b7280", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)", width: "60%", height: 40, background: "rgba(96,165,250,0.2)", filter: "blur(20px)", borderRadius: "50%", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* ── VALOR ── */}
      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={W.page}>
          <div className="text-center" style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#111827", marginBottom: "16px" }}>
              ¿Qué puede hacer un equipo de agentes IA<br />por tu negocio?
            </h2>
            <p style={{ fontSize: "18px", color: "#6b7280", lineHeight: 1.7, ...W.prose }}>
              A diferencia de un chatbot genérico, AgentHub despliega agentes especializados que trabajan en paralelo para resolver problemas complejos.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", ...W.cards }}>
            {[
              { icon: "groups_3",                bg: "#eff6ff", color: "#2563eb", title: "Especialización de Rol",  desc: "Cada agente tiene una directiva clara: análisis financiero, redacción creativa o minería de datos de competencia." },
              { icon: "precision_manufacturing", bg: "#f5f3ff", color: "#7c3aed", title: "Acciones Autónomas",      desc: "No solo responden preguntas; ejecutan misiones completas como crear catálogos, sugerir precios o detectar fugas de inventario." },
              { icon: "analytics",               bg: "#f0fdf4", color: "#16a34a", title: "Reportes Ejecutivos",     desc: "Traducen miles de filas de datos en presentaciones claras y recomendaciones accionables para tu próxima reunión." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "32px" }} className="hover:shadow-lg hover:border-blue-200 transition-all group">
                <div style={{ width: 56, height: 56, background: item.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }} className="group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#111827", marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "15px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIAS ── */}
      <section id="industrias" style={{ padding: "96px 24px", background: "#f9fafb" }}>
        <div style={W.page}>
          <h2 className="text-center" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#111827", marginBottom: "12px" }}>Elige tu industria</h2>
          <p className="text-center" style={{ fontSize: "16px", color: "#6b7280", marginBottom: "48px", ...W.prose }}>Agentes preentrenados con el conocimiento específico de tu sector.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[
              { icon: "storefront",        label: "Comercio" },
              { icon: "restaurant",        label: "Restaurantes" },
              { icon: "real_estate_agent", label: "Inmobiliarias" },
              { icon: "medical_services",  label: "Salud" },
              { icon: "agriculture",       label: "Agro" },
              { icon: "school",            label: "Educación" },
              { icon: "flight",            label: "Turismo" },
              { icon: "factory",           label: "Industria" },
              { icon: "corporate_fare",    label: "Organizaciones" },
              { icon: "business_center",   label: "Servicios prof." },
            ].map((ind) => (
              <div key={ind.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", cursor: "pointer" }} className="hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all group">
                <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#9ca3af", fontVariationSettings: "'FILL' 1" }} >{ind.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", textAlign: "center" }}>{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: "96px 24px", background: "linear-gradient(135deg,#1e3a5f 0%,#1a1a2e 60%,#2d1b69 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 40, left: "25%", width: 256, height: 256, background: "rgba(59,130,246,0.1)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 40, right: "20%", width: 256, height: 256, background: "rgba(139,92,246,0.1)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ ...W.page, position: "relative", zIndex: 1 }}>
          <h2 className="text-center" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Proceso simple y potente</h2>
          <p className="text-center" style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", marginBottom: "64px", ...W.prose }}>Tres pasos para transformar tus datos en decisiones de negocio.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", ...W.cards }}>
            {[
              { step: "01", icon: "upload_file", title: "Sube documentos",       desc: "PDFs, Excel, facturas o CSVs. La IA procesa todo en segundos sin configuración." },
              { step: "02", icon: "smart_toy",   title: "Los agentes trabajan",  desc: "Analizan, cruzan datos y detectan patrones que un humano tardaría días en encontrar." },
              { step: "03", icon: "insights",    title: "Recibe reportes",       desc: "Gráficos, alertas y recomendaciones listas para presentar a tu equipo directivo." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
                <div style={{ width: 88, height: 88, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#fff", fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{item.step}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={W.page}>
          <div className="text-center" style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#111827", marginBottom: "10px" }}>Planes para cada necesidad</h2>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>Desde pequeños comercios hasta industrias masivas.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", ...W.cards }}>
            {/* Básico */}
            <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Comercio Local</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: "28px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#111827", lineHeight: 1 }}>$29</span>
                <span style={{ color: "#9ca3af", marginBottom: "8px" }}>/mes</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", flex: 1 }}>
                {["2 Agentes IA", "5 Misiones mensuales", "Análisis de Inventario"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4b5563", fontSize: "15px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: "18px" }}>check_circle</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/registro" style={{ display: "block", textAlign: "center", border: "2px solid #2563eb", color: "#2563eb", fontWeight: 700, padding: "14px", borderRadius: "12px", fontSize: "15px" }} className="hover:bg-blue-50 transition-colors">
                Elegir Plan
              </Link>
            </div>

            {/* Pro */}
            <div style={{ borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column", position: "relative", background: "linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)", boxShadow: "0 20px 60px rgba(37,99,235,0.35)" }}>
              <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", background: "#fbbf24", color: "#78350f", fontSize: "11px", fontWeight: 800, padding: "6px 16px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                ⭐ MÁS POPULAR
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#bfdbfe", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Empresa</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: "28px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>$99</span>
                <span style={{ color: "#bfdbfe", marginBottom: "8px" }}>/mes</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", flex: 1 }}>
                {["10 Agentes IA", "Misiones ilimitadas", "Análisis de Competencia", "Soporte Prioritario"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", fontSize: "15px", fontWeight: 500 }}>
                    <span className="material-symbols-outlined" style={{ color: "#fbbf24", fontSize: "18px" }}>check_circle</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/registro" style={{ display: "block", textAlign: "center", background: "#fff", color: "#2563eb", fontWeight: 700, padding: "14px", borderRadius: "12px", fontSize: "15px" }} className="hover:bg-blue-50 transition-colors">
                Elegir Plan
              </Link>
            </div>

            {/* Enterprise */}
            <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Industrial</p>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#111827", lineHeight: 1 }}>Custom</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", flex: 1 }}>
                {["Agentes Personalizados", "Integración API Directa", "Infraestructura Dedicada"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4b5563", fontSize: "15px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: "18px" }}>check_circle</span>{f}
                  </li>
                ))}
              </ul>
              <button style={{ display: "block", width: "100%", border: "2px solid #e5e7eb", color: "#374151", fontWeight: 700, padding: "14px", borderRadius: "12px", fontSize: "15px", background: "#fff" }} className="hover:bg-gray-50 transition-colors">
                Hablar con Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "96px 24px", background: "#f9fafb" }}>
        <div style={{ textAlign: "center", ...W.prose }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#111827", marginBottom: "14px" }}>Empieza hoy, gratis</h2>
          <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "36px" }}>Sin tarjeta de crédito. 1,000 créditos para usar como quieras.</p>
          <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#2563eb", color: "#fff", fontWeight: 700, padding: "18px 40px", borderRadius: "14px", fontSize: "18px" }} className="hover:opacity-90 transition-all">
            Crear cuenta gratis
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111827", padding: "48px 24px" }}>
        <div style={{ ...W.page, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 28, height: 28, background: "#2563eb", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>hub</span>
            </div>
            <span style={{ fontWeight: 700, color: "#fff" }}>AgentHub</span>
            <span style={{ fontSize: "13px", color: "#6b7280", marginLeft: "8px" }}>© 2026 · Tecnología con Rostro Humano</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a key={l} href="#" style={{ fontSize: "14px", color: "#6b7280" }} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
