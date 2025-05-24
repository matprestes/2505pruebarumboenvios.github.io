"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { AppHeader } from './header';
import { Logo } from '../icons/logo';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Panel General',
  '/client-types': 'Gestión de Tipos de Cliente',
  '/package-types': 'Gestión de Tipos de Paquete',
  '/service-types': 'Gestión de Tipos de Servicio',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPageTitle, setCurrentPageTitle] = useState('Rumbos Envios');

  useEffect(() => {
    setCurrentPageTitle(pageTitles[pathname] || 'Rumbos Envios');
  }, [pathname]);
  
  // Ensure this component only renders on the client after hydration
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
           {/* Placeholder for potential footer items like settings or user profile */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader title={currentPageTitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
