"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/app/_components/AppSidebar";
import { apiPost } from "@/lib/api/client";

const DEPTH_OPTIONS = [
  { value: "rapido",      label: "Rápido",      desc: "Análisis superficial para decisiones inmediatas.",     icon: "bolt" },
  { value: "balanceado",  label: "Balanceado",  desc: "El equilibrio perfecto entre tiempo y detalle.",       icon: "balance" },
  { value: "estrategico", label: "Estratégico", desc: "Extracción profunda, múltiples modelos de IA.",        icon: "psychology" },
];

const INITIAL_FILES = [
  { id: "inventario", name: "Inventario_Q3.csv",        size: "2.4 MB • CSV",   icon: "description",   selected: true  },
  { id: "ventas",     name: "Ventas_Histórico.xlsx",    size: "15.8 MB • Excel", icon: "table_view",    selected: false },
  { id: "estrategia", name: "Estrategia_2024.pdf",       size: "1.2 MB • PDF",  icon: "picture_as_pdf", selected: false },
];

const INITIAL_INDUSTRIES = [
  { id: "retail",     label: "Retail",      icon: "shopping_bag",    selected: false,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm7w8kOzmoZ4kTJe4DA6qY5HjZxcscd-E8-jTTXKfMdA_4mX6mUBBWUC7x9HSRonZHWU43gY6zLoHsGfLgKF-5ybGYsNT5L_WfmzKlhKYr9SzxKlff6srzFWpCaOG2ewcM34uu2lhnxHDu39DYqiwSVyMsyAtpdwz7qvH4rLzL7kt1_MMklFILBIGtU-WLUmqLM2OtNvans_cjVtAGGQ8aHEtFAzyRc_wf_Dh1L3gBvMfRRN1rxfGvisX26MhOYsunZjTUTf-Ro7I" },
  { id: "industrial", label: "Industrial",  icon: "factory",         selected: false,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOqbdes3KMF5sveHdsbrT6MFG3bfK_oPwQwrgvfnG9jbQ680_QCwCabzWoz2SmqkhvWEpmgyH-U0jbGjhAUwEu6yInDM60xiTsUNTzhLRE2D8kprWiWb1vLimaZaCH4m1HA2iBaeyVhoTQUVg5sLekym6Q70IJqZMAGOSU5TJjcG4pxUlprW7Xz7qbpPeNc_k5p1CRMaWaeWk8ztGt92DRWpTwhSSgXnBvsTV7o1afMtO-BS8k6SRvUluGDLHN83mnwgNAaxSoiZA" },
  { id: "servicios",  label: "Servicios",   icon: "account_balance", selected: true,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr8HB_CnbIFMbyAUSVHmFrQE9w7mW1Rj5nxO9JJBHw_BX0Ak3ht3X7JhxFm4F3UfylfC7EHSLtcYOXJJhfnYVlmwnRzQL8Wjj7OGEynTb7rfHTnl37B6r7GU6AX7nJPthNJjQrjezLEupBq_ccD6Wt6i6G5jEeBVUIHZtzdOqgIPO27WX6-KNoziY-inf4kh42kKDVxOZDbtvXQvrDr_oYdA5zyf8tEsSNzajAaJP9ONr5V1OrjPIvLpRWOD3GgrnFPHXT_J9Rnx4" },
  { id: "tecnologia", label: "Tecnología",  icon: "memory",          selected: false,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuClj0ocMShcFg2GmmKTEpa2N1qvDOX8LzyVjtTTefQH8l5AU_2IlBfa48N41eizmoE-FhatvVkwKE-J7swcB-QAe6o-o-sxYrqH8L5M959_nNveaDGuCUHY4o1C8L5YnIbf9Vo9ZFvmnK8JImKKESqbSGUOCaZR_J5HjoaX3ZzVbZivnai3iwYBy5COCcIfFTpcfEw7EG33ZZ1m_T2E-HDUbjuM6ZmPRUGlGhfQ9uS2-JBa0FTQajoVdorhIoz8OzujXrt_9vjJa60" },
];

const STEPS = [
  { n: 1, label: "Configuración" },
  { n: 2, label: "Equipo" },
  { n: 3, label: "Ejecución" },
];

const DEPTH_MAP: Record<string, string> = {
  rapido: "fast", balanceado: "balanced", estrategico: "deep",
};

export default function NuevaMisionPage() {
  const router = useRouter();
  const [goal,       setGoal]       = useState("");
  const [context,    setContext]    = useState("");
  const [depth,      setDepth]      = useState("balanceado");
  const [files,      setFiles]      = useState(INITIAL_FILES);
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const toggleFile     = (id: string) => setFiles(prev => prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  const selectIndustry = (id: string) => setIndustries(prev => prev.map(i => ({ ...i, selected: i.id === id })));

  const handleNext = async () => {
    if (!goal.trim() || goal.trim().length < 10) {
      setError("Describe tu objetivo con al menos 10 caracteres."); return;
    }
    const industry = industries.find(i => i.selected);
    if (!industry) { setError("Selecciona un sector industrial."); return; }
    setError(""); setLoading(true);
    try {
      const mission = await apiPost<{ id: string }>("/missions", {
        title: goal.slice(0, 100),
        industryId: industry.id,
        objective: goal,
        context: context || undefined,
        depth: DEPTH_MAP[depth] ?? "balanced",
        budgetMode: "plan_credits",
        selectedDocumentIds: files.filter(f => f.selected).map(f => f.id),
      });
      sessionStorage.setItem("currentMissionId", mission.id);
      router.push("/app/misiones/nueva/equipo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la misión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex">
      <AppSidebar />

      <main className="ml-[260px] flex-1 min-h-screen flex flex-col">

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-margin-desktop bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-40">
          <div className="flex items-center gap-md">
            <Link href="/app/misiones" className="p-xs hover:bg-surface-variant rounded-full transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h2 className="font-headline-md text-headline-md text-primary">Crear nueva misión</h2>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm bg-surface-container px-md py-xs rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-label-sm text-label-sm">Monitor de Créditos: 84%</span>
            </div>
          </div>
        </header>

        {/* Stepper */}
        <section className="bg-surface-container-lowest px-margin-desktop py-lg border-b border-outline-variant/20">
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center" }}>
            {STEPS.map((step, idx) => (
              <div key={step.n} style={{ flex: idx < STEPS.length - 1 ? 1 : undefined, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 700, zIndex: 1,
                  background: step.n === 1 ? "var(--color-secondary, #0058be)" : "var(--color-surface-variant, #e4e2e4)",
                  color: step.n === 1 ? "#fff" : "var(--color-on-surface-variant, #45464d)",
                }}>
                  {step.n}
                </div>
                <span style={{
                  marginTop: 8, fontSize: 14, fontWeight: step.n === 1 ? 600 : 400,
                  color: step.n === 1 ? "var(--color-secondary, #0058be)" : "var(--color-outline, #76777d)",
                }}>
                  {step.label}
                </span>
                {idx < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 20, left: "50%", width: "100%", height: 2, background: "var(--color-outline-variant, #c6c6cd)", zIndex: 0 }} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="flex-1 p-margin-desktop bg-surface">
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "7fr 5fr", gap: "1.5rem" }}>

            {/* ── Left column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Goal */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <label className="block font-title-md text-title-md text-primary mb-md">
                  ¿Qué quieres lograr?
                </label>
                <div style={{ position: "relative" }}>
                  <span className="material-symbols-outlined" style={{ position: "absolute", left: "1rem", top: "1rem", color: "var(--color-outline,#76777d)" }}>
                    auto_awesome
                  </span>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Ej. Detectar productos de baja rotación en el almacén central y sugerir estrategias de liquidación."
                    className="w-full bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none resize-none font-body-md text-body-md transition-all"
                    style={{ paddingLeft: "3rem", paddingRight: "1rem", paddingTop: "1rem", paddingBottom: "1rem", minHeight: "120px" }}
                  />
                </div>
                <p className="mt-sm font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Define tu objetivo principal. Nuestra IA seleccionará las mejores herramientas para ti.
                </p>
              </div>

              {/* Context */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <label className="block font-title-md text-title-md text-primary mb-md">
                  Contexto del negocio
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe brevemente las reglas, limitaciones o información relevante que el agente debe considerar..."
                  className="w-full px-md py-md bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none resize-none font-body-md text-body-md transition-all"
                  style={{ minHeight: "100px" }}
                />
              </div>

              {/* Data Sources */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex justify-between items-center mb-md">
                  <span className="font-title-md text-title-md text-primary">Fuentes de datos</span>
                  <button className="text-secondary font-label-sm text-label-sm flex items-center gap-xs hover:underline transition-all">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    Subir nuevo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => toggleFile(file.id)}
                      className={`flex items-center gap-md p-md border rounded-lg cursor-pointer text-left transition-all ${
                        file.selected ? "border-secondary bg-secondary-fixed/30" : "border-outline-variant hover:border-secondary"
                      }`}
                    >
                      <span className={`material-symbols-outlined ${file.selected ? "text-secondary" : "text-outline"}`}>
                        {file.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md text-body-md font-medium text-primary truncate">{file.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{file.size}</p>
                      </div>
                      {file.selected
                        ? <span className="material-symbols-outlined text-secondary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        : <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex-shrink-0" />
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Depth */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <label className="block font-title-md text-title-md text-primary mb-md">
                  Nivel de profundidad
                </label>
                <div className="space-y-sm">
                  {DEPTH_OPTIONS.map((opt) => {
                    const active = depth === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-md p-md rounded-lg cursor-pointer transition-all group ${
                          active ? "border-2 border-secondary bg-secondary-fixed/10" : "border border-outline-variant hover:bg-surface-container"
                        }`}
                      >
                        <input
                          type="radio"
                          name="depth"
                          value={opt.value}
                          checked={active}
                          onChange={() => setDepth(opt.value)}
                          className="w-4 h-4 text-secondary focus:ring-secondary"
                        />
                        <div className="flex-1">
                          <p className="font-body-md text-body-md font-bold text-primary">{opt.label}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{opt.desc}</p>
                        </div>
                        <span className={`material-symbols-outlined transition-colors ${active ? "text-secondary" : "text-outline group-hover:text-secondary"}`}>
                          {opt.icon}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Industry */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <label className="block font-title-md text-title-md text-primary mb-md">
                  Sector Industrial
                </label>
                <div className="grid grid-cols-2 gap-md">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => selectIndustry(ind.id)}
                      className={`group relative overflow-hidden rounded-lg border transition-all cursor-pointer ${
                        ind.selected ? "border-2 border-secondary" : "border border-outline-variant hover:border-secondary"
                      }`}
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <div className={`absolute inset-0 z-10 transition-colors ${ind.selected ? "bg-secondary/30" : "bg-primary/20 group-hover:bg-primary/10"}`} />
                      <Image
                        src={ind.src}
                        alt={ind.label}
                        fill
                        className={`object-cover transition-transform duration-500 ${!ind.selected ? "group-hover:scale-110" : ""}`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-md z-20 text-white">
                        {ind.selected ? (
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="material-symbols-outlined block mb-xs">{ind.icon}</span>
                              <p className="font-title-md text-title-md font-bold">{ind.label}</p>
                            </div>
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          </div>
                        ) : (
                          <>
                            <span className="material-symbols-outlined block mb-xs">{ind.icon}</span>
                            <p className="font-title-md text-title-md font-bold">{ind.label}</p>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-24 bg-surface-container-lowest border-t border-outline-variant px-margin-desktop flex items-center justify-between sticky bottom-0 z-40">
          <div className="flex items-center gap-md">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Progreso: <span className="font-bold text-primary">33%</span> completado
            </p>
            <div style={{ width: 192, height: 8, background: "var(--color-surface-variant,#e4e2e4)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: "33%", height: "100%", background: "var(--color-secondary,#0058be)", transition: "width 0.5s" }} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-xs">
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>{error}
              </p>
            )}
            <div className="flex items-center gap-md">
              <button type="button" className="px-xl py-md font-title-md text-title-md text-secondary hover:bg-surface-container rounded-lg transition-colors border border-transparent">
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-2xl py-md font-title-md text-title-md bg-secondary text-on-secondary rounded-lg hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center gap-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><span className="material-symbols-outlined animate-spin">sync</span>Creando misión...</>
                  : <>Siguiente: Equipo<span className="material-symbols-outlined">arrow_forward</span></>
                }
              </button>
            </div>
          </div>
        </footer>

      </main>

      {/* Floating AI button */}
      <button
        type="button"
        className="fixed z-50 flex items-center gap-md shadow-lg hover:scale-105 transition-transform"
        style={{
          bottom: "2.5rem", right: "2.5rem",
          padding: "1rem 1.25rem",
          background: "#fff",
          borderRadius: "999px",
          border: "2px solid transparent",
          backgroundImage: "linear-gradient(white,white), linear-gradient(to right,#4f46e5,#06b6d4)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", background: "linear-gradient(to right,#4f46e5,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          auto_fix_high
        </span>
        <span className="font-title-md text-title-md text-primary">Optimizar con Agente</span>
      </button>
    </div>
  );
}
