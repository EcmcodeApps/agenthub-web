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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      {/* ── Lado izquierdo: Formulario ── */}
      <main className="w-full lg:w-[480px] xl:w-[560px] h-screen bg-surface flex flex-col justify-between p-margin-desktop z-10 shadow-xl lg:shadow-none">

        {/* Logo */}
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary text-[32px]">smart_toy</span>
          <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
            AgentHub
          </h1>
        </div>

        {/* Form */}
        <div className="max-w-[400px] w-full mx-auto">
          <header className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-sm">
              Bienvenido de nuevo
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Ingresa tus credenciales para acceder al portal empresarial.
            </p>
          </header>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-xs group">
              <label
                htmlFor="email"
                className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-secondary transition-colors"
              >
                Correo electrónico empresarial
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-secondary transition-all placeholder:text-outline-variant font-body-md text-body-md"
                  style={{ "--tw-ring-color": "rgba(0,88,190,0.1)" } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-xs group">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-secondary transition-colors"
                >
                  Contraseña
                </label>
                <Link
                  href="/recuperar-password"
                  className="font-label-sm text-label-sm text-secondary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-secondary transition-all placeholder:text-outline-variant font-body-md text-body-md"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-md py-sm rounded-lg bg-error-container text-on-error-container font-body-md text-body-md border border-error/20">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-on-secondary font-title-md text-title-md py-md rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  Entrar a mi panel
                  <span className="material-symbols-outlined">chevron_right</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-md flex items-center">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="flex-shrink mx-md font-label-sm text-label-sm text-outline-variant">
                o accede con
              </span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            {/* SSO buttons */}
            <div className="grid grid-cols-2 gap-md">
              {[
                { icon: "corporate_fare", label: "SSO" },
                { icon: "key", label: "Token" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  className="flex items-center justify-center gap-sm border border-outline-variant bg-surface-container-lowest py-sm rounded-lg hover:bg-surface-container-low transition-colors font-body-md text-body-md"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </form>

          <footer className="mt-2xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              ¿No tienes una cuenta empresarial?{" "}
              <Link href="/registro" className="text-secondary font-bold hover:underline">
                Crear cuenta
              </Link>
            </p>
          </footer>
        </div>

        {/* Legal */}
        <div className="flex flex-wrap justify-center gap-md font-label-sm text-label-sm text-outline border-t border-outline-variant pt-lg">
          <span>© 2026 AgentHub Empresarial</span>
          {["Privacidad", "Términos", "Contacto"].map((l) => (
            <a key={l} href="#" className="hover:text-on-surface transition-colors">{l}</a>
          ))}
        </div>
      </main>

      {/* ── Lado derecho: Branding ── */}
      <aside className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-primary-container">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-container via-[#004395] to-secondary-container" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl text-center px-xl">
          <div className="mb-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 group relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWPyxZbFcOCb686GcysOIm_B7dB_zJkugWmz0CoU-jyWzpKfbbNeO8PCkjAdnoKwaN6uRl5McpQLUDfWL87mYupUY8xILaA9zkXPokHWyv_OF-nVLcD7Y1b0nvx6nlmirwekIJWKXI-gQzb3UIIRt8CujKVvLyCfi9eH1lNFpUT3NKSGVDCoKk3Y_yqo7kqlIBYKwkRP46ttxwQE0DUUjcInu2bwWbAVOpZJM3KfPyi1REFmq2KdI-MWcHKrSXSBSMoM6wq190Zqk"
              alt="Equipos de agentes IA trabajando"
              width={800}
              height={450}
              className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent" />
          </div>

          <div className="space-y-md">
            <h3 className="font-display-xl text-display-xl text-on-primary-container leading-tight">
              Tecnología avanzada con{" "}
              <span className="text-on-secondary">rostro humano.</span>
            </h3>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 max-w-lg mx-auto">
              Potenciamos la productividad de tu empresa con el ecosistema de agentes inteligentes
              más robusto de Latinoamérica.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-xl pt-lg">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-xl">
                  <div className="text-center">
                    <div className="font-headline-md text-headline-md text-on-primary-fixed">{s.value}</div>
                    <div className="font-label-sm text-label-sm text-on-primary-container/60">{s.label}</div>
                  </div>
                  {i < STATS.length - 1 && <div className="w-px h-12 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-10 right-10 flex items-center gap-sm bg-white/5 backdrop-blur-md px-md py-sm rounded-full border border-white/10 animate-bounce">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="font-label-sm text-label-sm text-on-primary-container">IA Optimizada</span>
        </div>
      </aside>
    </div>
  );
}
