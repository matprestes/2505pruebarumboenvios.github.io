
import { getTiposServicioAction } from "./actions";
import TiposServicioDataTable from "@/components/tipos-servicio/tipos-servicio-data-table";

export const metadata = {
  title: "Gestión de Tipos de Servicio",
};

export default async function TiposServicioPage({
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

  const { data: tiposServicio, count } = await getTiposServicioAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Servicio</h1>
      <TiposServicioDataTable
        initialData={tiposServicio}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
