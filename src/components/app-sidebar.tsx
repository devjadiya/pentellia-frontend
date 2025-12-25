
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  FileText,
  ShieldCheck,
  FileSearch,
  Crosshair,
  Blocks,
  Settings,
  LayoutDashboard,
  LifeBuoy,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/assets', icon: Package, label: 'Assets' },
  { href: '/scans', icon: ShieldCheck, label: 'Scans' },
  { href: '/findings', icon: FileSearch, label: 'Findings' },
  { href: '/attack-surface', icon: Crosshair, label: 'Attack Surface' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/integrations', icon: Blocks, label: 'Integrations' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const bottomNavItems = [
    { href: '/help', icon: LifeBuoy, label: 'Help & Support' },
];

export function AppSidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed top-16 z-30 h-[calc(100vh-4rem)] bg-card text-foreground border-r border-border transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-[70px]'
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          <nav className="space-y-1 text-sm">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    !isSidebarOpen && 'justify-center',
                    isActive && 'text-foreground bg-accent'
                  )}
                >
                   {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                  )}
                  <item.icon className={cn(
                      'h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground',
                      isActive && 'text-primary'
                      )}
                   />
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="px-3 pb-4">
            {isSidebarOpen && (
                 <div className='px-3 py-2 text-sm'>
                    <div className='flex justify-between items-center mb-1'>
                        <span className='text-muted-foreground'>Usage</span>
                        <span className='font-semibold text-foreground'>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                </div>
            )}
             <nav className="space-y-1 text-sm mt-2">
                {bottomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'group relative flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                        !isSidebarOpen && 'justify-center',
                        isActive && 'text-foreground bg-accent'
                    )}
                    >
                    <item.icon className={cn(
                        'h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground',
                        isActive && 'text-primary'
                        )}
                    />
                    {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                    </Link>
                );
                })}
             </nav>
             {isSidebarOpen && (
                <div className='mt-4 p-4 rounded-lg bg-accent/50 text-center'>
                    <p className='text-sm font-semibold text-foreground'>Unlock More Power</p>
                    <p className='text-xs text-muted-foreground mt-1 mb-3'>Upgrade your plan for advanced features and higher limits.</p>
                    <Button size='sm' className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
                        <Star className='mr-2 h-4 w-4'/>
                        Upgrade
                    </Button>
                </div>
             )}
        </div>
      </div>
    </aside>
  );
}
