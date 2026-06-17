"use client";

import { useState, useEffect, useRef } from "react";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { fsGet, fsSet } from "@/lib/firebase/firestore-rest";
import { useAuth } from "@/app/providers";
import TeamSection from "./TeamSection";

const SETTINGS_NAV = [
  { id: "perfil",         icon: "person",                  label: "Perfil" },
  { id: "equipo",         icon: "group",                   label: "Equipo" },
  { id: "notificaciones", icon: "notifications",           label: "Notificaciones" },
  { id: "seguridad",      icon: "security",                label: "Seguridad" },
  { id: "api",            icon: "api",                     label: "Integraciones API" },
  { id: "facturacion",    icon: "account_balance_wallet",  label: "Facturación" },
];

type NotifKey = "mision" | "creditos" | "reportes" | "sistema";

const NOTIF_ITEMS: { key: NotifKey; title: string; desc: string; defaultOn: boolean }[] = [
  { key: "mision",   title: "Misión completada",           desc: "Recibe un correo cuando un agente finaliza una misión.", defaultOn: true },
  { key: "creditos", title: "Alerta de créditos bajos",    desc: "Notificar cuando el balance sea inferior al 10%.",       defaultOn: true },
  { key: "reportes", title: "Nuevos reportes",             desc: "Aviso semanal sobre reportes de rendimiento.",           defaultOn: true },
  { key: "sistema",  title: "Actualizaciones del sistema", desc: "Nuevas funcionalidades y cambios técnicos.",             defaultOn: false },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${on ? "bg-secondary" : "bg-outline-variant"}`}>
      <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200"
        style={on ? { right: "4px" } : { left: "4px" }} />
    </button>
  );
}

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState("perfil");
  const [loading,  setLoading]  = useState(true);
  const [isDirty,  setIsDirty]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  // Cambio de contraseña
  const [showPwdForm, setShowPwdForm]   = useState(false);
  const [pwdCurrent, setPwdCurrent]     = useState("");
  const [pwdNew, setPwdNew]             = useState("");
  const [pwdConfirm, setPwdConfirm]     = useState("");
  const [pwdSaving, setPwdSaving]       = useState(false);
  const [pwdError, setPwdError]         = useState("");
  const [pwdOk, setPwdOk]               = useState(false);
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (pwdNew.length < 6) { setPwdError("La nueva contraseña debe tener al menos 6 caracteres."); return; }
    if (pwdNew !== pwdConfirm) { setPwdError("Las contraseñas no coinciden."); return; }
    if (!user?.email) return;
    setPwdSaving(true);
    try {
      const { auth } = await import("@/lib/firebase/config");
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error("Sin sesión");
      const credential = EmailAuthProvider.credential(currentUser.email, pwdCurrent);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, pwdNew);
      setPwdOk(true);
      setPwdCurrent(""); setPwdNew(""); setPwdConfirm("");
      setShowPwdForm(false);
      setTimeout(() => setPwdOk(false), 4000);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setPwdError("La contraseña actual es incorrecta.");
      } else if (code === "auth/too-many-requests") {
        setPwdError("Demasiados intentos. Intenta más tarde.");
      } else {
        setPwdError("Error al cambiar la contraseña. Intenta de nuevo.");
      }
    } finally {
      setPwdSaving(false);
    }
  };
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<Record<NotifKey, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.key, n.defaultOn])) as Record<NotifKey, boolean>
  );

  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", empresa: "", ciudad: "", industria: "", nit: "",
  });

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.displayName?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "??";

  // Carga datos desde Firebase Auth + Firestore
  useEffect(() => {
    if (!user) return;

    // Datos inmediatos desde Firebase Auth
    setPhotoUrl(user.photoURL ?? null);
    setProfile((p) => ({
      ...p,
      name:  user.displayName ?? "",
      email: user.email ?? "",
    }));

    // Datos desde Firestore
    const load = async () => {
      try {
        const u = await fsGet("users", user.uid);
        if (u) {
          setProfile((p) => ({
            ...p,
            name:  String(u.name  ?? p.name),
            email: String(u.email ?? p.email),
            phone: String(u.phone ?? ""),
          }));
          const orgId = u.organizationId as string;
          if (orgId) {
            const o = await fsGet("organizations", orgId);
            if (o) {
              setProfile((p) => ({
                ...p,
                empresa:   String(o.name       ?? ""),
                ciudad:    String(o.city       ?? ""),
                industria: String(o.industryId ?? ""),
                nit:       String(o.nit        ?? ""),
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const set = (field: string, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setIsDirty(true);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhotoUploading(true);
    try {
      const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const token = await user.getIdToken();
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=avatars%2F${user.uid}`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
      const { name } = await uploadRes.json();
      const encodedName = encodeURIComponent(name);
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedName}?alt=media`;
      await updateProfile(user, { photoURL: downloadUrl });
      setPhotoUrl(downloadUrl);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error subiendo foto: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) { alert("NO USER - no hay sesión"); return; }
    setSaving(true);
    setSaveError("");
    try {
      await updateProfile(user, { displayName: profile.name });

      const orgId = `org_${user.uid}`;

      await fsSet("users", user.uid, {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        role: "owner",
        organizationId: orgId,
      });

      await fsSet("organizations", orgId, {
        name: profile.empresa,
        city: profile.ciudad,
        industryId: profile.industria,
        nit: profile.nit,
        ownerId: user.uid,
        country: "Colombia",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error guardando:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setSaveError(msg);
      alert("ERROR: " + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden flex flex-col min-h-screen">

      {/* Top bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant px-margin-desktop py-sm flex justify-between items-center">
        <div>
          <h2 className="font-headline-md font-semibold text-on-surface">Configuración</h2>
          <p className="text-body-md text-on-surface-variant">Gestiona tu cuenta y preferencias</p>
        </div>
        <button
          disabled={saving}
          onClick={handleSave}
          className={`px-lg py-sm font-bold rounded-lg transition-all flex items-center gap-sm ${
            saved   ? "bg-emerald-600 text-white" :
            saving  ? "bg-outline-variant/30 text-on-surface-variant cursor-not-allowed" :
                      "bg-secondary text-white hover:opacity-90 cursor-pointer"
          }`}
        >
          {saving && <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>}
          {saved  && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
          {saved ? "Guardado" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </header>

      <main className="flex-1 p-margin-desktop flex gap-xl max-w-[1440px]">

        {/* Left nav */}
        <nav className="w-[200px] flex-shrink-0">
          <div className="bg-surface-container-low rounded-xl p-md flex flex-col gap-xs sticky top-[100px]">
            {SETTINGS_NAV.map(({ id, icon, label }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-sm p-sm rounded-lg transition-all text-left ${
                    isActive
                      ? "bg-secondary/10 text-secondary border-l-2 border-secondary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {icon}
                  </span>
                  <span className="text-body-md">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 max-w-[800px] space-y-lg pb-2xl">

          {/* PERFIL */}
          {activeSection === "perfil" && <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-md font-semibold text-on-surface mb-lg">Perfil de Empresa</h3>

            {loading && (
              <div className="space-y-md animate-pulse mb-xl">
                <div className="flex items-center gap-lg">
                  <div className="w-20 h-20 rounded-full bg-surface-container-high" />
                  <div className="space-y-sm flex-1">
                    <div className="h-4 bg-surface-container-high rounded w-1/3" />
                    <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-lg">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-xs">
                      <div className="h-3 bg-surface-container-high rounded w-1/3" />
                      <div className="h-10 bg-surface-container-high rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avatar con upload */}
            <div className="flex items-center gap-lg mb-xl">
              <div className="relative flex-shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto de perfil"
                    className="w-20 h-20 rounded-full object-cover border-2 border-outline-variant" />
                ) : (
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-outline-variant rounded-full flex items-center justify-center shadow-sm hover:bg-surface-container-high transition-colors"
                  title="Cambiar foto"
                >
                  {photoUploading
                    ? <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    : <span className="material-symbols-outlined text-[16px]">camera_alt</span>
                  }
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handlePhotoChange} />
              </div>
              <div>
                <div className="flex items-center gap-sm mb-xs">
                  <h4 className="font-semibold text-on-surface">{profile.name || "—"}</h4>
                  <span className="px-sm py-0.5 bg-secondary/10 text-secondary text-[11px] font-bold rounded-full uppercase">
                    Administrador
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mb-sm">{profile.email}</p>
                <button onClick={() => fileInputRef.current?.click()}
                  className="text-secondary text-body-md font-bold hover:underline">
                  {photoUrl ? "Cambiar foto" : "Subir foto"}
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Nombre completo</label>
                  <input type="text" value={profile.name} onChange={(e) => set("name", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                </div>
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Empresa</label>
                  <input type="text" value={profile.empresa} onChange={(e) => set("empresa", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                </div>
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Teléfono / WhatsApp</label>
                  <input type="tel" value={profile.phone} onChange={(e) => set("phone", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                </div>
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Ciudad</label>
                  <input type="text" value={profile.ciudad} onChange={(e) => set("ciudad", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                </div>
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Email corporativo</label>
                  <div className="relative">
                    <input type="email" value={profile.email} readOnly
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm pr-24 outline-none text-on-surface-variant cursor-not-allowed" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-sm py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> VERIFIED
                    </span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-code-mono text-xs text-on-surface-variant font-bold">Sector / Industria</label>
                  <input type="text" value={profile.industria} onChange={(e) => set("industria", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                </div>
              </div>

              <div className="pt-lg border-t border-outline-variant">
                <h4 className="font-semibold text-on-surface mb-md">Datos fiscales</h4>
                <div className="grid grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-code-mono text-xs text-on-surface-variant font-bold">NIT / Tax ID</label>
                    <input type="text" value={profile.nit} onChange={(e) => set("nit", e.target.value)}
                      placeholder="900.123.456-7"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-code-mono text-xs text-on-surface-variant font-bold">País</label>
                    <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm outline-none appearance-none">
                      <option>Colombia</option>
                      <option>México</option>
                      <option>Argentina</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </section>}

          {/* EQUIPO */}
          {activeSection === "equipo" && (
            <TeamSection
              ownerName={profile.name}
              ownerEmail={profile.email}
              ownerPhoto={photoUrl}
              ownerInitials={initials}
              orgId={user ? `org_${user.uid}` : ""}
            />
          )}

          {/* NOTIFICACIONES */}
          {activeSection === "notificaciones" && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-md font-semibold text-on-surface mb-lg">Preferencias de Notificación</h3>
            <div className="space-y-lg">
              {NOTIF_ITEMS.map(({ key, title, desc }) => (
                <div key={key} className="flex items-center justify-between gap-lg">
                  <div>
                    <p className="font-bold text-on-surface">{title}</p>
                    <p className="text-body-md text-on-surface-variant">{desc}</p>
                  </div>
                  <Toggle on={notifications[key]} onChange={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} />
                </div>
              ))}
            </div>
          </section>
          )}

          {/* SEGURIDAD */}
          {activeSection === "seguridad" && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-md font-semibold text-on-surface mb-lg">Seguridad</h3>
            <div className="space-y-xs">

              {/* Éxito */}
              {pwdOk && (
                <div className="flex items-center gap-md p-md bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 mb-sm">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="font-bold">Contraseña actualizada correctamente.</p>
                </div>
              )}

              {/* Botón abrir/cerrar */}
              <button
                onClick={() => { setShowPwdForm((v) => !v); setPwdError(""); }}
                className="w-full flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                  <span className="font-bold text-on-surface">Cambiar contraseña</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  {showPwdForm ? "expand_less" : "chevron_right"}
                </span>
              </button>

              {/* Formulario */}
              {showPwdForm && (
                <form onSubmit={handleChangePassword}
                  className="mx-md mb-sm p-md bg-surface-container-low border border-outline-variant rounded-xl space-y-md">

                  {/* Contraseña actual */}
                  <div className="space-y-xs">
                    <label className="font-code-mono text-xs text-on-surface-variant font-bold">CONTRASEÑA ACTUAL</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={pwdCurrent}
                        onChange={(e) => setPwdCurrent(e.target.value)}
                        placeholder="Tu contraseña actual"
                        className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm pr-10 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      />
                      <button type="button" onClick={() => setShowCurrent((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">{showCurrent ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Nueva contraseña */}
                  <div className="space-y-xs">
                    <label className="font-code-mono text-xs text-on-surface-variant font-bold">NUEVA CONTRASEÑA</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        minLength={6}
                        value={pwdNew}
                        onChange={(e) => setPwdNew(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-white border border-outline-variant rounded-lg px-md py-sm pr-10 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      />
                      <button type="button" onClick={() => setShowNew((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">{showNew ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {/* Indicador de fuerza */}
                    {pwdNew.length > 0 && (
                      <div className="flex gap-xs mt-xs">
                        {[1,2,3,4].map((lvl) => {
                          const strength = pwdNew.length >= 10 && /[A-Z]/.test(pwdNew) && /[0-9]/.test(pwdNew) && /[^A-Za-z0-9]/.test(pwdNew) ? 4
                            : pwdNew.length >= 8 && /[A-Z]/.test(pwdNew) && /[0-9]/.test(pwdNew) ? 3
                            : pwdNew.length >= 6 ? 2 : 1;
                          return <div key={lvl} className={`h-1 flex-1 rounded-full transition-colors ${lvl <= strength
                            ? strength === 1 ? "bg-error" : strength === 2 ? "bg-amber-400" : strength === 3 ? "bg-blue-400" : "bg-emerald-500"
                            : "bg-outline-variant"}`} />;
                        })}
                        <span className="font-code-mono text-[10px] text-on-surface-variant ml-xs">
                          {pwdNew.length < 6 ? "Muy corta" : pwdNew.length < 8 ? "Débil" : pwdNew.length < 10 ? "Buena" : "Fuerte"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirmar */}
                  <div className="space-y-xs">
                    <label className="font-code-mono text-xs text-on-surface-variant font-bold">CONFIRMAR CONTRASEÑA</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={pwdConfirm}
                        onChange={(e) => setPwdConfirm(e.target.value)}
                        placeholder="Repite la nueva contraseña"
                        className={`w-full bg-white border rounded-lg px-md py-sm pr-10 outline-none transition-all focus:ring-2 focus:ring-secondary/20 ${
                          pwdConfirm && pwdNew !== pwdConfirm ? "border-error focus:border-error" : "border-outline-variant focus:border-secondary"
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">{showConfirm ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {pwdConfirm && pwdNew !== pwdConfirm && (
                      <p className="font-code-mono text-xs text-error">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  {/* Error */}
                  {pwdError && (
                    <div className="flex items-center gap-sm p-sm bg-error/5 border border-error/20 rounded-lg text-error text-sm">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {pwdError}
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex justify-end gap-md pt-xs">
                    <button type="button" onClick={() => { setShowPwdForm(false); setPwdError(""); }}
                      className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container font-bold transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" disabled={pwdSaving}
                      className="px-md py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-sm disabled:opacity-60">
                      {pwdSaving && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                      Guardar nueva contraseña
                    </button>
                  </div>
                </form>
              )}

              {/* 2FA */}
              <div className="flex items-center justify-between p-md">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">security</span>
                  <div>
                    <p className="font-bold text-on-surface">Autenticación de dos factores</p>
                    <p className={`text-[11px] font-bold uppercase ${twoFactor ? "text-emerald-600" : "text-on-surface-variant"}`}>
                      {twoFactor ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>
                <Toggle on={twoFactor} onChange={() => setTwoFactor((v) => !v)} />
              </div>
            </div>
          </section>
          )}

          {/* FACTURACIÓN */}
          {activeSection === "facturacion" && <FacturacionSection />}

        </div>
      </main>
    </div>
  );
}

/* ─── Sección Facturación ─────────────────────────────────────── */

const PLANES = [
  {
    id: "starter",
    name: "Starter",
    price: "$149.000",
    period: "/ mes",
    usd: "~$35 USD",
    color: "border-outline-variant",
    badge: null,
    features: [
      "3 agentes IA activos",
      "5.000 créditos / mes",
      "Hasta 3 miembros de equipo",
      "Soporte por email",
      "Reportes básicos",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$399.000",
    period: "/ mes",
    usd: "~$95 USD",
    color: "border-secondary",
    badge: "Más popular",
    features: [
      "Agentes IA ilimitados",
      "20.000 créditos / mes",
      "Hasta 15 miembros de equipo",
      "Soporte prioritario",
      "Reportes avanzados + exports",
      "Integraciones API",
      "LLM personalizado",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "A la medida",
    period: "",
    usd: "Contáctanos",
    color: "border-outline-variant",
    badge: null,
    features: [
      "Todo lo de Pro",
      "Créditos ilimitados",
      "SLA garantizado",
      "Onboarding dedicado",
      "Factura electrónica",
      "Instancia privada (opcional)",
    ],
  },
];

function FacturacionSection() {
  const [interest, setInterest] = useState<string | null>(null);
  const [sent, setSent]         = useState(false);

  const handleInterest = (planId: string) => {
    setInterest(planId);
    setSent(false);
  };

  const handleNotify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  const creditos     = 1000;
  const creditosUsed = 0;
  const pct          = Math.round((creditosUsed / creditos) * 100);
  const vence        = new Date();
  vence.setDate(vence.getDate() + 30);

  return (
    <div className="space-y-lg">

      {/* Plan actual */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="flex items-start justify-between mb-lg">
          <div>
            <h3 className="font-title-md font-semibold text-on-surface">Plan actual</h3>
            <p className="font-code-mono text-xs text-on-surface-variant mt-xs">Fase de validación gratuita</p>
          </div>
          <span className="px-md py-xs bg-secondary/10 text-secondary font-bold text-xs rounded-full border border-secondary/20">
            VALIDACIÓN GRATUITA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <div className="p-md bg-surface-container rounded-xl">
            <p className="font-code-mono text-xs text-on-surface-variant mb-xs">CRÉDITOS DISPONIBLES</p>
            <p className="text-2xl font-bold text-on-surface">{(creditos - creditosUsed).toLocaleString("es-CO")}</p>
            <p className="font-code-mono text-xs text-on-surface-variant">de {creditos.toLocaleString("es-CO")} totales</p>
          </div>
          <div className="p-md bg-surface-container rounded-xl">
            <p className="font-code-mono text-xs text-on-surface-variant mb-xs">AGENTES ACTIVOS</p>
            <p className="text-2xl font-bold text-on-surface">0</p>
            <p className="font-code-mono text-xs text-on-surface-variant">de 3 incluidos</p>
          </div>
          <div className="p-md bg-surface-container rounded-xl">
            <p className="font-code-mono text-xs text-on-surface-variant mb-xs">VENCE EL</p>
            <p className="text-2xl font-bold text-on-surface">{vence.toLocaleDateString("es-CO", { day:"2-digit", month:"short" })}</p>
            <p className="font-code-mono text-xs text-on-surface-variant">{vence.getFullYear()}</p>
          </div>
        </div>

        {/* Barra de créditos */}
        <div className="space-y-xs">
          <div className="flex justify-between font-code-mono text-xs text-on-surface-variant">
            <span>Uso de créditos</span>
            <span>{pct}% usado</span>
          </div>
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {/* Planes */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="mb-lg">
          <h3 className="font-title-md font-semibold text-on-surface">Planes disponibles</h3>
          <p className="font-code-mono text-xs text-on-surface-variant mt-xs">
            Precios en COP · IVA no incluido · Factura electrónica disponible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {PLANES.map((plan) => (
            <div key={plan.id}
              className={`relative border-2 ${plan.color} rounded-xl p-lg flex flex-col ${plan.id === "pro" ? "shadow-md" : ""}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-md py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-md">
                <p className="font-bold text-on-surface-variant text-xs uppercase tracking-wider mb-xs">{plan.name}</p>
                <div className="flex items-end gap-xs">
                  <p className="text-2xl font-bold text-on-surface">{plan.price}</p>
                  <p className="text-on-surface-variant text-sm mb-0.5">{plan.period}</p>
                </div>
                <p className="font-code-mono text-xs text-on-surface-variant mt-xs">{plan.usd}</p>
              </div>

              <ul className="space-y-sm mb-lg flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-sm text-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleInterest(plan.id)}
                className={`w-full py-sm font-bold rounded-lg transition-all text-sm ${
                  plan.id === "pro"
                    ? "bg-secondary text-white hover:opacity-90"
                    : "border border-outline-variant text-on-surface hover:bg-surface-container"
                }`}
              >
                {plan.id === "enterprise" ? "Contactar ventas" : "Me interesa"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario de interés */}
      {interest && !sent && (
        <section className="bg-secondary/5 border border-secondary/20 rounded-xl p-lg">
          <h4 className="font-semibold text-on-surface mb-xs">
            Nos alegra tu interés en el plan <span className="capitalize text-secondary">{interest}</span>
          </h4>
          <p className="text-sm text-on-surface-variant mb-md">
            Estamos en fase de validación. Déjanos tu correo y te avisamos cuando los pagos estén habilitados — además te garantizamos el precio de lanzamiento.
          </p>
          <form onSubmit={handleNotify} className="flex gap-md">
            <input
              type="email"
              required
              defaultValue=""
              placeholder="tu@empresa.com"
              className="flex-1 bg-white border border-outline-variant rounded-lg px-md py-sm outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
            <button type="submit"
              className="px-lg py-sm bg-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all whitespace-nowrap">
              Avisarme
            </button>
          </form>
        </section>
      )}

      {sent && (
        <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-lg flex items-center gap-md text-emerald-700">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <p className="font-bold">¡Listo! Te avisaremos cuando los pagos estén disponibles.</p>
            <p className="text-sm">También recibirás el precio especial de lanzamiento.</p>
          </div>
        </section>
      )}

      {/* Historial vacío */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <h3 className="font-title-md font-semibold text-on-surface mb-md">Historial de consumo</h3>
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] opacity-30 block mb-md">receipt_long</span>
          <p className="font-bold">Aún no hay transacciones</p>
          <p className="text-sm mt-xs">Tu historial de créditos y pagos aparecerá aquí.</p>
        </div>
      </section>

    </div>
  );
}
