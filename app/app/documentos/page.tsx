"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AppSidebar from "@/app/_components/AppSidebar";
import { useAuth } from "@/app/providers";
import { fsGet, fsSet } from "@/lib/firebase/firestore-rest";

const ACCEPTED = ".csv,.pdf,.xlsx,.xls,.png,.jpg,.jpeg,.docx,.txt";
const MAX_MB   = 50;

type DocStatus = "procesado" | "procesando" | "sin-procesar" | "error";

interface DocRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: DocStatus;
  uploadedAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(name: string): { icon: string; bg: string; color: string } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf")  return { icon: "picture_as_pdf", bg: "bg-red-100",    color: "text-red-600"    };
  if (ext === "csv")  return { icon: "table_chart",    bg: "bg-blue-100",   color: "text-blue-600"   };
  if (["xlsx","xls"].includes(ext)) return { icon: "description", bg: "bg-green-100", color: "text-green-600" };
  if (["png","jpg","jpeg"].includes(ext)) return { icon: "image", bg: "bg-orange-100", color: "text-orange-600" };
  if (ext === "docx") return { icon: "article",        bg: "bg-indigo-100", color: "text-indigo-600" };
  return { icon: "insert_drive_file", bg: "bg-surface-container-high", color: "text-on-surface-variant" };
}

function StatusBadge({ status }: { status: DocStatus }) {
  const map = {
    procesado:    "bg-emerald-100 text-emerald-700",
    procesando:   "bg-blue-100 text-blue-700",
    "sin-procesar": "bg-surface-container-high text-on-surface-variant",
    error:        "bg-error/10 text-error",
  };
  const labels = { procesado: "Subido", procesando: "Subiendo…", "sin-procesar": "Sin procesar", error: "Error" };
  return (
    <span className={`px-sm py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status]}`}>
      {status === "procesando" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse mr-xs" />}
      {labels[status]}
    </span>
  );
}

export default function DocumentosPage() {
  const { user } = useAuth();
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const [docs, setDocs]         = useState<DocRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch]     = useState("");
  const [uploadError, setUploadError] = useState("");

  // Cargar documentos del usuario desde Firestore
  useEffect(() => {
    if (!user) return;
    fsGet("user_documents", user.uid).then((data) => {
      if (data?.docs && Array.isArray(data.docs)) {
        setDocs(data.docs as DocRecord[]);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const saveDocs = async (list: DocRecord[]) => {
    if (!user) return;
    await fsSet("user_documents", user.uid, { docs: list });
    setDocs(list);
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!user) return;
    setUploadError("");

    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`El archivo supera el límite de ${MAX_MB}MB.`);
      return;
    }

    const docId   = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const pending: DocRecord = {
      id: docId, name: file.name, size: file.size,
      type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
      url: "", status: "procesando", uploadedAt: new Date().toISOString(),
    };

    setDocs((prev) => [pending, ...prev]);

    try {
      const { auth } = await import("@/lib/firebase/config");
      const token    = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Sin sesión");

      const bucket   = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;
      const path     = encodeURIComponent(`documents/${user.uid}/${docId}`);
      const res      = await fetch(
        `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=documents%2F${user.uid}%2F${encodeURIComponent(file.name)}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": file.type || "application/octet-stream" }, body: file }
      );
      if (!res.ok) throw new Error(`Storage error ${res.status}`);
      const json = await res.json();
      const url  = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;

      const updated: DocRecord = { ...pending, url, status: "procesado" };
      setDocs((prev) => {
        const next = prev.map((d) => d.id === docId ? updated : d);
        fsSet("user_documents", user.uid, { docs: next });
        return next;
      });
    } catch (err) {
      setDocs((prev) => {
        const next = prev.map((d) => d.id === docId ? { ...d, status: "error" as DocStatus } : d);
        fsSet("user_documents", user.uid, { docs: next });
        return next;
      });
      setUploadError("Error al subir el archivo. Intenta de nuevo.");
    }
  }, [user]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const handleDelete = async (id: string) => {
    const next = docs.filter((d) => d.id !== id);
    await saveDocs(next);
  };

  const filtered = docs.filter((d) =>
    search === "" || d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = docs.reduce((acc, d) => acc + d.size, 0);

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <AppSidebar />

      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-xl py-md gap-md">
          <div>
            <h2 className="font-bold text-xl text-on-surface">Centro de Documentos</h2>
            <p className="text-sm text-on-surface-variant">
              {loading ? "Cargando…" : `${docs.length} documento${docs.length !== 1 ? "s" : ""} · ${formatBytes(totalSize)} usado`}
            </p>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar documento…"
                className="bg-surface-container border border-outline-variant rounded-full pl-10 pr-md py-sm outline-none focus:ring-2 focus:ring-secondary/20 w-56 transition-all" />
            </div>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-sm bg-secondary text-white font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Subir archivo
            </button>
            <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />
          </div>
        </header>

        <div className="p-xl space-y-xl flex-1">

          {/* Error */}
          {uploadError && (
            <div className="flex items-center gap-sm p-md bg-error/5 border border-error/20 rounded-xl text-error text-sm font-bold">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {uploadError}
              <button onClick={() => setUploadError("")} className="ml-auto">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {[
              { icon: "folder_open",   label: "Total",          value: String(docs.length) },
              { icon: "database",      label: "Espacio usado",  value: formatBytes(totalSize) },
              { icon: "check_circle",  label: "Subidos",        value: String(docs.filter(d => d.status === "procesado").length) },
              { icon: "hourglass_top", label: "En proceso",     value: String(docs.filter(d => d.status === "procesando").length) },
            ].map((s) => (
              <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                <span className="material-symbols-outlined text-secondary text-[20px]">{s.icon}</span>
                <p className="text-on-surface-variant text-xs mt-xs">{s.label}</p>
                <p className="font-bold text-xl text-on-surface">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-xl text-center cursor-pointer transition-all ${
              dragging ? "border-secondary bg-secondary/5 scale-[1.01]" : "border-outline-variant hover:border-secondary hover:bg-surface-container-low"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-secondary text-[28px]">cloud_upload</span>
            </div>
            <p className="font-bold text-on-surface mb-xs">
              {dragging ? "Suelta para subir" : "Arrastra archivos aquí o haz click"}
            </p>
            <p className="text-sm text-on-surface-variant">CSV, PDF, XLSX, PNG, JPG, DOCX · máx. {MAX_MB}MB por archivo</p>
          </div>

          {/* Lista de documentos */}
          {loading ? (
            <div className="space-y-md animate-pulse">
              {[1,2,3].map((i) => <div key={i} className="h-20 bg-surface-container rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-2xl text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-30 block mb-md">description</span>
              <p className="font-bold">{search ? "Sin resultados" : "Aún no has subido documentos"}</p>
              <p className="text-sm mt-xs">Usa el botón "Subir archivo" o arrastra archivos al área de arriba.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
              {filtered.map((doc) => {
                const { icon, bg, color } = fileIcon(doc.name);
                return (
                  <div key={doc.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex items-center gap-md hover:border-secondary transition-all group">
                    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[28px]">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface truncate">{doc.name}</p>
                      <p className="font-code-mono text-xs text-on-surface-variant">
                        {formatBytes(doc.size)} · {doc.type} · {new Date(doc.uploadedAt).toLocaleDateString("es-CO")}
                      </p>
                      {doc.status === "procesando" && (
                        <div className="mt-xs h-1 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-sm">
                      <StatusBadge status={doc.status} />
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="p-xs text-on-surface-variant hover:text-secondary transition-colors" title="Descargar">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </a>
                      )}
                      <button onClick={() => handleDelete(doc.id)}
                        className="p-xs text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all" title="Eliminar">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
