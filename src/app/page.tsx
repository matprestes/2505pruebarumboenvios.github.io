
import { DashboardCard } from '@/components/dashboard-card';
import { Users, Package, Truck, ListChecks, PackagePlus, Building, UserCheck, Route, ClipboardList } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  let entityCounts = {
    tipos_cliente: 0,
    tipos_paquete: 0,
    tipos_servicio: 0,
    tipos_reparto: 0,
    tipos_envio: 0,
    clientes: 0,
    empresas: 0,
    repartidores: 0,
    repartos: 0,
    envios: 0,
  };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
        tipos_cliente: await fetchCount('tipos_cliente'),
        tipos_paquete: await fetchCount('tipos_paquete'),
        tipos_servicio: await fetchCount('tipos_servicio'),
        tipos_reparto: await fetchCount('tipos_reparto'),
        tipos_envio: await fetchCount('tipos_envio'),
        clientes: await fetchCount('clientes'),
        empresas: await fetchCount('empresas'),
        repartidores: await fetchCount('repartidores'),
        repartos: await fetchCount('repartos'),
        envios: await fetchCount('envios'),
      };
    } else {
      console.warn("DashboardPage: Supabase environment variables are not sufficiently set. Counts will default to 0.");
    }

  } catch (error: any) {
    console.error("DashboardPage: Failed to initialize Supabase client or fetch counts. This is likely due to missing or invalid Supabase environment variables on the server.", error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido a Rumbos Envios</h2>
        <p className="text-muted-foreground">
          Desde aquí puedes gestionar las configuraciones y operaciones principales de tu sistema de envíos.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Clientes"
          description="Gestiona tus clientes individuales y corporativos."
          icon={Users}
          href="/clientes"
          count={entityCounts.clientes}
        />
        <DashboardCard
          title="Empresas"
          description="Administra las empresas asociadas."
          icon={Building}
          href="/empresas"
          count={entityCounts.empresas}
        />
         <DashboardCard
          title="Repartidores"
          description="Gestiona la información de tus repartidores."
          icon={UserCheck}
          href="/repartidores"
          count={entityCounts.repartidores}
        />
        <DashboardCard
          title="Repartos"
          description="Planifica y sigue los repartos."
          icon={Route}
          href="/repartos"
          count={entityCounts.repartos}
        />
        <DashboardCard
          title="Envíos"
          description="Crea y gestiona los envíos."
          icon={ClipboardList}
          href="/envios"
          count={entityCounts.envios}
        />
      </div>
       <div className="mt-8">
        <h3 className="text-xl font-semibold tracking-tight mb-4">Configuración del Sistema</h3>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Tipos de Cliente"
              description="Define y gestiona los diferentes tipos de clientes."
              icon={Users}
              href="/tipos-cliente"
              count={entityCounts.tipos_cliente}
            />
            <DashboardCard
              title="Tipos de Paquete"
              description="Configura los tamaños y categorías de paquetes."
              icon={Package}
              href="/tipos-paquete"
              count={entityCounts.tipos_paquete}
            />
            <DashboardCard
              title="Tipos de Servicio"
              description="Establece los servicios de envío ofrecidos y sus tarifas."
              icon={Truck}
              href="/tipos-servicio"
              count={entityCounts.tipos_servicio}
            />
            <DashboardCard
              title="Tipos de Reparto"
              description="Define y gestiona los diferentes tipos de reparto."
              icon={ListChecks}
              href="/tipos-reparto"
              count={entityCounts.tipos_reparto}
            />
            <DashboardCard
              title="Tipos de Envío"
              description="Configura los tipos de envío y sus características."
              icon={PackagePlus}
              href="/tipos-envio"
              count={entityCounts.tipos_envio}
            />
          </div>
      </div>
    </div>
  );
}

    