
import { getRepartidoresAction } from "./actions";
import RepartidoresDataTable from "@/components/repartidores/repartidores-data-table";

export const metadata = {
  title: "Gestión de Repartidores",
};

export default async function RepartidoresPage({
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

  const { data: repartidores, count } = await getRepartidoresAction({
    page: currentPage,
    pageSize,
    query,
  });

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Gestión de Repartidores</h1>
      <RepartidoresDataTable
        initialData={repartidores}
        initialCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        currentQuery={query}
      />
    </div>
  );
}

    