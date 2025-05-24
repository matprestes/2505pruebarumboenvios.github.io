
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
// import { Button } from '@/components/ui/button'; // Not used
// import { Settings } from 'lucide-react'; // Not used

// Updated page titles to Spanish
const pageTitles: Record<string, string> = {
  '/': 'Panel General',
  '/client-types': 'Tipos de Cliente',
  '/package-types': 'Tipos de Paquete',
  '/service-types': 'Tipos de Servicio',
  '/delivery-types': 'Tipos de Reparto',
  '/shipment-types': 'Tipos de Envío',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPageTitle, setCurrentPageTitle] = useState('Rumbos Envios');

  useEffect(() => {
    setCurrentPageTitle(pageTitles[pathname] || 'Rumbos Envios');
  }, [pathname]);
  
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; 
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
           {/* Placeholder */}
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

    