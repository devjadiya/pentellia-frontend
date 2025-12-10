
'use client';

import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { LayoutProvider, useLayout } from '@/context/layout-context';

function AppLayoutContent({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useLayout();

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Header />
      <div className="flex pt-16">
        <AppSidebar />
        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-[70px]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  );
}
