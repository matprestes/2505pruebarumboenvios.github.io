
import { getTiposClienteAction } from "./actions";
import TiposClienteDataTable from "@/components/tipos-cliente/tipos-cliente-data-table";

export const metadata = {
  title: "Gestión de Tipos de Cliente",
};

export default async function TiposClientePage({
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

  const { data: tiposCliente, count } = await getTiposClienteAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Cliente</h1>
      <TiposClienteDataTable
        initialData={tiposCliente}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
