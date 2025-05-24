
import { getClientesAction } from "./actions";
import ClientesDataTable from "@/components/clientes/clientes-data-table"; // New component

export const metadata = {
  title: "Gestión de Clientes",
};

export default async function ClientesPage({
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

  const { data: clientes, count } = await getClientesAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <ClientesDataTable
        initialData={clientes}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}

    