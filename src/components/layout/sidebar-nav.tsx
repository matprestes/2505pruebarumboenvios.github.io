
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, Truck, ListChecks, PackagePlus, Settings } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const mainNavItem = { href: '/', label: 'Panel General', icon: LayoutDashboard };

const configNavItems = [
  { href: '/tipos-cliente', label: 'Tipos de Cliente', icon: Users },
  { href: '/tipos-paquete', label: 'Tipos de Paquete', icon: Package },
  { href: '/tipos-servicio', label: 'Tipos de Servicio', icon: Truck },
  { href: '/tipos-reparto', label: 'Tipos de Reparto', icon: ListChecks },
  { href: '/tipos-envio', label: 'Tipos de Envío', icon: PackagePlus },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  
  const isConfigActive = configNavItems.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));
  
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isConfigActive) {
      setOpenAccordionValue("config-item");
    } else {
      // If no config item is active and the accordion was open for config, consider closing it.
      // This can be refined based on desired UX (e.g., keep it open if user explicitly opened it).
      if (openAccordionValue === "config-item" && !isConfigActive) {
        // setOpenAccordionValue(undefined); // Example: close if no longer active
      }
    }
  }, [pathname, isConfigActive, openAccordionValue]);


  const accordionTriggerClasses = cn(
    "flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-left text-sm font-medium outline-none ring-sidebar-ring transition-colors",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    (openAccordionValue === "config-item" || isConfigActive) && "bg-sidebar-accent text-sidebar-accent-foreground",
    "h-8",
    "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2",
    "hover:no-underline",
    "group-data-[collapsible=icon]:[&>svg:last-child]:hidden" 
  );

  const accordionTriggerTextSpanClasses = cn(
    "flex-1",
    "group-data-[collapsible=icon]:hidden"
  );
  
  const accordionContentClasses = cn(
    "pt-1 pb-0 overflow-hidden",
    "group-data-[collapsible=icon]:hidden"
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === mainNavItem.href}
          tooltip={{ children: mainNavItem.label }}
        >
          <Link href={mainNavItem.href}>
            <mainNavItem.icon className="h-5 w-5" />
            <span>{mainNavItem.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Accordion 
          type="single" 
          collapsible 
          value={openAccordionValue}
          onValueChange={setOpenAccordionValue}
          className="w-full"
        >
          <AccordionItem value="config-item" className="border-none">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild disabled={sidebarState === "expanded" || isMobile}>
                  <AccordionTrigger className={accordionTriggerClasses}>
                    <Settings className="h-4 w-4 shrink-0" />
                    <span className={accordionTriggerTextSpanClasses}>Configuración</span>
                  </AccordionTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Configuración
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AccordionContent className={accordionContentClasses}>
              <SidebarMenu className="ml-3 mt-1 space-y-0.5 border-l border-sidebar-border/50 pl-3">
                {configNavItems.map((item) => (
                  <SidebarMenuItem key={item.href} className="!py-0.5">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label }}
                      size="sm" 
                      className="h-7 w-full justify-start text-xs" 
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
