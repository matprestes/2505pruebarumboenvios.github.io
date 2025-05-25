
import { getRepartosAction } from "./actions";
import RepartosDataTable from "@/components/repartos/repartos-data-table";
import { getTiposRepartoForSelectAction, getClientesByEmpresaForSelectAction } from "./actions"; // getClientesByEmpresaForSelectAction added
import { getRepartidoresForSelectAction } from "@/app/repartidores/actions";
import { getEmpresasForSelectAction } from "@/app/empresas/actions";

export const metadata = {
  title: "Gestión de Repartos",
};

export default async function RepartosPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;

  const { data: repartos, count } = await getRepartosAction({
    page: currentPage,
    pageSize,
    query,
  });

  const [tiposRepartoOptions, repartidoresOptions, empresasOptions] = await Promise.all([
    getTiposRepartoForSelectAction(),
    getRepartidoresForSelectAction(), // Fetches all active repartidores
    getEmpresasForSelectAction(),     // Fetches all empresas
  ]);

  return (
    <div className="container mx-auto py-2">
      {/* PageHeader component would go here, e.g.,
      <PageHeader
        title="Gestión de Repartos"
        actions={[
          { label: "Crear Nuevo Reparto", onClick: () => {} }, // onClick would trigger dialog in DataTable
          { label: "Crear Reparto por Lote", onClick: () => {} } // onClick would trigger dialog in DataTable
        ]}
      />
      */}
      <h1 className="text-3xl font-bold mb-6">Gestión de Repartos</h1>
      <RepartosDataTable
        initialData={repartos}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
        tiposRepartoOptions={tiposRepartoOptions}
        repartidoresOptions={repartidoresOptions}
        empresasOptions={empresasOptions}
        // Passing getClientesByEmpresaForSelectAction to be used in the batch form
        getClientesByEmpresaAction={getClientesByEmpresaForSelectAction}
      />
    </div>
  );
}

    