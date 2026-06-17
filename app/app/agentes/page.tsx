"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/app/_components/AppSidebar";
import { useAuth } from "@/app/providers";
import { fsGet, fsSet } from "@/lib/firebase/firestore-rest";

// ── Categorías ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Todos", "Análisis", "Ventas & CRM", "Operaciones", "Finanzas", "Marketing", "Legal", "Sector", "Plataforma"];

// ── Catálogo de agentes ───────────────────────────────────────────────────────

type AgentStatus = "activo" | "beta" | "proximo";

type AgentDef = {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  category: string;
  description: string;
  longDesc: string;
  tags: string[];
  accuracy?: string;
  availabilityLabel?: string;
  status: AgentStatus;
  creditsCost: number;
};

const CATALOG: AgentDef[] = [
  // ── Análisis ──────────────────────────────────────────────────────────────
  {
    id: "documentos",
    name: "Análisis de Documentos",
    icon: "description",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    category: "Análisis",
    description: "Extrae e interpreta información de PDFs, Word, imágenes y presentaciones.",
    longDesc: "Extrae, procesa e interpreta información de documentos subidos por el usuario (PDF, Word, imágenes, presentaciones). Detecta datos clave, genera resúmenes ejecutivos y responde preguntas sobre el contenido.",
    tags: ["PDF", "OCR", "Resúmenes"],
    accuracy: "93.4%",
    status: "activo",
    creditsCost: 80,
  },
  {
    id: "datos-estructurados",
    name: "Datos Estructurados",
    icon: "table_chart",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    category: "Análisis",
    description: "Analiza Excel y CSV; extrae patrones estadísticos y visualizaciones.",
    longDesc: "Analiza archivos estructurados como Excel/CSV; limpia, transforma y extrae patrones estadísticos de datos numéricos o tabulares. Genera gráficas, tablas resumen y alertas sobre anomalías.",
    tags: ["Excel", "CSV", "Estadística"],
    accuracy: "95.8%",
    status: "activo",
    creditsCost: 70,
  },
  {
    id: "investigacion-web",
    name: "Investigación Web",
    icon: "travel_explore",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    category: "Análisis",
    description: "Búsquedas en internet sobre competencia, tendencias y noticias del sector.",
    longDesc: "Realiza búsquedas en internet sobre competencia, tendencias del mercado o noticias relevantes usando Tavily y otras fuentes. Consolida la información y genera reportes de inteligencia competitiva.",
    tags: ["Tavily", "OSINT", "Tendencias"],
    accuracy: "88.1%",
    status: "activo",
    creditsCost: 90,
  },
  // ── Ventas & CRM ──────────────────────────────────────────────────────────
  {
    id: "ventas",
    name: "Análisis de Ventas",
    icon: "query_stats",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    category: "Ventas & CRM",
    description: "Analiza rendimiento de ventas, identifica tendencias y oportunidades de crecimiento.",
    longDesc: "Analiza el rendimiento histórico de ventas por canal, producto y región. Identifica tendencias, productos estrella y oportunidades de crecimiento. Genera forecasts y recomendaciones accionables.",
    tags: ["Forecasting", "KPIs", "Crecimiento"],
    accuracy: "94.7%",
    status: "activo",
    creditsCost: 100,
  },
  {
    id: "precios",
    name: "Precios y Competencia",
    icon: "trending_up",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    category: "Ventas & CRM",
    description: "Monitorea precios de competidores y sugiere ajustes para maximizar el margen.",
    longDesc: "Monitorea en tiempo real precios de competidores, niveles de inventario y patrones de demanda para recomendar ajustes de precios que maximicen el margen. Calcula el impacto en la rentabilidad.",
    tags: ["E-commerce", "Márgenes", "Benchmarking"],
    accuracy: "91.2%",
    status: "activo",
    creditsCost: 90,
  },
  {
    id: "atencion-cliente",
    name: "Atención al Cliente",
    icon: "support_agent",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    category: "Ventas & CRM",
    description: "Analiza tickets y reseñas para detectar patrones de insatisfacción.",
    longDesc: "Analiza tickets de soporte, reseñas y quejas de clientes para detectar patrones de insatisfacción y proponer mejoras. Clasifica casos por urgencia y genera resúmenes para el equipo de CX.",
    tags: ["NPS", "Tickets", "Reseñas"],
    accuracy: "87.5%",
    status: "activo",
    creditsCost: 85,
  },
  {
    id: "customer-success",
    name: "Customer Success",
    icon: "favorite",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    category: "Ventas & CRM",
    description: "Detecta clientes en riesgo de churn y oportunidades de upgrade.",
    longDesc: "Monitorea el comportamiento de los clientes en la plataforma para identificar su nivel de engagement. Detecta clientes inactivos, en riesgo de churn, listos para un upgrade o estratégicos, generando alertas proactivas.",
    tags: ["Churn", "Retención", "Engagement"],
    accuracy: "86.3%",
    status: "beta",
    creditsCost: 95,
  },
  {
    id: "crm-ventas",
    name: "CRM Interno de Ventas",
    icon: "contacts",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    category: "Ventas & CRM",
    description: "Clasifica prospectos, asigna temperatura de leads y prioriza demos.",
    longDesc: "Asiste al equipo de ventas en la gestión de prospectos y oportunidades. Clasifica leads, asigna temperatura, sugiere próximas acciones, prioriza demos y genera borradores de mensajes de seguimiento.",
    tags: ["Leads", "Pipeline", "Seguimiento"],
    accuracy: "84.9%",
    status: "beta",
    creditsCost: 95,
  },
  // ── Operaciones ───────────────────────────────────────────────────────────
  {
    id: "inventario",
    name: "Gestión de Inventario",
    icon: "inventory_2",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    category: "Operaciones",
    description: "Monitorea stock, detecta baja rotación y predice necesidades de reabastecimiento.",
    longDesc: "Monitorea niveles de stock, detecta productos de baja rotación y predice necesidades de reabastecimiento. Genera alertas de stock crítico, órdenes de compra automáticas y reportes de rotación.",
    tags: ["Stock", "Supply Chain", "Alertas"],
    accuracy: "96.1%",
    status: "activo",
    creditsCost: 80,
  },
  {
    id: "logistica",
    name: "Logística y Cadena de Suministro",
    icon: "local_shipping",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    category: "Operaciones",
    description: "Optimiza rutas de distribución y analiza cuellos de botella en la cadena de suministro.",
    longDesc: "Optimiza rutas de distribución, gestiona proveedores y analiza cuellos de botella en la cadena de suministro. Evalúa tiempos de entrega, costos logísticos y sugiere mejoras operativas.",
    tags: ["Rutas", "Proveedores", "Distribución"],
    accuracy: "89.4%",
    status: "activo",
    creditsCost: 85,
  },
  {
    id: "proyectos",
    name: "Proyectos y Gestión",
    icon: "assignment",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    category: "Operaciones",
    description: "Supervisa el avance de proyectos y detecta desviaciones respecto al plan.",
    longDesc: "Supervisa el avance de proyectos internos, detecta desviaciones de cronograma o presupuesto y genera reportes de estado para equipos y directivos. Integra con herramientas de gestión de tareas.",
    tags: ["PMO", "Cronograma", "KPIs"],
    accuracy: "88.7%",
    status: "activo",
    creditsCost: 90,
  },
  {
    id: "rrhh",
    name: "Recursos Humanos",
    icon: "groups",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    category: "Operaciones",
    description: "Analiza desempeño del equipo y detecta brechas de habilidades.",
    longDesc: "Apoya en la gestión del talento: analiza indicadores de desempeño, detecta brechas de habilidades y sugiere planes de formación. Genera reportes de clima laboral y retención de talento.",
    tags: ["Talento", "Desempeño", "Formación"],
    accuracy: "83.6%",
    status: "beta",
    creditsCost: 95,
  },
  // ── Finanzas ──────────────────────────────────────────────────────────────
  {
    id: "financiero",
    name: "Análisis Financiero",
    icon: "account_balance",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    category: "Finanzas",
    description: "Evalúa la salud financiera, analiza flujos de caja y genera proyecciones.",
    longDesc: "Evalúa la salud financiera de la empresa, analiza flujos de caja, márgenes de ganancia y genera proyecciones. Automatiza la conciliación bancaria y alerta sobre desviaciones presupuestales.",
    tags: ["Flujo de Caja", "Márgenes", "Proyecciones"],
    accuracy: "89.5%",
    status: "activo",
    creditsCost: 100,
  },
  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    id: "marketing",
    name: "Marketing y Contenido",
    icon: "campaign",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    category: "Marketing",
    description: "Genera estrategias y redacta contenido para redes sociales y campañas.",
    longDesc: "Genera estrategias de marketing, redacta contenido para redes sociales, campañas y comunicados basado en datos del negocio. Optimiza presupuestos de pauta y analiza el rendimiento de campañas.",
    tags: ["Redes Sociales", "Pauta", "Contenido"],
    accuracy: "87.3%",
    status: "activo",
    creditsCost: 110,
  },
  {
    id: "tips",
    name: "Tips y Recomendaciones",
    icon: "lightbulb",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    category: "Marketing",
    description: "Genera consejos proactivos y personalizados para aumentar el engagement.",
    longDesc: "Genera consejos proactivos y personalizados para cada cliente para aumentar el engagement y el valor percibido de la plataforma. Sugiere nuevas misiones, funciones no exploradas y acciones de mejora.",
    tags: ["Engagement", "Personalización", "Retención"],
    accuracy: "85.2%",
    status: "activo",
    creditsCost: 40,
  },
  // ── Legal ─────────────────────────────────────────────────────────────────
  {
    id: "legal",
    name: "Legal y Cumplimiento",
    icon: "gavel",
    iconBg: "bg-gray-200",
    iconColor: "text-gray-600",
    category: "Legal",
    description: "Analiza contratos, detecta riesgos legales y verifica cumplimiento normativo.",
    longDesc: "Analiza contratos comerciales e identifica cláusulas de riesgo. Verifica cumplimiento de regulaciones locales e internacionales (GDPR, DIAN, etc.) y genera resúmenes ejecutivos para equipos legales.",
    tags: ["Contratos", "GDPR", "Normativa"],
    accuracy: "90.1%",
    status: "activo",
    creditsCost: 150,
  },
  // ── Sector ────────────────────────────────────────────────────────────────
  {
    id: "agropecuario",
    name: "Agente Agropecuario",
    icon: "agriculture",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-700",
    category: "Sector",
    description: "Analiza rendimientos, costos por hectárea y precios de commodities agrícolas.",
    longDesc: "Analiza datos del sector agrícola: rendimientos por cultivo, costos por hectárea, condiciones climáticas y precios de commodities. Genera alertas de riesgo climático y recomendaciones de siembra.",
    tags: ["Cultivos", "Commodities", "Clima"],
    accuracy: "88.9%",
    status: "activo",
    creditsCost: 90,
  },
  {
    id: "salud",
    name: "Salud y Bienestar",
    icon: "medical_services",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    category: "Sector",
    description: "Apoya a clínicas con análisis de ocupación y cumplimiento de normativas sanitarias.",
    longDesc: "Apoya a clínicas y hospitales con análisis de ocupación de camas, gestión de turnos médicos y cumplimiento de normativas sanitarias. Genera reportes de eficiencia operativa y alertas de capacidad.",
    tags: ["Salud", "Normativas", "Ocupación"],
    accuracy: "91.7%",
    status: "activo",
    creditsCost: 120,
  },
  {
    id: "educativo",
    name: "Agente Educativo",
    icon: "school",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
    category: "Sector",
    description: "Analiza rendimiento académico y genera planes de mejora curricular.",
    longDesc: "Analiza el rendimiento de estudiantes por materia, cohorte y docente. Genera reportes pedagógicos, detecta patrones de deserción y sugiere planes de mejora curricular personalizados.",
    tags: ["Pedagogía", "Deserción", "Rendimiento"],
    accuracy: "86.4%",
    status: "activo",
    creditsCost: 85,
  },
  {
    id: "inmobiliario",
    name: "Agente Inmobiliario",
    icon: "real_estate_agent",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    category: "Sector",
    description: "Evalúa propiedades, analiza el mercado local y proyecta valorización.",
    longDesc: "Evalúa propiedades, analiza el mercado inmobiliario local, genera comparativos de precios por zona y proyecciones de valorización. Apoya en la toma de decisiones de inversión y venta.",
    tags: ["Finca Raíz", "Valoración", "Mercado"],
    accuracy: "87.8%",
    status: "activo",
    creditsCost: 110,
  },
  // ── Plataforma ────────────────────────────────────────────────────────────
  {
    id: "generador-reportes",
    name: "Generador de Reportes",
    icon: "summarize",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Consolida análisis y genera informes finales en PDF, HTML o JSON.",
    longDesc: "Consolida todos los análisis parciales de los demás agentes y genera el informe final en el formato adecuado (PDF, HTML, JSON) con gráficas y visualizaciones. Es el último paso de cada misión.",
    tags: ["PDF", "Visualizaciones", "Exportación"],
    accuracy: "97.2%",
    status: "activo",
    creditsCost: 60,
  },
  {
    id: "revisor-calidad",
    name: "Revisor de Calidad",
    icon: "fact_check",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Valida coherencia y precisión de los reportes antes de entregarlos al usuario.",
    longDesc: "Valida la coherencia, precisión y completitud de los reportes generados antes de entregarlos al usuario final. Detecta contradicciones, datos faltantes y evalúa la calidad general del análisis.",
    tags: ["QA", "Validación", "Coherencia"],
    accuracy: "95.3%",
    status: "activo",
    creditsCost: 50,
  },
  {
    id: "costos-ia",
    name: "Monitor de Costos IA",
    icon: "savings",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Monitorea el consumo de tokens y calcula el costo en tiempo real de cada misión.",
    longDesc: "Monitorea el consumo de tokens y calcula el costo en tiempo real de cada misión para mantener la rentabilidad. Genera alertas cuando una misión supera el presupuesto asignado.",
    tags: ["Tokens", "Costos", "Rentabilidad"],
    accuracy: "99.1%",
    status: "activo",
    creditsCost: 20,
  },
  {
    id: "router-modelos",
    name: "Router de Modelos LLM",
    icon: "hub",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Selecciona dinámicamente el LLM más adecuado según la tarea y el plan del cliente.",
    longDesc: "Selecciona dinámicamente el LLM más adecuado (DeepSeek, Mistral, Grok, Claude) según la naturaleza de la tarea, el costo estimado y el plan del cliente. Optimiza calidad y rentabilidad simultáneamente.",
    tags: ["LLM", "Routing", "Optimización"],
    accuracy: "96.8%",
    status: "activo",
    creditsCost: 10,
  },
  {
    id: "seguridad",
    name: "Seguridad y Privacidad",
    icon: "shield",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Garantiza el aislamiento de datos por cliente y gestiona registros de auditoría.",
    longDesc: "Garantiza la seguridad de los datos, la privacidad de la información y el cumplimiento de las políticas de acceso. Asegura el aislamiento de datos por organización, gestiona API keys y mantiene registros de auditoría.",
    tags: ["IAM", "Auditoría", "Cifrado"],
    accuracy: "99.5%",
    status: "activo",
    creditsCost: 15,
  },
  {
    id: "auditor",
    name: "Auditor Interno",
    icon: "manage_search",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    category: "Plataforma",
    description: "Evalúa el funcionamiento de todos los agentes e identifica áreas de optimización.",
    longDesc: "Evalúa el funcionamiento general de todos los agentes y la plataforma, identificando áreas de mejora y optimización. Revisa calidad de reportes, costos promedio, errores y rendimiento de los modelos.",
    tags: ["Logs", "Optimización", "Rendimiento"],
    accuracy: "93.6%",
    status: "activo",
    creditsCost: 30,
  },
];

// ── Badge de estado ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AgentStatus }) {
  if (status === "activo")
    return <span className="px-sm py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">Activo</span>;
  if (status === "beta")
    return <span className="px-sm py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Beta</span>;
  return <span className="px-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase">Próximamente</span>;
}

// ── Modal de configuración ────────────────────────────────────────────────────

function AgentModal({
  agent,
  isEnabled,
  onClose,
  onToggle,
}: {
  agent: AgentDef;
  isEnabled: boolean;
  onClose: () => void;
  onToggle: (id: string, enabled: boolean) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [done, setDone]     = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    await onToggle(agent.id, !isEnabled);
    setSaving(false);
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-lg bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-xl relative" style={{ width: "560px", maxWidth: "calc(100vw - 32px)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-md right-md text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-md mb-lg">
          <div className={`w-14 h-14 ${agent.iconBg} ${agent.iconColor} rounded-xl flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[36px]">{agent.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <h3 className="font-bold text-on-surface text-lg">{agent.name}</h3>
              <StatusBadge status={agent.status} />
            </div>
            <p className="font-code-mono text-xs text-on-surface-variant">{agent.category}</p>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-on-surface-variant text-sm leading-relaxed mb-lg">{agent.longDesc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-xs mb-lg">
          {agent.tags.map((t) => (
            <span key={t} className="px-sm py-0.5 bg-surface-container text-on-surface-variant text-xs rounded-full">{t}</span>
          ))}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-md mb-lg">
          <div className="p-md bg-surface-container rounded-xl">
            <p className="font-code-mono text-xs text-on-surface-variant mb-xs">PRECISIÓN</p>
            <p className="font-bold text-secondary text-lg">{agent.accuracy ?? "—"}</p>
          </div>
          <div className="p-md bg-surface-container rounded-xl">
            <p className="font-code-mono text-xs text-on-surface-variant mb-xs">COSTO / MISIÓN</p>
            <p className="font-bold text-on-surface text-lg">{agent.creditsCost} créditos</p>
          </div>
        </div>

        {/* Estado actual */}
        {isEnabled && (
          <div className="flex items-center gap-sm p-md bg-emerald-50 border border-emerald-200 rounded-xl mb-md text-emerald-700 text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Este agente está activo en tu organización
          </div>
        )}

        {done && (
          <div className="flex items-center gap-sm p-md bg-emerald-50 border border-emerald-200 rounded-xl mb-md text-emerald-700 text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {isEnabled ? "Agente desactivado" : "Agente activado correctamente"}
          </div>
        )}

        {/* Acción */}
        {agent.status !== "proximo" && (
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`w-full py-md font-bold rounded-xl transition-all flex items-center justify-center gap-sm ${
              isEnabled
                ? "border-2 border-error text-error hover:bg-error/5"
                : "bg-secondary text-white hover:opacity-90"
            } disabled:opacity-60`}
          >
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>}
            {isEnabled ? "Desactivar agente" : "Activar agente"}
          </button>
        )}
        {agent.status === "proximo" && (
          <p className="text-center text-on-surface-variant text-sm font-code-mono">
            Disponible: {agent.availabilityLabel}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

// ── Modal Coordinador Maestro ─────────────────────────────────────────────────

function CoordinadorModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [config, setConfig] = useState({ nombre: "Coordinador Principal", idioma: "es", maxAgentes: "3", prioridad: "equilibrio" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    if (!user) return;
    fsGet("agent_coordinator", user.uid).then((d) => {
      if (d) setConfig((prev) => ({ ...prev, ...(d as typeof config) }));
    }).catch(() => {});
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await fsSet("agent_coordinator", user.uid, config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-lg bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-xl relative" style={{ width: "640px", maxWidth: "calc(100vw - 32px)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-md right-md text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-md mb-lg">
          <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-lg">Agente Coordinador Maestro</h3>
            <p className="font-code-mono text-xs text-on-surface-variant">Configuración general</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-md">
          <div className="space-y-xs">
            <label className="font-code-mono text-xs text-on-surface-variant font-bold">NOMBRE DEL COORDINADOR</label>
            <input type="text" value={config.nombre}
              onChange={(e) => setConfig((p) => ({ ...p, nombre: e.target.value }))}
              className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="font-code-mono text-xs text-on-surface-variant font-bold">IDIOMA DE RESPUESTA</label>
              <select value={config.idioma} onChange={(e) => setConfig((p) => ({ ...p, idioma: e.target.value }))}
                className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm outline-none appearance-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="font-code-mono text-xs text-on-surface-variant font-bold">MÁX. AGENTES PARALELOS</label>
              <select value={config.maxAgentes} onChange={(e) => setConfig((p) => ({ ...p, maxAgentes: e.target.value }))}
                className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm outline-none appearance-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all">
                <option value="1">1 agente</option>
                <option value="2">2 agentes</option>
                <option value="3">3 agentes</option>
                <option value="5">5 agentes</option>
              </select>
            </div>
          </div>

          <div className="space-y-xs">
            <label className="font-code-mono text-xs text-on-surface-variant font-bold">ESTRATEGIA DE PRIORIDAD</label>
            <div className="grid grid-cols-3 gap-sm">
              {[
                { val: "velocidad", icon: "bolt", label: "Velocidad" },
                { val: "equilibrio", icon: "balance", label: "Equilibrio" },
                { val: "precision", icon: "verified", label: "Precisión" },
              ].map(({ val, icon, label }) => (
                <button key={val} type="button"
                  onClick={() => setConfig((p) => ({ ...p, prioridad: val }))}
                  className={`p-md rounded-xl border-2 flex flex-col items-center gap-xs transition-all ${
                    config.prioridad === val ? "border-secondary bg-secondary/5 text-secondary" : "border-outline-variant text-on-surface-variant hover:border-secondary/40"
                  }`}>
                  <span className="material-symbols-outlined text-[22px]">{icon}</span>
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-sm text-xs text-center text-on-surface-variant font-code-mono pt-xs">
            <p>Respuestas rápidas, menor profundidad</p>
            <p>Velocidad y calidad balanceadas</p>
            <p>Máxima calidad, mayor tiempo</p>
          </div>

          {saved && (
            <div className="flex items-center gap-sm p-md bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Configuración guardada
            </div>
          )}

          <div className="flex justify-end gap-md pt-xs">
            <button type="button" onClick={onClose}
              className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container font-bold transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-md py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-sm disabled:opacity-60">
              {saving && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
              Guardar configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AgentesPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory]       = useState("Todos");
  const [search, setSearch]                       = useState("");
  const [selectedAgent, setSelectedAgent]         = useState<AgentDef | null>(null);
  const [showCoordinador, setShowCoordinador]     = useState(false);
  const [enabledAgents, setEnabledAgents]         = useState<Set<string>>(new Set());
  const [loadingAgents, setLoadingAgents]         = useState(true);

  // Cargar agentes activos del usuario desde Firestore
  useEffect(() => {
    if (!user) return;
    fsGet("user_agents", user.uid).then((data) => {
      if (data?.enabled && Array.isArray(data.enabled)) {
        setEnabledAgents(new Set(data.enabled as string[]));
      }
    }).catch(() => {}).finally(() => setLoadingAgents(false));
  }, [user]);

  const handleToggle = async (agentId: string, enable: boolean) => {
    if (!user) return;
    const next = new Set(enabledAgents);
    if (enable) next.add(agentId);
    else next.delete(agentId);
    setEnabledAgents(next);
    await fsSet("user_agents", user.uid, { enabled: Array.from(next) });
  };

  const filtered = CATALOG.filter((a) => {
    const matchCat    = activeCategory === "Todos" || a.category === activeCategory;
    const matchSearch = search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeCount = enabledAgents.size;

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <AppSidebar />

      <main className="flex-1 ml-[260px] min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-xl py-md">
          <div>
            <h2 className="font-bold text-xl text-on-surface">Biblioteca de Agentes</h2>
            <p className="text-sm text-on-surface-variant">
              {loadingAgents ? "Cargando..." : `${activeCount} agente${activeCount !== 1 ? "s" : ""} activo${activeCount !== 1 ? "s" : ""} en tu organización`}
            </p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar agente..."
              className="bg-surface-container border border-outline-variant rounded-full pl-10 pr-md py-sm outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all w-64"
            />
          </div>
        </header>

        <div className="p-xl space-y-xl max-w-[1100px]">

          {/* Filtros */}
          <div className="flex flex-wrap gap-sm">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-md py-xs rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-secondary text-white"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Banner agente coordinador */}
          <section className="rounded-xl p-xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #131b2e 0%, #0058be 100%)" }}>
            <div className="flex items-center gap-lg">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="flex-1 min-w-0 text-white">
                <div className="flex items-center gap-sm mb-xs flex-wrap">
                  <h3 className="font-bold text-xl whitespace-nowrap">Agente Coordinador Maestro</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-sm py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">Incluido en tu plan</span>
                </div>
                <p className="text-white/80 text-sm mb-md">
                  Orquesta múltiples sub-agentes para flujos de trabajo complejos. Optimiza automáticamente la asignación de recursos y garantiza coherencia operativa.
                </p>
                <div className="flex gap-sm flex-wrap">
                  {[{ icon: "verified", label: "98.2% precisión" }, { icon: "bolt", label: "< 2s latencia" }, { icon: "view_in_ar", label: "Multimodal" }].map((chip) => (
                    <span key={chip.label} className="bg-white/10 text-white px-md py-xs rounded-full text-xs flex items-center gap-xs whitespace-nowrap">
                      <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowCoordinador(true)} className="bg-white text-secondary px-lg py-sm rounded-xl font-bold hover:opacity-90 transition-all shrink-0">
                Configurar
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          </section>

          {/* Grid de agentes */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filtered.map((agent) => {
              const isProximo  = agent.status === "proximo";
              const isEnabled  = enabledAgents.has(agent.id);

              return (
                <div key={agent.id}
                  onClick={() => !isProximo && setSelectedAgent(agent)}
                  className={`p-lg rounded-xl border flex flex-col transition-all cursor-pointer ${
                    isProximo
                      ? "bg-surface-container/50 border-outline-variant/30 opacity-60 cursor-not-allowed"
                      : isEnabled
                        ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                        : "bg-surface-container-lowest border-outline-variant hover:border-secondary hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-md">
                    <div className={`w-12 h-12 ${agent.iconBg} ${agent.iconColor} rounded-xl flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-[28px]">{agent.icon}</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      {isEnabled && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      <StatusBadge status={agent.status} />
                    </div>
                  </div>

                  <h4 className={`font-bold mb-xs ${isEnabled ? "text-emerald-800" : "text-on-surface"}`}>{agent.name}</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-md flex-1">{agent.description}</p>

                  <div className="flex flex-wrap gap-xs mb-md">
                    {agent.tags.map((tag) => (
                      <span key={tag} className="px-xs py-0.5 bg-surface-container text-on-surface-variant text-[11px] rounded-full">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-md mt-auto">
                    <div>
                      <p className="font-code-mono text-[10px] text-on-surface-variant">{isProximo ? "DISPONIBILIDAD" : "PRECISIÓN"}</p>
                      <p className={`font-bold text-sm ${isProximo ? "text-on-surface-variant" : isEnabled ? "text-emerald-700" : "text-secondary"}`}>
                        {isProximo ? agent.availabilityLabel : agent.accuracy}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-sm py-xs rounded-lg ${
                      isProximo ? "bg-surface-container text-on-surface-variant"
                      : isEnabled ? "bg-emerald-100 text-emerald-700"
                      : "bg-secondary/10 text-secondary"
                    }`}>
                      {isProximo ? "Bloqueado" : isEnabled ? "✓ Activo" : agent.status === "beta" ? "Activar beta" : "Activar"}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Banner agente personalizado */}
          <section className="border border-secondary/20 bg-secondary/5 rounded-xl p-xl flex items-center gap-lg">
            <div className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-on-surface mb-xs">Agente a tu medida</h3>
              <p className="text-sm text-on-surface-variant">¿Tienes un flujo de trabajo único? Nuestros ingenieros pueden construir un agente entrenado con tu propia data.</p>
            </div>
            <button className="bg-secondary text-white px-lg py-sm rounded-xl font-bold hover:opacity-90 transition-all shrink-0 whitespace-nowrap">
              Hablar con un especialista
            </button>
          </section>

        </div>
      </main>

      {/* Modal Coordinador */}
      {showCoordinador && <CoordinadorModal onClose={() => setShowCoordinador(false)} />}

      {/* Modal agente */}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          isEnabled={enabledAgents.has(selectedAgent.id)}
          onClose={() => setSelectedAgent(null)}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
