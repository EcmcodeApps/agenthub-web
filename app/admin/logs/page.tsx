"use client";

import { useEffect, useRef, useState } from "react";

type LogLevel = "todos" | "info" | "warn" | "error" | "debug";

interface LogLine {
  id: number;
  ts: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  service: string;
  message: string;
  stack?: string[];
}

const INITIAL_LOGS: LogLine[] = [
  { id: 1,  ts: "2023-10-24 10:15:02", level: "INFO",  service: "Agent Orchestrator",   message: "System heartbeat check: healthy." },
  { id: 2,  ts: "2023-10-24 10:15:10", level: "INFO",  service: "Auth Service",          message: 'User "admin_corp_01" logged in from 192.168.1.105.' },
  { id: 3,  ts: "2023-10-24 10:15:15", level: "DEBUG", service: "Cache Manager",         message: "Memory cache hit for key: user_perms_29301." },
  { id: 4,  ts: "2023-10-24 10:15:22", level: "WARN",  service: "Document Processor",   message: "Memory usage exceeded 85% threshold." },
  { id: 5,  ts: "2023-10-24 10:15:23", level: "INFO",  service: "Agent Orchestrator",   message: "Provisioning new worker thread for agent: PDF_Extractor_01." },
  { id: 6,  ts: "2023-10-24 10:15:45", level: "ERROR", service: "API Gateway",           message: "Failed to route request to Document Processor: Timeout." },
  { id: 7,  ts: "2023-10-24 10:16:01", level: "INFO",  service: "Billing Module",        message: "Transaction processed for Org ID: 55021." },
  { id: 8,  ts: "2023-10-24 10:16:12", level: "DEBUG", service: "LLM Interface",         message: "Tokens consumed: 124 prompt, 38 response." },
  { id: 9,  ts: "2023-10-24 10:16:30", level: "ERROR", service: "Agent Orchestrator",   message: "Agent 'Market_Analyst' terminated unexpectedly. Stack trace attached.", stack: ["at agent_orchestrator.py, line 442, in run_agent", "RuntimeError: Out of available token credits for model: GPT-4-32k."] },
  { id: 10, ts: "2023-10-24 10:17:05", level: "INFO",  service: "System Monitor",        message: "High latency detected in DB-Store-03: 450ms." },
  { id: 11, ts: "2023-10-24 10:17:15", level: "WARN",  service: "Auth Service",          message: '5 consecutive failed login attempts for user "hr_lead".' },
  { id: 12, ts: "2023-10-24 10:17:40", level: "INFO",  service: "Agent Orchestrator",   message: "Agent 'Compliance_Bot' started successfully." },
  { id: 13, ts: "2023-10-24 10:18:02", level: "INFO",  service: "Cache Manager",         message: "Purging expired sessions from Redis." },
  { id: 14, ts: "2023-10-24 10:18:15", level: "DEBUG", service: "Document Processor",   message: "OCR phase completed for file ID: doc_7721." },
  { id: 15, ts: "2023-10-24 10:18:30", level: "INFO",  service: "API Gateway",           message: "Routing health check: all nodes responding." },
  { id: 16, ts: "2023-10-24 10:18:45", level: "ERROR", service: "Storage Hub",           message: "Write operation failed on bucket 'raw-assets-us-east-1'." },
  { id: 17, ts: "2023-10-24 10:19:01", level: "WARN",  service: "Agent Orchestrator",   message: "Agent 'Scraper_Pro' is taking longer than expected to respond." },
  { id: 18, ts: "2023-10-24 10:19:15", level: "INFO",  service: "Auth Service",          message: 'Password reset requested for user "legal_clerk".' },
];

const SIM_SERVICES = ["Agent Orchestrator", "Document Processor", "Auth Service", "Storage Hub", "API Gateway", "Billing Module"];
const SIM_LEVELS: LogLine["level"][] = ["INFO", "INFO", "INFO", "DEBUG", "WARN", "ERROR"];
const SIM_MESSAGES = [
  "Processing payload for request ID: 550x",
  "Encryption module initialized.",
  "Connection reset by peer: 10.0.1.24",
  "Latency spikes detected in cluster node A.",
  "New API key generated for project: Delta.",
  "Sync completed with secondary database.",
  "Resource allocation optimized for agent: Analyzer.",
];

const LEVEL_COLOR: Record<LogLine["level"], string> = {
  INFO:  "text-blue-400",
  DEBUG: "text-slate-400",
  WARN:  "text-amber-400",
  ERROR: "text-red-400",
};

const BAR_HEIGHTS = [40, 60, 45, 85, 30, 55, 70, 15, 40, 65];
const BAR_COLORS  = ["bg-secondary","bg-secondary","bg-secondary","bg-error","bg-secondary","bg-secondary","bg-secondary","bg-error","bg-secondary","bg-secondary"];

const QUICK_FILTERS = [
  { icon: "error_outline",  iconClass: "text-error",             label: "Errores recientes",  count: 12, countClass: "bg-error/10 text-error" },
  { icon: "smart_toy",      iconClass: "text-secondary",         label: "Eventos de agentes", count: 842, countClass: "bg-surface-container-highest text-on-surface-variant" },
  { icon: "lock_person",    iconClass: "text-on-surface-variant", label: "Autenticación",     count: 156, countClass: "bg-surface-container-highest text-on-surface-variant" },
  { icon: "payments",       iconClass: "text-on-surface-variant", label: "Facturación",       count: 28,  countClass: "bg-surface-container-highest text-on-surface-variant" },
];

let _idCounter = INITIAL_LOGS.length + 1;

export default function LogsPage() {
  const [activeLevel, setActiveLevel] = useState<LogLevel>("todos");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const ts = now.toISOString().replace("T", " ").substring(0, 19);
      const level = SIM_LEVELS[Math.floor(Math.random() * SIM_LEVELS.length)];
      const service = SIM_SERVICES[Math.floor(Math.random() * SIM_SERVICES.length)];
      const message = SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)];
      const newLine: LogLine = { id: _idCounter++, ts, level, service, message };
      setLogs((prev) => [...prev.slice(-49), newLine]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const LEVEL_FILTERS: { key: LogLevel; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "info",  label: "INFO" },
    { key: "warn",  label: "WARN" },
    { key: "error", label: "ERROR" },
    { key: "debug", label: "DEBUG" },
  ];

  const visibleLogs = logs.filter((l) => {
    const levelMatch = activeLevel === "todos" || l.level.toLowerCase() === activeLevel;
    const searchMatch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.service.toLowerCase().includes(search.toLowerCase());
    return levelMatch && searchMatch;
  });

  return (
    <>
      <style>{`
        .blinking-cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
        .pulse-dot { animation: pulse-green 2s infinite ease-in-out; }
        @keyframes pulse-green {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .custom-scrollbar::-webkit-scrollbar       { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>

      <div className="flex flex-col overflow-hidden h-full">
          {/* Top bar */}
          <header className="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant h-16 px-lg flex justify-between items-center shrink-0">
            <div>
              <h2 className="font-bold text-lg text-on-surface">Logs del Sistema</h2>
              <p className="font-code-mono text-[11px] text-on-surface-variant">Registro en tiempo real de eventos de plataforma</p>
            </div>
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                <span className="text-green-700 font-code-mono text-[11px] font-bold uppercase tracking-wider">Live</span>
              </div>
              <button className="flex items-center gap-2 px-lg py-sm border border-outline rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-medium text-sm">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exportar logs
              </button>
              <div className="h-8 w-px bg-outline-variant" />
              <button className="text-on-surface-variant hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
            </div>
          </header>

          {/* Main area */}
          <main className="flex-1 flex overflow-hidden">
            {/* Terminal section */}
            <section className="flex-1 p-gutter flex flex-col gap-md overflow-hidden">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-md">
                {/* Level tabs */}
                <div className="flex items-center bg-surface-container rounded-lg p-1">
                  {LEVEL_FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveLevel(key)}
                      className={`px-md py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                        activeLevel === key
                          ? "bg-white shadow-sm text-secondary font-bold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Search + service + date */}
                <div className="flex items-center gap-sm">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar en logs..."
                      className="pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg text-body-md w-64 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                    />
                  </div>
                  <button className="flex items-center gap-sm px-md py-2 bg-white border border-outline-variant rounded-lg text-[13px] font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span>Todos los servicios</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                  <div className="flex items-center gap-sm px-md py-2 bg-white border border-outline-variant rounded-lg text-[13px] font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>Hoy, 24 Oct</span>
                  </div>
                </div>
              </div>

              {/* Terminal */}
              <div className="flex-1 bg-[#0f172a] rounded-xl border border-slate-700 flex flex-col shadow-2xl overflow-hidden">
                {/* Terminal header */}
                <div className="bg-slate-800 px-md py-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-md">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-code-mono text-[12px]">
                      <span className="material-symbols-outlined text-[14px]">terminal</span>
                      <span>agenthub-prod · us-east-1</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                    </button>
                  </div>
                </div>

                {/* Terminal body */}
                <div
                  ref={terminalRef}
                  className="flex-1 overflow-y-auto p-md font-code-mono text-[13px] leading-relaxed custom-scrollbar bg-[#0f172a] space-y-0.5"
                >
                  {visibleLogs.map((log) => (
                    <div key={log.id}>
                      <p className="text-slate-500">
                        <span>[{log.ts}]</span>{" "}
                        <span className={LEVEL_COLOR[log.level]}>{log.level.padEnd(5)}</span>{" "}
                        <span className="text-on-tertiary-container">{log.service}</span>
                        {" — "}
                        {log.message}
                      </p>
                      {log.stack?.map((line, i) => (
                        <p key={i} className="text-slate-600 pl-8">{line}</p>
                      ))}
                    </div>
                  ))}
                  {/* Blinking cursor */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-slate-500">[{new Date().toISOString().replace("T", " ").substring(0, 19)}]</span>
                    <span className="text-white blinking-cursor">█</span>
                  </div>
                </div>

                {/* Terminal footer */}
                <div className="bg-slate-900 px-md py-2 border-t border-slate-700 flex justify-between items-center font-code-mono text-[11px] text-slate-500 uppercase tracking-widest font-bold shrink-0">
                  <div className="flex items-center gap-md">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Auto-scroll activo
                    </span>
                    <span className="text-slate-600">|</span>
                    <span>UTF-8</span>
                  </div>
                  <div>{logs.length.toLocaleString()} eventos cargados · 14.2 MB</div>
                </div>
              </div>
            </section>

            {/* Right sidebar */}
            <aside className="w-[340px] bg-white border-l border-outline-variant flex flex-col p-gutter gap-gutter overflow-y-auto shrink-0">
              {/* 24h stats */}
              <div className="space-y-md">
                <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">bar_chart</span>
                  Estado 24h
                </h3>
                <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/30">
                  <div className="flex items-end justify-between gap-1 h-24 mb-md">
                    {BAR_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm ${BAR_COLORS[i]}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-md">
                    <div className="text-center">
                      <p className="font-code-mono text-[10px] text-on-surface-variant font-bold uppercase">Info</p>
                      <p className="font-bold text-lg text-secondary font-code-mono">2,412</p>
                    </div>
                    <div className="text-center">
                      <p className="font-code-mono text-[10px] text-on-surface-variant font-bold uppercase">Warn</p>
                      <p className="font-bold text-lg text-amber-600 font-code-mono">341</p>
                    </div>
                    <div className="text-center">
                      <p className="font-code-mono text-[10px] text-on-surface-variant font-bold uppercase">Error</p>
                      <p className="font-bold text-lg text-error font-code-mono">94</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick filters */}
              <div className="space-y-sm">
                <h3 className="font-code-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Filtros Rápidos
                </h3>
                <div className="flex flex-col gap-1">
                  {QUICK_FILTERS.map(({ icon, iconClass, label, count, countClass }) => (
                    <button
                      key={label}
                      className="flex items-center justify-between px-sm py-2.5 rounded-lg hover:bg-surface-container transition-colors text-body-md font-medium text-on-surface"
                    >
                      <div className="flex items-center gap-sm">
                        <span className={`material-symbols-outlined text-[20px] ${iconClass}`}>{icon}</span>
                        <span>{label}</span>
                      </div>
                      <span className={`font-code-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${countClass}`}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event detail */}
              <div className="border-t border-outline-variant pt-gutter space-y-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-code-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Detalle del Evento
                  </h3>
                  <span className="text-error font-code-mono text-[11px] font-bold">ID: log_33a7</span>
                </div>

                <div className="space-y-md">
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-code-mono text-[10px] font-bold text-outline uppercase">Service</label>
                      <p className="text-body-md font-medium mt-0.5">Agent Orchestrator</p>
                    </div>
                    <div>
                      <label className="font-code-mono text-[10px] font-bold text-outline uppercase">Level</label>
                      <p className="text-body-md font-medium text-error mt-0.5">CRITICAL ERROR</p>
                    </div>
                  </div>

                  <div>
                    <label className="font-code-mono text-[10px] font-bold text-outline uppercase">Message</label>
                    <p className="text-body-md mt-1 leading-tight text-on-surface">
                      Agent &apos;Market_Analyst&apos; terminated unexpectedly. Stack trace attached due to credit exhaustion on model GPT-4-32k.
                    </p>
                  </div>

                  <div>
                    <label className="font-code-mono text-[10px] font-bold text-outline uppercase">Trace ID</label>
                    <code className="block mt-1 bg-surface-container p-2 rounded font-code-mono text-[11px] text-secondary">
                      trc_9281-2291-xX881
                    </code>
                  </div>

                  <div>
                    <label className="font-code-mono text-[10px] font-bold text-outline uppercase">Stack Trace</label>
                    <pre className="mt-1 bg-slate-900 p-sm rounded-lg font-code-mono text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`File "agent_orchestrator.py", line 442, in run_agent
  res = self.llm_call(prompt)
File "llm_client.py", line 110, in call
  raise CreditExhaustionError("GPT-4-32k")`}
                    </pre>
                  </div>

                  <div className="flex gap-sm">
                    <button className="flex-1 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-sm text-sm">
                      <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                      Crear alerta
                    </button>
                    <button className="px-sm py-2 bg-white border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
    </>
  );
}
