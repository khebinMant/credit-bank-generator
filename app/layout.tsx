import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora de Crédito",
  description: "Sistema de calculadoras financieras: Interés Simple, Interés Compuesto y Simulador de Crédito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Sidebar />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
          {children}
        </main>
      </body>
    </html>
  );
}
