
import { getRepartosAction } from "./actions";
import RepartosDataTable from "@/components/repartos/repartos-data-table";
import { 
  getTiposRepartoForSelectAction, 
  getClientesByEmpresaForSelectAction,
  getRepartidoresForSelectAction,
  getEmpresasForSelectAction
} from "./actions";
import { getTiposEnvioForSelectAction } from "@/app/tipos-envio/actions";
import { getTiposPaqueteForSelectAction } from "@/app/tipos-paquete/actions";
import { getTiposServicioForSelectAction } from "@/app/tipos-servicio/actions";


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

  const [
    tiposRepartoOptions, 
    repartidoresOptions, 
    empresasOptions,
    tiposEnvioOptions,
    tiposPaqueteOptions,
    tiposServicioOptions,
  ] = await Promise.all([
    getTiposRepartoForSelectAction(),
    getRepartidoresForSelectAction(), 
    getEmpresasForSelectAction(),
    getTiposEnvioForSelectAction(),
    getTiposPaqueteForSelectAction(),
    getTiposServicioForSelectAction(),
  ]);

  return (
    <div className="container mx-auto py-2">
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
        tiposEnvioOptions={tiposEnvioOptions}
        tiposPaqueteOptions={tiposPaqueteOptions}
        tiposServicioOptions={tiposServicioOptions}
        getClientesByEmpresaAction={getClientesByEmpresaAction}
      />
    </div>
  );
}

    