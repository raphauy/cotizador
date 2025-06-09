import Logged from "@/components/header/logged";
import Logo from "@/components/header/logo";
import Menu from "@/components/header/menu";
import { TailwindIndicator } from "@/components/shadcn/tailwind-indicator";
import { ThemeProvider } from "@/components/shadcn/theme-provider";
import { LinealToggle } from "@/components/shadcn/toggle-theme";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cotizador Aníbal Abbate",
  description: "Creador de presupuestos de la marmolería de Aníbal Abbate",
};

type Props = {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const session = await auth();
  const isDevMode = process.env.NODE_ENV === "development";

  return (
    <SessionProvider session={session}>
      <html lang="es" suppressHydrationWarning>
        <body className={cn(inter.className, "min-h-screen flex flex-col text-muted-foreground")}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="px-3 sm:px-4 md:px-5 lg:px-3 border-b border-b-gray-300 w-full">
              <div className="flex justify-between items-center">
                <Logo />
                <Logged />
              </div>
              <Menu />
            </div>
            
            <div className="px-3 sm:px-4 md:px-5 xl:px-3 flex flex-col items-center flex-1 w-full bg-slate-50 dark:bg-black">
              {children}
            </div>
            <div className='self-end bg-slate-50 w-full dark:bg-black'>
              <LinealToggle isDevMode={isDevMode} />
            </div>
            <TailwindIndicator />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
