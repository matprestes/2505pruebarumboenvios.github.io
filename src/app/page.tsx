
import { DashboardCard } from '@/components/dashboard-card';
import { Users, Package, Truck, ListChecks, PackagePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();

  const fetchCount = async (tableName: string): Promise<number> => {
    // Ensure Supabase URL and Key are set before trying to query
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return 0;
    }
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`Error fetching count for ${tableName}:`, error.message);
        return 0;
      }
      return count ?? 0;
    } catch (e) {
      // Catch any other errors during client creation or query
      console.error(`Exception fetching count for ${tableName}:`, e);
      return 0;
    }
  };

  const entityCounts = {
    clientTypes: await fetchCount('client_types'),
    packageTypes: await fetchCount('package_types'),
    serviceTypes: await fetchCount('service_types'),
    deliveryTypes: await fetchCount('delivery_types'),
    shipmentTypes: await fetchCount('shipment_types'),
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
         <DashboardCard
          title="Tipos de Reparto"
          description="Define y gestiona los diferentes tipos de reparto y sus estados."
          icon={ListChecks}
          href="/delivery-types"
          count={entityCounts.deliveryTypes}
        />
        <DashboardCard
          title="Tipos de Envío"
          description="Configura los tipos de envío y sus estados de seguimiento."
          icon={PackagePlus}
          href="/shipment-types"
          count={entityCounts.shipmentTypes}
        />
      </div>
    </div>
  );
}
