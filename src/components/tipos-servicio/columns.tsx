
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TipoServicio } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const getTipoServicioColumns = (
  onEdit: (item: TipoServicio) => void,
  onDelete: (item: TipoServicio) => void
): ColumnDef<TipoServicio>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todas"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("descripcion") as string | undefined | null;
      return description ? (
        <span className="truncate max-w-[400px] inline-block">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
  },
  {
    accessorKey: "tarifas_servicio",
    header: "Nº de Tarifas",
    cell: ({ row }) => {
      const tarifas = row.original.tarifas_servicio;
      return <span>{tarifas?.length || 0}</span>;
    }
  },
   {
    accessorKey: "created_at",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
