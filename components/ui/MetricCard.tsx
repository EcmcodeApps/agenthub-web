interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: { value: number; label: string };
  color?: "primary" | "success" | "warning" | "danger";
}

const colorMap = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function MetricCard({ title, value, subtitle, icon, trend, color = "primary" }: MetricCardProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          {title}
        </span>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: `${colorMap[color]}20` }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: colorMap[color] }}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs" style={{ color: "var(--muted)" }}>{subtitle}</div>
      )}
      {trend && (
        <div className="text-xs mt-2" style={{ color: trend.value >= 0 ? "var(--success)" : "var(--danger)" }}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  );
}
