"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginWithGoogle } from "@/lib/firebase/auth";
import { createOrganization } from "@/lib/firebase/organizations";
import { fsSet } from "@/lib/firebase/firestore-rest";

const INDUSTRIES = [
  { value: "fintech", label: "Fintech / Banca" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "logistics", label: "Logística / Transporte" },
  { value: "healthcare", label: "Salud / Pharma" },
  { value: "comercio", label: "Comercio minorista" },
  { value: "restaurantes", label: "Restaurantes" },
  { value: "inmobiliarias", label: "Inmobiliarias" },
  { value: "agro", label: "Agro" },
  { value: "educacion", label: "Educación" },
  { value: "other", label: "Otra" },
];

const BENEFITS = [
  {
    icon: "security",
    bg: "bg-primary-container",
    iconColor: "text-on-primary",
    title: "Seguridad de Grado Bancario",
    desc: "Encriptación de extremo a extremo y cumplimiento normativo regional.",
  },
  {
    icon: "smart_toy",
    bg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
    title: "Agentes Autónomos",
    desc: "Despliega modelos de IA optimizados para ventas, soporte y legal.",
  },
];

export default function RegistroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    empresa: "", industria: "", ciudad: "", whatsapp: "",
  });

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleGoogle = async () => {
    setError("");
    setStatus("loading");
    try {
      const credential = await loginWithGoogle();
      const uid = credential.user.uid;
      await fsSet("users", uid, {
        name: credential.user.displayName ?? "",
        email: credential.user.email ?? "",
        role: "owner",
        createdAt: new Date().toISOString(),
        googleSignIn: true,
      });
      setStatus("success");
      setTimeout(() => router.push("/onboarding"), 800);
    } catch (err: unknown) {
      setStatus("idle");
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Error Google: ${msg}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) { setError("Debes aceptar los términos de servicio."); return; }
    setError("");
    setStatus("loading");
    try {
      const credential = await registerUser(form.email, form.password, form.name);
      const uid = credential.user.uid;
      const orgId = `org_${uid}`;
      await createOrganization(orgId, {
        name: form.empresa, industryId: form.industria,
        city: form.ciudad, country: "Colombia",
        ownerId: uid, planId: "plan_emprendedor",
        status: "trial", healthScore: 100, phone: form.whatsapp,
      });
      await fsSet("users", uid, {
        organizationId: orgId, name: form.name,
        email: form.email, role: "owner",
        phone: form.whatsapp, createdAt: new Date().toISOString(),
      });
      setStatus("success");
      setTimeout(() => router.push("/onboarding"), 1000);
    } catch (err: unknown) {
      setStatus("idle");
      console.error("REGISTRO ERROR:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("email-already-in-use")) setError("Ya existe una cuenta con este correo.");
      else if (msg.includes("weak-password")) setError("La contraseña debe tener mínimo 6 caracteres.");
      else setError(`Error: ${msg}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-body-md text-on-surface"
      style={{
        backgroundColor: "#fcf8fa",
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(0,88,190,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(112,115,255,0.05) 0px, transparent 50%)",
      }}
    >
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-xl items-stretch">

          {/* ── Left: Branding ── */}
          <div className="hidden lg:flex flex-col justify-center space-y-lg pr-xl">
            <div className="space-y-sm">
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[14px] mr-1">bolt</span>
                GRATIS DURANTE TU VALIDACIÓN
              </span>
              <h1 className="font-display-xl text-display-xl text-primary leading-tight">
                Tu equipo de agentes IA,{" "}
                <span className="text-secondary">listo en minutos</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Automatiza ventas, soporte y análisis sin contratar más personal.
                Las empresas que usan AgentHub reducen costos operativos un <strong>40%</strong> en los primeros 30 días.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-md">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-md p-md rounded-xl glass-card">
                  <div className={`p-sm ${b.bg} rounded-lg`}>
                    <span
                      className={`material-symbols-outlined ${b.iconColor}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {b.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-primary">{b.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden mt-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/foto_ia.jpg"
                alt="Almacén de Electrónica Moderna con agentes IA"
                className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="glass-card p-lg md:p-xl rounded-2xl shadow-sm space-y-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-lg">
                <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
                  AgentHub
                </Link>
                <Link href="/login" className="text-secondary font-body-md hover:underline">
                  ¿Ya tienes cuenta?
                </Link>
              </div>

              <h2 className="font-headline-md text-headline-md text-primary mb-xl">
                Crear cuenta empresarial
              </h2>

              <form className="space-y-md" onSubmit={handleSubmit}>
                {/* Nombre + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">NOMBRE COMPLETO</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Rodríguez"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">CORREO CORPORATIVO</label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-outline">CONTRASEÑA</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-secondary cursor-pointer"
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </button>
                  </div>
                </div>

                {/* Empresa + Industria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">NOMBRE DE LA EMPRESA</label>
                    <input
                      type="text"
                      required
                      placeholder="Empresa S.A.S"
                      value={form.empresa}
                      onChange={(e) => set("empresa", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">INDUSTRIA</label>
                    <select
                      required
                      value={form.industria}
                      onChange={(e) => set("industria", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all appearance-none cursor-pointer input-focus-ring"
                    >
                      <option value="" disabled>Seleccionar industria</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ciudad + WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">CIUDAD</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Bogotá"
                      value={form.ciudad}
                      onChange={(e) => set("ciudad", e.target.value)}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-outline">WHATSAPP</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-md py-sm border border-r-0 border-outline-variant rounded-l-lg bg-surface-container-low text-on-surface-variant font-body-md">
                        +
                      </span>
                      <input
                        type="tel"
                        placeholder="Número de contacto"
                        value={form.whatsapp}
                        onChange={(e) => set("whatsapp", e.target.value)}
                        className="w-full px-md py-sm border border-outline-variant rounded-r-lg font-body-md text-on-surface bg-white/50 focus:border-secondary outline-none transition-all input-focus-ring"
                      />
                    </div>
                  </div>
                </div>

                {/* Google */}
                <button type="button" onClick={handleGoogle} disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded-lg py-sm font-title-md bg-white hover:bg-surface-container-low transition-all"
                  style={{ fontSize: 15 }}>
                  <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.9 2.5 30.3 0 24 0 14.7 0 6.7 5.5 2.7 13.5l7.8 6C12.4 13.2 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/><path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5l-7.8-6C1 16.5 0 20.1 0 24s1 7.5 2.7 10.5l7.8-6z"/><path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.5-5.8c-2.1 1.4-4.8 2.2-8 2.2-6.2 0-11.6-3.7-13.5-9l-7.8 6C6.7 42.5 14.7 48 24 48z"/></svg>
                  Registrarme con Google
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-outline-variant" />
                  <span className="text-sm text-on-surface-variant">o con correo</span>
                  <div className="flex-1 h-px bg-outline-variant" />
                </div>

                {/* Términos */}
                <div className="flex items-center gap-sm py-sm">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-4 h-4 text-secondary border-outline-variant rounded focus:ring-secondary"
                  />
                  <label htmlFor="terms" className="font-body-md text-body-md text-on-surface-variant">
                    Acepto los{" "}
                    <a href="#" className="text-secondary underline">términos de servicio</a>{" "}
                    y la política de privacidad.
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="text-sm px-md py-sm rounded-lg bg-error-container text-on-error-container border border-error/20">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`w-full py-md font-title-md text-title-md rounded-lg shadow-sm transition-all flex items-center justify-center gap-sm active:scale-[0.98] disabled:opacity-70
                    ${status === "success"
                      ? "bg-green-600 text-white"
                      : "bg-secondary text-on-secondary hover:brightness-110"
                    }`}
                >
                  {status === "loading" && (
                    <span className="material-symbols-outlined animate-spin">sync</span>
                  )}
                  {status === "success" && (
                    <span className="material-symbols-outlined">check_circle</span>
                  )}
                  {status === "idle" && <span className="material-symbols-outlined">arrow_forward</span>}
                  {status === "loading" ? "Procesando..." : status === "success" ? "¡Bienvenido!" : "Crear cuenta empresarial"}
                </button>
              </form>
            </div>

            <div className="mt-xl pt-lg border-t border-outline-variant flex items-center gap-md">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant italic">
                Tus datos están protegidos bajo protocolos internacionales de seguridad. No compartimos
                información con terceros sin tu consentimiento explícito.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-xl border-t border-outline-variant bg-background">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col items-center md:items-start gap-xs">
            <span className="font-title-md text-title-md font-bold text-primary">AgentHub</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
            </p>
          </div>
          <div className="flex gap-lg">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a key={l} href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
