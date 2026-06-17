"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { icon: "group", label: "CRM", href: "/admin/crm" },
  { icon: "dns", label: "Infraestructura", href: "/admin/infraestructura" },
  { icon: "psychology", label: "Modelos", href: "/admin/modelos-costos" },
  { icon: "monetization_on", label: "Costos", href: "/admin/modelos-costos" },
  { icon: "notification_important", label: "Alertas", href: "/admin/alertas" },
];

// ── Kanban data ──────────────────────────────────────────────────────────────

type Card = {
  id: string;
  tag: string;
  temp: "hot" | "warm" | "none";
  title: string;
  desc: string;
  extra?: React.ReactNode;
  dark?: boolean;
  favorite?: boolean;
  borderLeft?: boolean;
  progress?: { label: string; pct: number };
  value?: string;
  initials?: string[];
  timeLabel?: string;
  demoTime?: string;
  whatsapp?: boolean;
  avatar?: string;
  avatarAlt?: string;
  ownerAvatar?: string;
  ownerAlt?: string;
  subLabel?: string;
};

type Column = {
  id: string;
  label: string;
  count: number;
  cards: Card[];
};

const INITIAL_COLUMNS: Column[] = [
  {
    id: "nuevo",
    label: "Nuevo prospecto",
    count: 8,
    cards: [
      {
        id: "falabella",
        tag: "Retail",
        temp: "hot",
        title: "Tiendas Falabella",
        desc: "Automatización de stock regional",
        timeLabel: "Hace 2h",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBgCe0sz8zwxXKch-4xOztkGLVqZMEx3tUYoqjlXOeLBl4-AUehxZyAxqnNeXdA-nAkDwGIT4q96MJa-t0YKzFAVlnGaJJYYVYC46WUPmWcL4xjwwkugB-19RlMvM1qq6QkYwbqA9WruUQJMutzZi88YlkGAgYXHLsnWvSnvgZUbQByDA-nxlPcMgrHcZtTipP8XWqCgo8qurQc6w5WHC8xceYpgsaqiyrBOpmiuSkYgNV5mDx8ZwYuMDTxLl0_WHjsL0ZWMgiuMBQ",
        avatarAlt: "Ejecutivo prospecto",
      },
      {
        id: "transportes",
        tag: "Logística",
        temp: "warm",
        title: "Transportes Rápidos",
        desc: "Optimización de rutas IA",
        timeLabel: "Hace 5h",
      },
    ],
  },
  {
    id: "demo",
    label: "Demo agendada",
    count: 4,
    cards: [
      {
        id: "bcp",
        tag: "Banca",
        temp: "hot",
        title: "Banco BCP",
        desc: "IA Conversacional para soporte",
        whatsapp: true,
        demoTime: "Mañana 10:00 AM",
        ownerAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDdaSf3zJ0cYnDopbV1SZBaeyt_gifspXp0qlhoQGrSehR-Lw2kxorhDkDEbwzX0Pfxsw1uzkX93VloPjOtu6ZNDodbS7r5CutAFPorz8u5HWe2xX5A0_GI_-4MRh_OohwU0DMnhVWHeANZjVpTJetHE0zzglK_fBsHDaV_EkrxuGF3xoC1ak5t-0-gZdrO4ka8_2ap1rgaa2OjQ_LCacYoZNpbpSllNqYvds5Dt40QfA0dl3kGqu2f1BrnPlIjFdOt-aAqBP-3VIc",
        ownerAlt: "Ejecutiva asignada",
      },
      {
        id: "mercadolibre",
        tag: "E-commerce",
        temp: "warm",
        title: "Mercado Libre",
        desc: "Análisis de sentimientos masivo",
        timeLabel: "Viernes 4:30 PM",
      },
    ],
  },
  {
    id: "prueba",
    label: "Prueba activa",
    count: 3,
    cards: [
      {
        id: "platzi",
        tag: "Educación",
        temp: "warm",
        title: "Platzi Corp",
        desc: "Curación de contenido por IA",
        borderLeft: true,
        progress: { label: "Día 7 de 14", pct: 50 },
      },
    ],
  },
  {
    id: "estrategico",
    label: "Cliente estratégico",
    count: 12,
    cards: [
      {
        id: "petrobras",
        tag: "Energy",
        temp: "hot",
        title: "Petrobras Regional",
        desc: "Contrato Master de Infraestructura IA",
        dark: true,
        favorite: true,
        value: "$850k/año",
        initials: ["V", "M"],
      },
      {
        id: "gnp",
        tag: "Seguros",
        temp: "hot",
        title: "GNP Seguros",
        desc: "Análisis de riesgo predictivo",
        favorite: true,
        subLabel: "Cuenta Clave",
        timeLabel: "Renovación en 45d",
      },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function CRMPage() {
  const pathname = usePathname();
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [showToast, setShowToast] = useState(false);
  const [draggedCard, setDraggedCard] = useState<{ card: Card; fromCol: string } | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToastMsg = () => {
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  };

  const onDragStart = (card: Card, colId: string) => {
    setDraggedCard({ card, fromCol: colId });
    setDraggingCardId(card.id);
  };

  const onDrop = (toColId: string) => {
    if (!draggedCard || draggedCard.fromCol === toColId) return;
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === draggedCard.fromCol) {
          return { ...col, cards: col.cards.filter((c) => c.id !== draggedCard.card.id) };
        }
        if (col.id === toColId) {
          return { ...col, cards: [...col.cards, draggedCard.card] };
        }
        return col;
      })
    );
    showToastMsg();
    setDraggedCard(null);
    setDraggingCardId(null);
  };

  const tempDot = (temp: Card["temp"]) => {
    if (temp === "hot") return "bg-error";
    if (temp === "warm") return "bg-secondary-container";
    return "bg-outline-variant";
  };

  const renderCard = (card: Card, colId: string) => {
    const isDragging = draggingCardId === card.id;

    if (card.dark) {
      return (
        <div
          key={card.id}
          draggable
          onDragStart={() => onDragStart(card, colId)}
          onDragEnd={() => setDraggingCardId(null)}
          className={`bg-primary-container p-md rounded-lg shadow-md border border-on-tertiary-container/30 cursor-grab active:cursor-grabbing transition-all active:scale-95 ${
            isDragging ? "opacity-50" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-sm">
            <span className="text-[10px] uppercase font-bold tracking-tighter text-secondary-fixed bg-secondary-container px-2 py-0.5 rounded">
              {card.tag}
            </span>
            {card.favorite && (
              <span
                className="material-symbols-outlined text-error"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
              >
                favorite
              </span>
            )}
          </div>
          <h4 className="font-title-md text-title-md text-white mb-xs">{card.title}</h4>
          <p className="text-outline-variant text-sm mb-md">{card.desc}</p>
          <div className="flex justify-between items-center">
            {card.value && (
              <div className="bg-secondary-container/20 text-secondary-fixed px-3 py-1 rounded-full text-[11px] font-bold">
                Valor: {card.value}
              </div>
            )}
            {card.initials && (
              <div className="flex -space-x-1">
                {card.initials.map((ini, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                      i === 0 ? "bg-secondary" : "bg-on-tertiary-container"
                    }`}
                  >
                    {ini}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={card.id}
        draggable
        onDragStart={() => onDragStart(card, colId)}
        onDragEnd={() => setDraggingCardId(null)}
        className={`glass-card p-md rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-secondary transition-all ${
          card.borderLeft ? "border-l-4 border-l-secondary" : ""
        } ${isDragging ? "opacity-50" : ""}`}
      >
        <div className="flex justify-between items-start mb-sm">
          <span className="text-[10px] uppercase font-bold tracking-tighter text-on-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded">
            {card.tag}
          </span>
          {card.favorite ? (
            <span
              className="material-symbols-outlined text-error"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
            >
              favorite
            </span>
          ) : (
            <div className={`w-3 h-3 rounded-full ${tempDot(card.temp)}`} />
          )}
        </div>

        <h4 className="font-title-md text-title-md text-primary mb-xs">{card.title}</h4>
        <p className="text-on-surface-variant text-sm mb-md">{card.desc}</p>

        {/* WhatsApp + Demo time */}
        {card.whatsapp && (
          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-sm text-[#25D366]">
              <span className="material-symbols-outlined text-sm">chat</span>
              <span className="text-[11px] font-bold">Contactar por WhatsApp</span>
            </div>
            <div className="flex justify-between items-center pt-sm border-t border-outline-variant">
              <span className="text-xs font-medium text-secondary">{card.demoTime}</span>
              {card.ownerAvatar && (
                <Image
                  src={card.ownerAvatar}
                  alt={card.ownerAlt ?? "Asignado"}
                  width={24}
                  height={24}
                  className="rounded-full border-2 border-white object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {card.progress && (
          <div className="space-y-xs">
            <div className="flex justify-between items-center mb-xs">
              <span className="font-label-sm text-label-sm text-outline">{card.progress.label}</span>
              <span className="font-label-sm text-label-sm text-secondary">{card.progress.pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full"
                style={{ width: `${card.progress.pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer row */}
        {!card.whatsapp && !card.progress && (
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {card.avatar && (
                <Image
                  src={card.avatar}
                  alt={card.avatarAlt ?? "Avatar"}
                  width={24}
                  height={24}
                  className="rounded-full border-2 border-white object-cover"
                />
              )}
            </div>
            <div className="flex justify-between items-center gap-md flex-1">
              {card.subLabel && (
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {card.subLabel}
                </span>
              )}
              {card.timeLabel && (
                <span className="font-label-sm text-label-sm text-outline ml-auto">
                  {card.timeLabel}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">

      {/* ── Admin Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-inverse-surface flex flex-col p-lg z-50">
        <div className="flex items-center gap-md mb-2xl">
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-secondary-container">psychology</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-secondary-fixed-dim leading-none">
              Admin Central
            </h1>
            <p className="font-label-sm text-label-sm text-outline-variant mt-xs">Control Maestro</p>
          </div>
        </div>
        <nav className="flex-grow space-y-sm">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-md p-md rounded-md transition-all ${
                  active
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-sm text-label-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant pt-lg">
          <Link
            href="#"
            className="flex items-center gap-md p-md text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant rounded-md transition-all"
          >
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label-sm text-label-sm">Logs del Sistema</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-grow ml-[260px] p-margin-desktop">

        {/* Header */}
        <header className="flex justify-between items-end mb-2xl">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant tracking-widest">
              AGENTHUB EMPRESARIAL
            </p>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-xs">
              Gestión de Pipeline Comercial
            </h2>
          </div>
          <div className="flex gap-md">
            <button
              type="button"
              className="bg-white border border-outline-variant px-lg py-md rounded-lg font-body-md text-primary hover:bg-surface-container transition-all flex items-center gap-sm"
            >
              <span className="material-symbols-outlined">download</span>
              Descargar Reporte
            </button>
            <button
              type="button"
              className="bg-secondary text-on-secondary px-lg py-md rounded-lg font-body-md hover:opacity-90 transition-all flex items-center gap-sm shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              Crear Nuevo Prospecto
            </button>
          </div>
        </header>

        {/* Metrics Bar */}
        <section className="grid grid-cols-4 gap-lg mb-2xl">
          {[
            { label: "Pipeline Total", value: "$4.2M USD", icon: "trending_up", iconColor: "text-secondary" },
            { label: "Cierre Estimado", value: "24 Prospectos", icon: "calendar_month", iconColor: "text-on-tertiary-container" },
            { label: "Tasa de Conversión", value: "18.5%", icon: "insights", iconColor: "text-secondary" },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex justify-between items-center"
            >
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{m.label}</p>
                <p className="font-headline-md text-headline-md text-primary">{m.value}</p>
              </div>
              <span className={`material-symbols-outlined text-3xl ${m.iconColor}`}>{m.icon}</span>
            </div>
          ))}
          {/* Credits card with bar */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex justify-between items-center">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Créditos IA Usados</p>
              <div className="flex items-center gap-sm mt-xs">
                <div className="w-24 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-secondary" />
                </div>
                <span className="font-label-sm text-label-sm">75%</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-3xl">bolt</span>
          </div>
        </section>

        {/* ── Kanban Board ── */}
        <div className="flex gap-lg overflow-x-auto pb-lg">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex-shrink-0 w-80"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-md px-sm">
                <h3 className="font-title-md text-title-md text-primary flex items-center gap-sm">
                  {col.label}
                  <span className="bg-surface-container-highest text-on-surface-variant text-[12px] px-2 py-0.5 rounded-full">
                    {col.count}
                  </span>
                </h3>
                <button
                  type="button"
                  className="text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>

              {/* Column body */}
              <div
                className="space-y-md bg-surface-container-low p-sm rounded-xl"
                style={{ minHeight: "calc(100vh - 200px)" }}
              >
                {col.cards.map((card) => renderCard(card, col.id))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Toast */}
      <div
        className={`fixed bottom-margin-desktop right-[calc(theme(spacing.margin-desktop)+4rem+theme(spacing.md))] bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-lg shadow-xl flex items-center gap-md z-[100] transition-all duration-300 ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        }`}
      >
        <span className="material-symbols-outlined text-secondary-fixed-dim">check_circle</span>
        <p className="font-body-md text-body-md">Prospecto movido exitosamente</p>
      </div>

      {/* FAB */}
      <button
        type="button"
        className="fixed bottom-margin-desktop right-margin-desktop w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">
          auto_awesome
        </span>
        <div className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-md py-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-label-sm">
          Optimizar Pipeline con Agente
        </div>
      </button>
    </div>
  );
}
