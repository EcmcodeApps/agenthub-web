import AdminSidebar from "@/app/_components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="ml-[260px] flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
