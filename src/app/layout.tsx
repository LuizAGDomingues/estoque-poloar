import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estoque PoloAr - Sistema de Gerenciamento",
  description: "Sistema de gerenciamento de estoque de máquinas de ar condicionado da PoloAr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Estoque PoloAr</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="text-white hover:text-gray-200">Início</a></li>
                <li><a href="/estoque" className="text-white hover:text-gray-200">Estoque</a></li>
                <li><a href="/cadastrar" className="text-white hover:text-gray-200">Cadastrar</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
        <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} PoloAr - Sistema de Gerenciamento de Estoque</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
