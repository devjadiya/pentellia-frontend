
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full text-foreground">
      <Header />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 bg-[#F5F7FB] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
