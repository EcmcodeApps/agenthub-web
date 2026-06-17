"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { resetPassword } from "@/lib/firebase/auth";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  // Parallax suave en blobs de fondo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (blob1Ref.current) blob1Ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (blob2Ref.current) blob2Ref.current.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await resetPassword(email);
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("No encontramos una cuenta con ese correo.");
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">

      {/* ── Header ── */}
      <header className="bg-background flex justify-between items-center px-margin-desktop py-md w-full max-w-7xl mx-auto z-50">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          AgentHub
        </Link>
        <nav className="hidden md:flex gap-xl items-center">
          <Link href="/industrias" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Industrias</Link>
          <Link href="/precios" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Precios</Link>
          <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Recursos</a>
        </nav>
        <Link href="/login" className="text-secondary font-medium transition-opacity active:opacity-80">
          Iniciar Sesión
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow flex items-center justify-center p-margin-mobile relative">

        {/* Blobs de fondo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div ref={blob1Ref} className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed blur-[120px] transition-transform duration-300" />
          <div ref={blob2Ref} className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-primary-fixed blur-[100px] transition-transform duration-300" />
        </div>

        <div className="w-full max-w-[440px] z-10">
          {/* Card */}
          <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl shadow-sm ai-gradient-border">

            {/* Brand header */}
            <div className="text-center mb-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-container text-on-primary mb-md">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock_reset
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">
                Recuperar contraseña
              </h1>
              <p className="font-body-md text-body-md text-on-primary-container">
                Introduce tu correo y te enviaremos instrucciones para restablecerla
              </p>
            </div>

            {/* Form / Success state */}
            {status === "success" ? (
              <div className="text-center py-md">
                <div className="flex flex-col items-center gap-md">
                  <span
                    className="material-symbols-outlined text-secondary text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <h3 className="font-title-md text-title-md text-primary">Enlace enviado</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                      Revisa tu bandeja de entrada en unos instantes.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-lg" onSubmit={handleSubmit}>
                <div className="space-y-xs">
                  <label
                    htmlFor="email"
                    className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="ejemplo@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary transition-all placeholder:text-outline-variant"
                    />
                  </div>
                </div>

                {error && (
                  <div className="px-md py-sm rounded-lg bg-error-container text-on-error-container font-body-md text-body-md border border-error/20">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-md px-xl bg-secondary text-on-secondary font-title-md text-title-md rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm group disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span>Enviar enlace de recuperación</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back link */}
            <div className="mt-xl pt-lg border-t border-outline-variant text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-xs font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors group"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="mt-xl text-center px-lg">
            <p className="font-label-sm text-label-sm text-on-primary-container">
              ¿Necesitas ayuda adicional?{" "}
              <a href="#" className="text-secondary font-bold hover:underline">
                Contactar Soporte
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-background border-t border-outline-variant py-xl w-full">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="font-title-md text-title-md font-bold text-primary">AgentHub</div>
          <div className="flex gap-lg">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a key={l} href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:underline transition-all">{l}</a>
            ))}
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
          </p>
        </div>
      </footer>
    </div>
  );
}
