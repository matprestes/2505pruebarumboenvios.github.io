
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { href: '/client-types', label: 'Tipos de Cliente', icon: Users },
  { href: '/package-types', label: 'Tipos de Paquete', icon: Package },
  { href: '/service-types', label: 'Tipos de Servicio', icon: Truck },
  { href: '/delivery-types', label: 'Tipos de Reparto', icon: ListChecks },
  { href: '/shipment-types', label: 'Tipos de Envío', icon: PackagePlus },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const isConfigActive = configNavItems.some(item => pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true));

  const accordionTriggerClasses = cn(
    // Base styles from SidebarMenuButton (approximated for AccordionTrigger)
    "flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-left text-sm font-medium outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
    "h-8", // Match SidebarMenuButton height
    // Active state for the trigger if a sub-item is active or accordion is open
    (isConfigActive || "[&[data-state=open]]:bg-sidebar-accent [&[data-state=open]]:text-sidebar-accent-foreground") && "bg-sidebar-accent text-sidebar-accent-foreground",
    // Icon-only mode styles (applied due to parent group having data-collapsible=icon)
    "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2",
    // Remove hover underline from default AccordionTrigger
    "hover:no-underline",
    // Ensure default chevron from AccordionTrigger is hidden in icon mode and other specific stylings
    "group-data-[collapsible=icon]:[&>svg:last-child]:hidden"
  );

  const accordionTriggerTextSpanClasses = cn(
    "flex-1", // Take available space to push chevron to the end
    "group-data-[collapsible=icon]:hidden" // Hide text in icon mode
  );
  
  const accordionContentClasses = cn(
    "pt-1 pb-0 overflow-hidden",
    "group-data-[collapsible=icon]:hidden" // Hide content entirely in icon mode
  );

  return (
    <SidebarMenu>
      {/* Panel General */}
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === mainNavItem.href}
          tooltip={{ children: mainNavItem.label }} // Corrected tooltip prop
        >
          <Link href={mainNavItem.href}>
            <mainNavItem.icon />
            <span>{mainNavItem.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Configuración Submenu */}
      <SidebarMenuItem>
        <Accordion type="single" collapsible defaultValue={isConfigActive ? "config-item" : undefined} className="w-full">
          <AccordionItem value="config-item" className="border-none">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild disabled={sidebarState === "expanded" || isMobile}>
                  <AccordionTrigger className={accordionTriggerClasses}>
                    <Settings className="h-4 w-4 shrink-0" />
                    <span className={accordionTriggerTextSpanClasses}>Configuración</span>
                    {/* The default chevron is part of AccordionTrigger, it will be hidden by group-data-[collapsible=icon]:[&>svg:last-child]:hidden */}
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
                      tooltip={{ children: item.label }} // Corrected tooltip prop
                      size="sm" // Smaller for sub-items
                      className="h-7 w-full justify-start text-xs" // Ensure full width and proper alignment
                    >
                      <Link href={item.href}>
                        <item.icon />
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
