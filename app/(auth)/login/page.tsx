"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/firebase/auth";

const STATS = [
  { value: "+500", label: "Empresas" },
  { value: "99.9%", label: "Uptime" },
  { value: "15ms", label: "Latencia" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
      router.push("/app/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex overflow-hidden">

      {/* ── Formulario ── */}
      <main style={{ width: "100%", maxWidth: "520px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem", background: "var(--color-surface, #fcf8fa)", boxShadow: "4px 0 24px rgba(0,0,0,0.06)", zIndex: 10 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 40, height: 40, background: "#0058be", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 22, fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#000", letterSpacing: "-0.02em" }}>AgentHub</span>
        </div>

        {/* Form block */}
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 999, padding: "4px 12px", marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#1d4ed8" }}>verified</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.05em" }}>PORTAL EMPRESARIAL</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
              Bienvenido de nuevo
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
              Ingresa tus credenciales para acceder a tu panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#9ca3af", pointerEvents: "none" }}>
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", paddingLeft: 44, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", background: "#fff", color: "#111827", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#0058be"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                  Contraseña
                </label>
                <Link href="/recuperar-password" style={{ fontSize: 13, color: "#0058be", fontWeight: 600, textDecoration: "none" }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#9ca3af", pointerEvents: "none" }}>
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", paddingLeft: 44, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", background: "#fff", color: "#111827", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#0058be"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: "#0058be", color: "#fff", fontWeight: 700, fontSize: 16, padding: "14px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s" }}
            >
              {loading
                ? <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite", fontSize: 20 }}>sync</span>
                : <>Entrar a mi panel <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span></>
              }
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>o accede con</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            {/* SSO / Token */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ icon: "corporate_fare", label: "SSO" }, { icon: "key", label: "Token" }].map((btn) => (
                <button key={btn.label} type="button"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "11px", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6b7280" }}>{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </form>

          {/* Registro */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280", marginTop: "1.5rem" }}>
            ¿No tienes cuenta?{" "}
            <Link href="/registro" style={{ color: "#0058be", fontWeight: 700, textDecoration: "none" }}>
              Crear cuenta gratis
            </Link>
          </p>
        </div>

        {/* Legal */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", fontSize: 12, color: "#9ca3af", borderTop: "1px solid #f3f4f6", paddingTop: "1.25rem" }}>
          <span>© 2026 AgentHub Empresarial</span>
          {["Privacidad", "Términos", "Contacto"].map((l) => (
            <a key={l} href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </main>

      {/* ── Branding derecho ── */}
      <aside className="hidden lg:flex" style={{ flex: 1, position: "relative", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(135deg, #0f1f3d 0%, #0058be 60%, #1a3a6e 100%)" }}>

        {/* Blobs decorativos */}
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 300, height: 300, background: "rgba(96,165,250,0.15)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 200, height: 200, background: "rgba(139,92,246,0.15)", borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "540px", textAlign: "center", padding: "0 2.5rem" }}>

          {/* Imagen */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", marginBottom: "2rem" }}>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWPyxZbFcOCb686GcysOIm_B7dB_zJkugWmz0CoU-jyWzpKfbbNeO8PCkjAdnoKwaN6uRl5McpQLUDfWL87mYupUY8xILaA9zkXPokHWyv_OF-nVLcD7Y1b0nvx6nlmirwekIJWKXI-gQzb3UIIRt8CujKVvLyCfi9eH1lNFpUT3NKSGVDCoKk3Y_yqo7kqlIBYKwkRP46ttxwQE0DUUjcInu2bwWbAVOpZJM3KfPyi1REFmq2KdI-MWcHKrSXSBSMoM6wq190Zqk"
              alt="Dashboard AgentHub"
              width={800}
              height={420}
              style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Copy */}
          <h3 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Tecnología avanzada con{" "}
            <span style={{ color: "#60a5fa" }}>rostro humano.</span>
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 420, margin: "0 auto 2rem" }}>
            Potenciamos la productividad de tu empresa con el ecosistema de agentes inteligentes más robusto de Latinoamérica.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Badge flotante */}
        <div style={{ position: "absolute", bottom: 32, right: 32, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "8px 16px" }}>
          <span className="material-symbols-outlined" style={{ color: "#60a5fa", fontSize: 16, fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>IA Optimizada</span>
        </div>
      </aside>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
