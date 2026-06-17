import { cn } from "@/lib/utils/cn";

type Status =
  | "active"
  | "inactive"
  | "trial"
  | "draft"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "waiting_approval"
  | "processing";

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: "Activo", color: "var(--success)", bg: "rgba(16,185,129,0.15)" },
  inactive: { label: "Inactivo", color: "var(--muted)", bg: "rgba(107,114,128,0.15)" },
  trial: { label: "Prueba", color: "var(--primary)", bg: "rgba(99,102,241,0.15)" },
  draft: { label: "Borrador", color: "var(--muted)", bg: "rgba(107,114,128,0.15)" },
  running: { label: "Ejecutando", color: "var(--warning)", bg: "rgba(245,158,11,0.15)" },
  completed: { label: "Completado", color: "var(--success)", bg: "rgba(16,185,129,0.15)" },
  failed: { label: "Fallido", color: "var(--danger)", bg: "rgba(239,68,68,0.15)" },
  cancelled: { label: "Cancelado", color: "var(--muted)", bg: "rgba(107,114,128,0.15)" },
  waiting_approval: { label: "Esperando aprobación", color: "var(--warning)", bg: "rgba(245,158,11,0.15)" },
  processing: { label: "Procesando", color: "var(--primary)", bg: "rgba(99,102,241,0.15)" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  );
}
