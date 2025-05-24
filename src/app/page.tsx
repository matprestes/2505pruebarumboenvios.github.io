import { DashboardCard } from '@/components/dashboard-card';
import { Users, Package, Truck } from 'lucide-react';

export default function DashboardPage() {
  // In a real app, counts would come from a data source
  const entityCounts = {
    clientTypes: 0, // Example: fetchClientTypes().length
    packageTypes: 0,
    serviceTypes: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido a Rumbos Envios</h2>
        <p className="text-muted-foreground">
          Desde aquí puedes gestionar las configuraciones principales de tu sistema de envíos.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Tipos de Cliente"
          description="Define y gestiona los diferentes tipos de clientes (ej. Individual, Corporativo)."
          icon={Users}
          href="/client-types"
          count={entityCounts.clientTypes}
        />
        <DashboardCard
          title="Tipos de Paquete"
          description="Configura los tamaños y categorías de paquetes (ej. Pequeño, Mediano, Grande)."
          icon={Package}
          href="/package-types"
          count={entityCounts.packageTypes}
        />
        <DashboardCard
          title="Tipos de Servicio"
          description="Establece los servicios de envío ofrecidos y sus tarifas (ej. Express, Estándar)."
          icon={Truck}
          href="/service-types"
          count={entityCounts.serviceTypes}
        />
      </div>
    </div>
  );
}
