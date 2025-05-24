
import { getEmpresasAction } from "./actions";
import EmpresasDataTable from "@/components/empresas/empresas-data-table";

export const metadata = {
  title: "Gestión de Empresas",
};

export default async function EmpresasPage({
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

  const { data: empresas, count } = await getEmpresasAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empresas</h1>
      <EmpresasDataTable
        initialData={empresas}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}

    