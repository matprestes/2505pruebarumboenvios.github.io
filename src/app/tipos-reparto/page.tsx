
import { getTiposRepartoAction } from "./actions";
import TiposRepartoDataTable from "@/components/tipos-reparto/tipos-reparto-data-table";

export const metadata = {
  title: "Gestión de Tipos de Reparto",
};

export default async function TiposRepartoPage({
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

  const { data: tiposReparto, count } = await getTiposRepartoAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Reparto</h1>
      <TiposRepartoDataTable
        initialData={tiposReparto}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
