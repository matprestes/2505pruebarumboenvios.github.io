
import { getTiposEnvioAction } from "./actions";
import TiposEnvioDataTable from "@/components/tipos-envio/tipos-envio-data-table"; // Nuevo componente

export const metadata = {
  title: "Gestión de Tipos de Envío",
};

export default async function TiposEnvioPage({
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

  const { data: tiposEnvio, count } = await getTiposEnvioAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Envío</h1>
      <TiposEnvioDataTable
        initialData={tiposEnvio}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
