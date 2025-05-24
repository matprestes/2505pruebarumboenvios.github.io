
import { getEnviosAction } from "./actions";
import EnviosDataTable from "@/components/envios/envios-data-table";
import { 
  getClientesForSelectAction,
  getTiposEnvioForSelectAction,
  getTiposPaqueteForSelectAction,
  getTiposServicioForSelectAction,
  getRepartosForSelectAction,
  getEmpresasClienteForSelectAction
} from "./actions";
import { getRepartidoresForSelectAction } from "@/app/repartidores/actions";


export const metadata = {
  title: "Gestión de Envíos",
};

export default async function EnviosPage({
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

  const { data: envios, count } = await getEnviosAction({
    page: currentPage,
    pageSize,
    query,
  });

  // Fetch options for select inputs in the form
  const [
    clientesOptions, 
    tiposEnvioOptions, 
    tiposPaqueteOptions, 
    tiposServicioOptions, 
    repartosOptions,
    repartidoresOptions,
    empresasClienteOptions
  ] = await Promise.all([
    getClientesForSelectAction(),
    getTiposEnvioForSelectAction(),
    getTiposPaqueteForSelectAction(),
    getTiposServicioForSelectAction(),
    getRepartosForSelectAction(),
    getRepartidoresForSelectAction(),
    getEmpresasClienteForSelectAction(),
  ]);

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Envíos</h1>
      <EnviosDataTable
        initialData={envios}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
        clientesOptions={clientesOptions}
        tiposEnvioOptions={tiposEnvioOptions}
        tiposPaqueteOptions={tiposPaqueteOptions}
        tiposServicioOptions={tiposServicioOptions}
        repartosOptions={repartosOptions}
        repartidoresOptions={repartidoresOptions}
        empresasClienteOptions={empresasClienteOptions}
      />
    </div>
  );
}

    