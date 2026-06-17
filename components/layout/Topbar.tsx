"use client";

import { logoutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6"
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <h1 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
        {title ?? "Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--primary)", color: "white" }}
        >
          {user?.displayName?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {user?.displayName ?? "Usuario"}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--muted)",
            border: "1px solid var(--card-border)",
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}
