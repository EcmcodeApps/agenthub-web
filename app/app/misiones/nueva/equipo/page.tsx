"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/app/_components/AppSidebar";
import { apiPost } from "@/lib/api/client";

type Agent = {
  id: string;
  name: string;
  role: string;
  goal: string;
  tools: string[];
  modelRecommendation: string;
  status: string;
  order: number;
  outputType: string;
};

const ROLE_STYLE: Record<string, { bg: string; text: string; border: string; bar: string; icon: string; avatarBg: string }> = {
  default: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", bar: "bg-purple-500", icon: "architecture", avatarBg: "bg-purple-500" },
  coordinator: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", bar: "bg-purple-500", icon: "architecture", avatarBg: "bg-purple-500" },
  analyst: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", bar: "bg-blue-500", icon: "insights", avatarBg: "bg-blue-500" },
  data: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", bar: "bg-cyan-500", icon: "database", avatarBg: "bg-cyan-500" },
  reporter: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", bar: "bg-emerald-500", icon: "query_stats", avatarBg: "bg-emerald-500" },
  researcher: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", bar: "bg-amber-500", icon: "travel_explore", avatarBg: "bg-amber-500" },
};

function getRoleStyle(role: string) {
  const key = role.toLowerCase();
  if (key.includes("coord") || key.includes("orquest")) return ROLE_STYLE.coordinator;
  if (key.includes("anal") || key.includes("mercado") || key.includes("market")) return ROLE_STYLE.analyst;
  if (key.includes("dato") || key.includes("data") || key.includes("gestor")) return ROLE_STYLE.data;
  if (key.includes("report") || key.includes("predict") || key.includes("tend")) return ROLE_STYLE.reporter;
  if (key.includes("invest") || key.includes("search") || key.includes("web")) return ROLE_STYLE.researcher;
  return ROLE_STYLE.default;
}

export default function EquipoPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");
  const [missionTitle, setMissionTitle] = useState("Tu misión");

  useEffect(() => {
    const missionId = sessionStorage.getItem("currentMissionId");
    const title = sessionStorage.getItem("currentMissionTitle");
    if (title) setMissionTitle(title);
    if (!missionId) { router.replace("/app/misiones/nueva"); return; }

    apiPost<Agent[]>(`/missions/${missionId}/generate-agents`, {})
      .then((data) => {
        setAgents(data);
        setSelected(new Set(data.map((a) => a.id)));
      })
      .catch(() => setError("No se pudo generar el equipo. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, [router]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNext = async () => {
    const missionId = sessionStorage.getItem("currentMissionId");
    if (!missionId) return;
    setApproving(true);
    try {
      await apiPost(`/missions/${missionId}/approve-agents`, {});
      router.push("/app/misiones/nueva/revisar");
    } catch {
      setError("Error al aprobar el equipo.");
    } finally {
      setApproving(false);
    }
  };

  const selectedAgents = agents.filter((a) => selected.has(a.id));

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[260px] min-h-screen flex flex-col relative pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 w-full bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-gutter">
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm uppercase tracking-tighter">
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span className="font-bold">Nueva Misión</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-on-surface-variant font-title-md">
              <a className="hover:text-secondary transition-colors" href="#">Reportes</a>
              <a className="hover:text-secondary transition-colors" href="#">Créditos</a>
            </div>
            <button className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-label-sm hover:brightness-110 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Optimizar con IA
            </button>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface cursor-pointer hover:text-secondary transition-colors">notifications</span>
              <span className="material-symbols-outlined text-on-surface cursor-pointer hover:text-secondary transition-colors">account_circle</span>
            </div>
          </div>
        </header>

        {/* Progress */}
        <section className="mx-auto w-full px-gutter mt-10" style={{ maxWidth: "72rem" }}>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-outline-variant -z-10" />
            <div className="flex flex-col items-center gap-2 bg-surface px-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="font-label-sm text-on-surface-variant font-bold">1. Configuración</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-surface px-4">
              <div className="w-10 h-10 rounded-full border-2 border-secondary bg-surface text-secondary flex items-center justify-center font-bold ring-4 ring-secondary/10">2</div>
              <span className="font-label-sm text-secondary font-extrabold">2. Equipo</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-surface px-4">
              <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant opacity-50 flex items-center justify-center font-bold">3</div>
              <span className="font-label-sm text-on-surface-variant opacity-50">3. Revisar</span>
            </div>
          </div>
        </section>

        {/* Title */}
        <section className="mx-auto w-full px-gutter mt-12 mb-8" style={{ maxWidth: "72rem" }}>
          <h2 className="font-headline-lg text-headline-lg text-primary">Configura tu Equipo</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-secondary text-[20px]">assignment</span>
            <p className="font-title-md text-on-surface-variant">
              Misión: <span className="font-bold text-on-surface">{missionTitle}</span>
            </p>
          </div>
        </section>

        {/* Agent Grid */}
        <section className="mx-auto w-full px-gutter grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: "72rem" }}>
          {loading && (
            <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] animate-spin text-secondary">sync</span>
              <p className="font-title-md">Generando equipo de agentes IA...</p>
            </div>
          )}
          {error && (
            <div className="col-span-2 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
          {!loading && agents.map((agent) => {
            const s = getRoleStyle(agent.role);
            const isOn = selected.has(agent.id);
            return (
              <div
                key={agent.id}
                className={`rounded-xl p-lg flex flex-col gap-4 hover:shadow-xl transition-all relative overflow-hidden border ${isOn ? "bg-white/80 backdrop-blur-sm border-outline-variant/50 shadow-sm" : "bg-surface-container-low border-outline-variant opacity-40"}`}
                style={isOn ? { boxShadow: "0 0 15px -3px rgba(0,88,190,0.1)" } : {}}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${s.bar}`} />
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${s.bg} ${s.text}`}>
                      <span className="material-symbols-outlined text-[32px]">{s.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-title-md text-primary font-bold">{agent.name}</h3>
                        <span className={`${s.bg} ${s.text} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${s.border}`}>
                          {agent.role}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-body-md mt-1">{agent.goal}</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggle(agent.id)}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full transition-colors duration-200 ${isOn ? "bg-secondary" : "bg-outline-variant"}`}
                    aria-label="toggle agent"
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isOn ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-sm text-on-surface-variant">{agent.modelRecommendation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-code-mono text-code-mono font-bold text-secondary">{agent.tools.length}</span>
                    <span className="font-label-sm text-on-surface-variant opacity-70">herramientas</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Add agent placeholder */}
        {!loading && (
          <section className="mx-auto w-full px-gutter mt-8" style={{ maxWidth: "72rem" }}>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center gap-3 text-on-surface-variant opacity-60 hover:opacity-100 hover:border-secondary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[40px]">person_add</span>
              <p className="font-title-md">¿Necesitas un especialista personalizado?</p>
              <span className="text-secondary font-bold text-label-sm uppercase tracking-widest">Contratar Agente Externo</span>
            </div>
          </section>
        )}

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-[260px] right-0 bg-surface-container-lowest border-t border-outline-variant py-4 px-gutter flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {selectedAgents.slice(0, 4).map((a) => {
                  const s = getRoleStyle(a.role);
                  return (
                    <div key={a.id} className={`w-8 h-8 rounded-full border-2 border-white ${s.avatarBg} flex items-center justify-center text-white`}>
                      <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                    </div>
                  );
                })}
              </div>
              <span className="font-body-md text-on-surface font-semibold">{selected.size} agente{selected.size !== 1 ? "s" : ""} seleccionado{selected.size !== 1 ? "s" : ""}</span>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase text-[10px] tracking-widest">Herramientas activas</span>
              <span className="font-code-mono text-primary font-bold">
                {selectedAgents.reduce((sum, a) => sum + a.tools.length, 0)} <span className="font-normal opacity-50">en total</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-outline text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Volver
            </button>
            <button
              onClick={handleNext}
              disabled={approving || selected.size === 0}
              className="px-6 py-2 bg-secondary text-on-secondary font-bold rounded-lg hover:brightness-110 shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 0 15px -3px rgba(0,88,190,0.1)" }}
            >
              {approving ? (
                <><span className="material-symbols-outlined animate-spin">sync</span>Aprobando...</>
              ) : (
                <>Siguiente: Revisar equipo <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
