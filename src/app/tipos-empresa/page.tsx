
import { getTiposEmpresaAction } from "./actions";
import TiposEmpresaDataTable from "@/components/tipos-empresa/tipos-empresa-data-table";

export const metadata = {
  title: "Gestión de Tipos de Empresa",
};

export default async function TiposEmpresaPage({
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

  const { data: tiposEmpresa, count } = await getTiposEmpresaAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Empresa</h1>
      <TiposEmpresaDataTable
        initialData={tiposEmpresa}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}
