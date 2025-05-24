
import { DashboardCard } from '@/components/dashboard-card';
import { Users, Package, Truck, ListChecks, PackagePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  let entityCounts = {
    clientTypes: 0,
    packageTypes: 0,
    serviceTypes: 0,
    deliveryTypes: 0,
    shipmentTypes: 0,
  };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are present.
    // createClient will also log a warning if they are missing.
    // If they are truly empty/invalid, createServerClient within createClient will throw.
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http') && supabaseAnonKey.length > 10) {
      const supabase = createClient();

      const fetchCount = async (tableName: string): Promise<number> => {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (error) {
            console.error(`DashboardPage: Error fetching count for ${tableName}:`, error.message);
            return 0;
          }
          return count ?? 0;
        } catch (e: any) {
          console.error(`DashboardPage: Exception fetching count for ${tableName}:`, e.message);
          return 0;
        }
      };

      entityCounts = {
        clientTypes: await fetchCount('client_types'),
        packageTypes: await fetchCount('package_types'),
        serviceTypes: await fetchCount('service_types'),
        deliveryTypes: await fetchCount('delivery_types'),
        shipmentTypes: await fetchCount('shipment_types'),
      };
    } else {
      // This console.warn will be hit if the basic check above fails.
      // The warning from createClient() will also be logged if it's called.
      console.warn("DashboardPage: Supabase environment variables are not sufficiently set. Counts will default to 0.");
    }

  } catch (error: any) {
    // This will catch errors if createClient() itself throws (e.g., due to Supabase library rejecting empty strings).
    console.error("DashboardPage: Failed to initialize Supabase client or fetch counts. This is likely due to missing or invalid Supabase environment variables on the server.", error.message);
    // entityCounts remains at its default (all zeros)
  }

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
