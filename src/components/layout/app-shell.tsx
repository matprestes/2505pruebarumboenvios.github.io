
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

const pageTitles: Record<string, string> = {
  '/': 'Panel General',
  '/tipos-cliente': 'Tipos de Cliente',
  '/tipos-paquete': 'Tipos de Paquete',
  '/tipos-servicio': 'Tipos de Servicio',
  '/tipos-reparto': 'Tipos de Reparto',
  '/tipos-envio': 'Tipos de Envío',
  '/tipos-empresa': 'Tipos de Empresa',
  '/clientes': 'Gestión de Clientes',
  '/empresas': 'Gestión de Empresas',
  '/repartidores': 'Gestión de Repartidores',
  '/repartos': 'Gestión de Repartos',
  '/envios': 'Gestión de Envíos',
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

    