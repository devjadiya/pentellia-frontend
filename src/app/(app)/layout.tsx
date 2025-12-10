
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import {
  SidebarProvider,
  Sidebar,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen bg-[#1a1f28]">
        <Sidebar>
          <AppSidebar />
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 flex flex-col transition-[padding-left] ease-in-out duration-300 lg:pl-[260px] group-data-[state=collapsed]/sidebar-wrapper:lg:pl-12">
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
