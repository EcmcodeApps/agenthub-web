"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import AppSidebar from "@/app/_components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "#0058be", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 22, fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#0058be", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
