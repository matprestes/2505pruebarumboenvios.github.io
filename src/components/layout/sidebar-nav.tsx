
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, Truck, ListChecks, PackagePlus } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Panel General', icon: LayoutDashboard },
  { href: '/client-types', label: 'Tipos de Cliente', icon: Users },
  { href: '/package-types', label: 'Tipos de Paquete', icon: Package },
  { href: '/service-types', label: 'Tipos de Servicio', icon: Truck },
  { href: '/delivery-types', label: 'Tipos de Reparto', icon: ListChecks },
  { href: '/shipment-types', label: 'Tipos de Envío', icon: PackagePlus },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

