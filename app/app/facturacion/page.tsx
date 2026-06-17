"use client";

import Link from "next/link";
import { useState } from "react";

const PLAN_FEATURES = [
  "20,000 créditos/mes",
  "Acceso completo agentes",
  "4 usuarios",
  "Soporte prioritario",
];

const PACKS = [
  { id: "starter", label: "Starter Pack", credits: "5,000 créditos", price: "$19", rate: "$0.0038 / crédito", featured: false },
  { id: "growth", label: "Growth Pack", credits: "15,000 créditos", price: "$49", rate: "$0.0032 / crédito", featured: true },
  { id: "scale", label: "Scale Pack", credits: "50,000 créditos", price: "$149", rate: "$0.0029 / crédito", featured: false },
];

type InvoiceStatus = "pagado" | "pendiente";
const INVOICES: { date: string; desc: string; amount: string; status: InvoiceStatus }[] = [
  { date: "Oct 01, 2023", desc: "Plan Empresarial Pro", amount: "$299.00", status: "pagado" },
  { date: "Sep 15, 2023", desc: "Recarga Growth Pack", amount: "$49.00", status: "pagado" },
  { date: "Sep 01, 2023", desc: "Plan Empresarial Pro", amount: "$299.00", status: "pagado" },
  { date: "Ago 20, 2023", desc: "Ajuste de Créditos", amount: "$12.50", status: "pendiente" },
  { date: "Ago 01, 2023", desc: "Plan Empresarial Pro", amount: "$299.00", status: "pagado" },
  { date: "Jul 01, 2023", desc: "Plan Empresarial Pro", amount: "$299.00", status: "pagado" },
];

export default function FacturacionPage() {
  const [page, setPage] = useState(1);
  const totalPages = 4;

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
        {/* Top bar */}
        <header className="w-full h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-margin-desktop">
          <div className="flex flex-col">
            <h2 className="font-bold text-xl text-primary leading-tight">Facturación</h2>
            <p className="text-on-surface-variant text-body-md">Gestiona tu plan y pagos</p>
          </div>
          <div className="flex items-center gap-md">
            <button className="px-lg py-sm border border-outline rounded-lg text-on-surface text-body-md hover:bg-surface-container transition-colors active:scale-95">
              Descargar facturas
            </button>
            <button className="px-lg py-sm bg-secondary text-white rounded-lg text-body-md hover:opacity-90 transition-all active:scale-95">
              Comprar Créditos
            </button>
            <div className="flex items-center gap-sm ml-md">
              <button className="p-xs text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-xs text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-margin-desktop space-y-2xl max-w-[1200px] mx-auto w-full">
          {/* 1. Plan card */}
          <section
            className="relative overflow-hidden rounded-xl p-xl text-white shadow-xl"
            style={{ background: "linear-gradient(135deg, #131b2e 0%, #0058be 100%)" }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-xl">
                <div>
                  <span className="px-md py-xs bg-white/10 rounded-full font-code-mono text-xs uppercase tracking-wider mb-sm inline-block">
                    Plan Empresarial Pro
                  </span>
                  <div className="flex items-baseline gap-sm">
                    <h3 className="font-code-mono text-5xl font-bold">$299 USD</h3>
                    <span className="opacity-80 text-body-lg">/ mes</span>
                  </div>
                  <p className="mt-xs text-white/70 text-body-md">Facturación anual activa (15% ahorro incluido)</p>
                </div>
                <div className="flex flex-col gap-sm items-end">
                  <button className="px-lg py-sm border border-white/40 rounded-lg text-body-md hover:bg-white/10 transition-colors">
                    Cambiar plan
                  </button>
                  <button className="text-white/60 text-sm hover:text-white transition-colors">
                    Cancelar suscripción
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-end">
                <div className="space-y-md">
                  <div className="flex justify-between font-code-mono text-xs uppercase tracking-widest text-white/80">
                    <span>Créditos incluidos</span>
                    <span>8,420 / 20,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "42.1%" }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-sm justify-end">
                  {PLAN_FEATURES.map((f) => (
                    <div key={f} className="px-md py-sm rounded-lg flex items-center gap-xs" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="font-code-mono text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Credit packs */}
          <section className="space-y-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-primary">Recargas de Créditos</h3>
              <span className="text-on-surface-variant text-body-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">info</span>
                Los créditos adicionales no expiran
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {PACKS.map(({ id, label, credits, price, rate, featured }) => (
                <div
                  key={id}
                  className={`relative bg-surface-container-lowest p-lg rounded-xl flex flex-col justify-between transition-all ${
                    featured
                      ? "border-2 border-secondary ring-4 ring-secondary/5"
                      : "border border-outline-variant hover:border-secondary/30"
                  }`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)" }}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-md py-xs bg-secondary text-white font-code-mono text-xs font-bold rounded-full">
                      MÁS POPULAR
                    </div>
                  )}
                  <div>
                    <p className="font-code-mono text-xs text-on-surface-variant uppercase mb-xs">{label}</p>
                    <h4 className="font-bold text-xl text-primary mb-md">{credits}</h4>
                    <div className="flex items-baseline gap-xs mb-lg">
                      <span className="font-bold text-5xl text-primary">{price}</span>
                      <span className="font-code-mono text-xs text-on-surface-variant">USD</span>
                    </div>
                    <div className="font-code-mono text-xs text-on-surface-variant bg-surface-container px-sm py-xs rounded inline-block">
                      {rate}
                    </div>
                  </div>
                  <button
                    className={`mt-xl w-full py-md rounded-lg font-medium transition-all ${
                      featured
                        ? "bg-secondary text-white hover:opacity-90 shadow-lg shadow-secondary/20"
                        : "border border-outline text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    Comprar ahora
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Two-col: invoices + payment */}
          <section className="grid grid-cols-1 lg:grid-cols-10 gap-2xl">
            {/* Invoice history */}
            <div className="lg:col-span-6 space-y-lg">
              <h3 className="font-bold text-xl text-primary">Historial de Facturas</h3>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-left">
                      {["Fecha", "Descripción", "Monto", "Estado", ""].map((h) => (
                        <th key={h} className="px-lg py-md font-code-mono text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {INVOICES.map(({ date, desc, amount, status }) => (
                      <tr key={date + desc} className="hover:bg-surface-container-low transition-colors h-[56px]">
                        <td className="px-lg py-md font-code-mono text-body-md">{date}</td>
                        <td className="px-lg py-md text-body-md text-primary font-medium">{desc}</td>
                        <td className="px-lg py-md font-code-mono font-bold text-primary">{amount}</td>
                        <td className="px-lg py-md">
                          <span className={`px-sm py-xs rounded-full text-xs font-bold uppercase tracking-tighter ${
                            status === "pagado"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {status === "pagado" ? "Pagado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-lg py-md text-center">
                          {status === "pagado" ? (
                            <button className="p-xs text-secondary hover:bg-secondary/10 rounded transition-colors">
                              <span className="material-symbols-outlined">download</span>
                            </button>
                          ) : (
                            <button className="p-xs text-on-surface-variant opacity-30 cursor-not-allowed" disabled>
                              <span className="material-symbols-outlined">download</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-lg py-md bg-surface-container flex justify-between items-center text-on-surface-variant text-body-md">
                  <span>Mostrando 6 de 24 facturas</span>
                  <div className="flex items-center gap-sm">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="p-xs hover:bg-white rounded transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="px-md font-code-mono text-xs">Página {page} de {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="p-xs hover:bg-white rounded transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: payment method + billing data */}
            <div className="lg:col-span-4 space-y-xl">
              {/* Credit card */}
              <div className="space-y-lg">
                <h3 className="font-bold text-xl text-primary">Método de Pago</h3>
                <div
                  className="relative rounded-xl p-lg text-white shadow-lg overflow-hidden h-[200px] flex flex-col justify-between"
                  style={{ background: "linear-gradient(135deg, #1b1b1d 0%, #3f465c 100%)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-code-mono text-[10px] opacity-60 uppercase">Titular</span>
                      <span className="text-body-lg">LogiCorp S.A.S.</span>
                    </div>
                    <div className="h-8 w-12 bg-white/20 rounded flex items-center justify-center font-bold italic text-sm">VISA</div>
                  </div>
                  <div className="space-y-sm">
                    <p className="font-code-mono text-xl tracking-[0.2em] flex gap-md">
                      <span>••••</span><span>••••</span><span>••••</span><span>4242</span>
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="font-code-mono text-[10px] opacity-60 uppercase">Expira</span>
                        <span className="font-code-mono">12/26</span>
                      </div>
                      <div className="h-10 w-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <div className="h-6 w-6 bg-yellow-400 rounded-full animate-pulse opacity-50" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                </div>
                <div className="flex gap-md">
                  <button className="flex-1 py-sm bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg text-body-md hover:bg-outline-variant transition-colors">
                    Cambiar tarjeta
                  </button>
                  <button className="flex-1 py-sm border border-outline text-on-surface rounded-lg text-body-md hover:bg-surface-container transition-colors flex items-center justify-center gap-xs">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Agregar
                  </button>
                </div>
              </div>

              {/* Billing data */}
              <div className="space-y-lg">
                <h3 className="font-bold text-xl text-primary">Datos de Facturación</h3>
                <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl space-y-md" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  {[
                    { icon: "corporate_fare", label: "Empresa", value: "LogiCorp S.A.S.", mono: false },
                    { icon: "fingerprint", label: "NIT / ID Fiscal", value: "900.123.456-7", mono: true },
                    { icon: "mail", label: "Correo de facturación", value: "billing@logicorp.ai", mono: false },
                  ].map(({ icon, label, value, mono }) => (
                    <div key={label} className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-on-surface-variant mt-xs">{icon}</span>
                      <div>
                        <p className="font-code-mono text-xs text-on-surface-variant uppercase">{label}</p>
                        <p className={`${mono ? "font-code-mono text-body-md" : "font-bold text-body-lg"} text-primary`}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-md border-t border-outline-variant">
                    <a href="#" className="text-secondary font-bold text-body-md flex items-center gap-xs hover:underline">
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Editar datos fiscales
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="h-xl" />
    </div>
  );
}
