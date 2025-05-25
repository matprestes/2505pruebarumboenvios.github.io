
import { getTiposPaqueteAction } from "./actions";
import TiposPaqueteDataTable from "@/components/tipos-paquete/tipos-paquete-data-table";

export const metadata = {
  title: "Gestión de Tipos de Paquete",
};

export default async function TiposPaquetePage({
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

  const { data: tiposPaquete, count } = await getTiposPaqueteAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Paquete</h1>
      <TiposPaqueteDataTable
        initialData={tiposPaquete}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
