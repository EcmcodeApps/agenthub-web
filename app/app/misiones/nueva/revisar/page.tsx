"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/app/_components/AppSidebar";
import { apiGet } from "@/lib/api/client";

type Agent = {
  id: string;
  name: string;
  role: string;
  goal: string;
  tools: string[];
  modelRecommendation: string;
  order: number;
};

const ROLE_INITIALS: Record<string, { bg: string; text: string }> = {
  coordinator: { bg: "bg-purple-100", text: "text-purple-600" },
  analyst:     { bg: "bg-blue-100",   text: "text-blue-600" },
  data:        { bg: "bg-cyan-100",   text: "text-cyan-600" },
  reporter:    { bg: "bg-green-100",  text: "text-green-600" },
  researcher:  { bg: "bg-amber-100",  text: "text-amber-600" },
};

function getRoleStyle(role: string) {
  const k = role.toLowerCase();
  if (k.includes("coord") || k.includes("orquest")) return ROLE_INITIALS.coordinator;
  if (k.includes("anal") || k.includes("mercado")) return ROLE_INITIALS.analyst;
  if (k.includes("dato") || k.includes("data") || k.includes("gestor")) return ROLE_INITIALS.data;
  if (k.includes("report") || k.includes("predict")) return ROLE_INITIALS.reporter;
  return ROLE_INITIALS.researcher;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function RevisarPage() {
  const router = useRouter();
  const [agents, setAgents]       = useState<Agent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [launching, setLaunching] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionId, setMissionId] = useState("");

  useEffect(() => {
    const id    = sessionStorage.getItem("currentMissionId")    ?? "";
    const title = sessionStorage.getItem("currentMissionTitle") ?? "Tu misión";
    setMissionId(id);
    setMissionTitle(title);
    if (!id) { router.replace("/app/misiones/nueva"); return; }

    apiGet<Agent[]>(`/missions/${id}/agents`)
      .then(setAgents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleLaunch = async () => {
    setLaunching(true);
    sessionStorage.removeItem("currentMissionId");
    sessionStorage.removeItem("currentMissionTitle");
    // Small delay for animation feel
    await new Promise((r) => setTimeout(r, 600));
    router.push("/app/misiones");
  };

  const totalTools = agents.reduce((s, a) => s + a.tools.length, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="w-full h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-margin-desktop">
          <nav className="flex items-center gap-sm text-on-surface-variant font-body-md">
            <span>Misiones</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-bold">Nueva Misión</span>
          </nav>
          <div className="flex items-center gap-lg">
            <button className="bg-secondary text-on-secondary px-lg py-sm rounded-full font-body-md flex items-center gap-sm transition-transform active:scale-95" style={{ boxShadow: "0 0 20px rgba(0,88,190,0.15)" }}>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Optimizar con IA
            </button>
            <div className="flex items-center gap-md text-on-surface-variant">
              <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors">notifications</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors">account_circle</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-xl pb-32">
          <div className="mx-auto space-y-xl" style={{ maxWidth: "72rem" }}>

            {/* Progress */}
            <div className="flex justify-between items-center px-2xl">
              {[
                { label: "Definición", done: true },
                { label: "Selección",  done: true },
                { label: "Revisar",    done: false, active: true },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-sm flex-1 relative">
                  {i < 2 && <div className="absolute top-5 left-1/2 w-full h-[2px] bg-secondary z-0" />}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-sm ${step.done ? "bg-secondary text-white" : step.active ? "border-2 border-secondary bg-white text-secondary" : "border-2 border-outline-variant bg-white text-on-surface-variant opacity-50"}`}
                    style={step.active ? { boxShadow: "0 0 20px rgba(0,88,190,0.15)" } : {}}>
                    {step.done
                      ? <span className="material-symbols-outlined">check</span>
                      : <span className="font-body-md font-bold">{i + 1}</span>}
                  </div>
                  <span className={`font-body-md font-medium ${step.active ? "text-primary font-bold" : step.done ? "text-secondary" : "text-on-surface-variant opacity-50"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-sm">
              <h1 className="font-headline-lg text-headline-lg text-primary">Revisar tu Misión</h1>
              <div className="inline-flex items-center gap-sm text-on-surface-variant bg-surface-container-low p-sm rounded-lg">
                <span className="material-symbols-outlined text-secondary">info</span>
                <span className="font-body-md">Misión: <span className="font-bold text-primary">{missionTitle}</span></span>
              </div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">

              {/* Mission summary */}
              <section className="rounded-xl p-lg space-y-lg shadow-sm" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid #E2E8F0" }}>
                <div className="flex items-center gap-md border-b border-outline-variant pb-md">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-primary">Resumen de la Misión</h3>
                </div>
                <div className="space-y-md">
                  <div>
                    <label className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-xs">Objetivo</label>
                    <p className="font-body-md text-on-surface leading-relaxed">{missionTitle || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-xs">Sector</label>
                      <span className="bg-secondary-container/20 text-secondary px-sm py-xs rounded-full font-body-md inline-block">
                        {sessionStorage.getItem ? (sessionStorage.getItem("currentIndustry") ?? "—") : "—"}
                      </span>
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-xs">Profundidad</label>
                      <span className="font-body-md font-medium text-primary flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px] text-secondary">balance</span>
                        Balanceado
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-xs">Presupuesto</label>
                    <div className="flex items-center gap-md">
                      <span className="font-body-md text-primary">Plan créditos</span>
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: "75%" }} />
                      </div>
                      <span className="font-code-mono text-label-sm">Est. 450 cr.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Agents summary */}
              <section className="rounded-xl p-lg space-y-lg shadow-sm" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid #E2E8F0" }}>
                <div className="flex items-center justify-between border-b border-outline-variant pb-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">smart_toy</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-primary">Equipo de Agentes</h3>
                  </div>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-xs rounded-full font-label-sm">BETA AI v4.2</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8 text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                    Cargando agentes...
                  </div>
                ) : (
                  <div className="space-y-sm">
                    {agents.map((agent) => {
                      const s = getRoleStyle(agent.role);
                      return (
                        <div key={agent.id} className="flex items-center gap-md p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                          <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center ${s.text} font-bold text-sm`}>
                            {initials(agent.name)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-body-md font-bold text-primary">{agent.name}</p>
                              <span className="font-label-sm text-on-surface-variant">{agent.role}</span>
                            </div>
                            <p className="font-label-sm text-secondary">{agent.tools.length} herramientas activas</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-md border-t border-outline-variant text-center">
                  <p className="font-body-md text-on-surface-variant font-medium">
                    {agents.length} agentes · {totalTools} herramientas activas
                  </p>
                </div>
              </section>
            </div>

            {/* Warning banner */}
            <div className="rounded-xl p-lg flex gap-lg items-start" style={{ background: "#FFF8E1", border: "1px solid #FFE082" }}>
              <span className="material-symbols-outlined" style={{ color: "#F57F17" }}>warning</span>
              <div className="space-y-xs">
                <p className="font-body-md font-bold" style={{ color: "#5D4037" }}>Recordatorio de Créditos</p>
                <p className="font-body-md" style={{ color: "#795548" }}>
                  Una vez lanzada, la misión consumirá créditos de tu plan. Asegúrate de revisar el equipo y las herramientas antes de continuar.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <footer className="fixed bottom-0 left-[260px] right-0 h-24 bg-white/95 border-t border-outline-variant backdrop-blur-md flex items-center justify-between px-margin-desktop shadow-lg z-40">
          <div className="flex items-center gap-lg">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="font-body-md font-bold text-primary">Misión lista para lanzar</p>
              <p className="font-label-sm text-on-surface-variant">Todos los agentes configurados y validados</p>
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <button
              onClick={() => router.back()}
              className="px-xl py-md rounded-lg border border-outline font-body-md text-on-surface hover:bg-surface-container transition-colors active:scale-95"
            >
              ← Volver
            </button>
            <button
              onClick={handleLaunch}
              disabled={launching}
              className="px-2xl py-md rounded-lg bg-secondary text-white font-headline-md flex items-center gap-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
              style={{ boxShadow: "0 0 20px rgba(0,88,190,0.15)" }}
            >
              <span className={`material-symbols-outlined transition-transform duration-500 ${launching ? "-translate-y-3 opacity-0" : ""}`}>
                rocket_launch
              </span>
              {launching ? "Lanzando..." : "Lanzar Misión"}
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}
