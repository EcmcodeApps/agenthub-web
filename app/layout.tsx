import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AgentHub Empresarial | Equipos de Agentes IA",
  description:
    "Crea misiones, sube documentos y deja que un equipo de agentes inteligentes analice ventas, inventario, clientes y competencia para entregarte reportes accionables.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-body-md bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
