"use client";

import { useState, useEffect } from "react";
import { fsGet, fsSet } from "@/lib/firebase/firestore-rest";

const ROLES = ["Editor", "Viewer", "Agente"] as const;
type Role = typeof ROLES[number];

interface Invitation {
  email: string;
  role: Role;
  status: "pending" | "accepted";
  createdAt: string;
}

interface TeamSectionProps {
  ownerName: string;
  ownerEmail: string;
  ownerPhoto: string | null;
  ownerInitials: string;
  orgId: string;
}

const ROLE_COLORS: Record<string, string> = {
  Administrador: "bg-secondary/10 text-secondary",
  Editor:        "bg-blue-100 text-blue-700",
  Viewer:        "bg-surface-container-high text-on-surface-variant",
  Agente:        "bg-purple-100 text-purple-700",
};

export default function TeamSection({ ownerName, ownerEmail, ownerPhoto, ownerInitials, orgId }: TeamSectionProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showForm, setShowForm]       = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState<Role>("Editor");
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [removing, setRemoving]       = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    fsGet("team_invitations", orgId).then((data) => {
      if (data?.invitations) {
        setInvitations(data.invitations as Invitation[]);
      }
    }).catch(() => {});
  }, [orgId]);

  const saveInvitations = async (list: Invitation[]) => {
    await fsSet("team_invitations", orgId, { invitations: list });
    setInvitations(list);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    if (email === ownerEmail) return;
    if (invitations.some((i) => i.email === email)) return;
    setSending(true);
    try {
      // Guardar en Firestore
      const newInv: Invitation = {
        email,
        role: inviteRole,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await saveInvitations([...invitations, newInv]);

      // Enviar correo vía API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/team/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: email,
          inviter_name: ownerName || ownerEmail,
          org_name: orgId,
          role: inviteRole,
          app_url: window.location.origin,
        }),
      });

      setInviteEmail("");
      setInviteRole("Editor");
      setShowForm(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } finally {
      setSending(false);
    }
  };

  const handleRemove = async (email: string) => {
    setRemoving(email);
    try {
      await saveInvitations(invitations.filter((i) => i.email !== email));
    } finally {
      setRemoving(null);
    }
  };

  const handleRoleChange = async (email: string, role: Role) => {
    const updated = invitations.map((i) => i.email === email ? { ...i, role } : i);
    await saveInvitations(updated);
  };

  const totalMembers = 1 + invitations.filter((i) => i.status === "accepted").length;
  const pendingCount = invitations.filter((i) => i.status === "pending").length;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h3 className="font-title-md font-semibold text-on-surface">
            Equipo
            <span className="ml-sm px-sm py-0.5 bg-surface-container text-on-surface-variant text-[11px] font-bold rounded-full">
              {totalMembers} activo{totalMembers !== 1 ? "s" : ""}
              {pendingCount > 0 && ` · ${pendingCount} pendiente${pendingCount !== 1 ? "s" : ""}`}
            </span>
          </h3>
          <p className="font-code-mono text-xs text-on-surface-variant mt-xs">
            Gestiona quién tiene acceso a tu organización
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-xs px-md py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? "close" : "person_add"}</span>
          {showForm ? "Cancelar" : "Invitar miembro"}
        </button>
      </div>

      {/* Formulario de invitación */}
      {showForm && (
        <form onSubmit={handleInvite} className="mb-lg p-md bg-secondary/5 border border-secondary/20 rounded-xl space-y-md">
          <h4 className="font-semibold text-on-surface">Nueva invitación</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="md:col-span-2 space-y-xs">
              <label className="font-code-mono text-xs text-on-surface-variant font-bold">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colaborador@empresa.com"
                className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-code-mono text-xs text-on-surface-variant font-bold">ROL</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm outline-none appearance-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-sm text-xs text-on-surface-variant font-code-mono">
            <div className="p-sm bg-surface-container rounded-lg">
              <p className="font-bold text-on-surface mb-xs">Editor</p>
              <p>Crea misiones, sube documentos y ve reportes</p>
            </div>
            <div className="p-sm bg-surface-container rounded-lg">
              <p className="font-bold text-on-surface mb-xs">Viewer</p>
              <p>Solo lectura — ve reportes y resultados</p>
            </div>
            <div className="p-sm bg-surface-container rounded-lg">
              <p className="font-bold text-on-surface mb-xs">Agente</p>
              <p>Acceso técnico para configurar agentes IA</p>
            </div>
          </div>
          <div className="flex justify-end gap-md">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-bold">
              Cancelar
            </button>
            <button type="submit" disabled={sending}
              className="px-md py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-sm disabled:opacity-60">
              {sending && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
              Enviar invitación
            </button>
          </div>
        </form>
      )}

      {/* Mensaje de éxito */}
      {sent && (
        <div className="mb-md p-md bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-md text-emerald-700">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-bold">Invitación registrada correctamente.</p>
        </div>
      )}

      {/* Lista de miembros */}
      <div className="space-y-xs">
        {/* Owner */}
        <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-md">
            {ownerPhoto ? (
              <img src={ownerPhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-xs">
                {ownerInitials}
              </div>
            )}
            <div>
              <p className="font-bold text-on-surface">{ownerName || "—"}</p>
              <p className="font-code-mono text-xs text-on-surface-variant">{ownerEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <span className="flex items-center gap-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-code-mono text-xs text-emerald-600">Activo</span>
            </span>
            <span className={`px-sm py-0.5 text-[10px] font-bold rounded-full ${ROLE_COLORS["Administrador"]}`}>
              Administrador
            </span>
          </div>
        </div>

        {/* Invitaciones */}
        {invitations.map((inv) => {
          const inv_initials = inv.email.slice(0, 2).toUpperCase();
          return (
            <div key={inv.email} className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant text-xs">
                  {inv_initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{inv.email}</p>
                  <p className="font-code-mono text-xs text-on-surface-variant">
                    Invitado el {new Date(inv.createdAt).toLocaleDateString("es-CO")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className={`flex items-center gap-xs px-xs py-0.5 rounded-full text-[10px] font-bold ${
                  inv.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${inv.status === "pending" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  {inv.status === "pending" ? "Pendiente" : "Activo"}
                </span>
                <select
                  value={inv.role}
                  onChange={(e) => handleRoleChange(inv.email, e.target.value as Role)}
                  className="text-[11px] font-bold border border-outline-variant rounded-lg px-sm py-0.5 outline-none bg-surface-container-lowest appearance-none cursor-pointer"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  onClick={() => handleRemove(inv.email)}
                  disabled={removing === inv.email}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error/10 p-xs rounded-lg"
                  title="Eliminar invitación"
                >
                  {removing === inv.email
                    ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    : <span className="material-symbols-outlined text-[18px]">person_remove</span>
                  }
                </button>
              </div>
            </div>
          );
        })}

        {/* Botón invitar si no hay form */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full border-2 border-dashed border-outline-variant rounded-lg p-md text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all flex items-center justify-center gap-sm mt-sm"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span className="font-bold">Invitar nuevo miembro</span>
          </button>
        )}
      </div>
    </section>
  );
}
