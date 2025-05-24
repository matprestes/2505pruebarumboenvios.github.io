
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TipoCliente } from "@/types"; // Renamed
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const getTipoClienteColumns = ( // Renamed
  onEdit: (item: TipoCliente) => void, // Renamed
  onDelete: (item: TipoCliente) => void // Renamed
): ColumnDef<TipoCliente>[] => [ // Renamed
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
    accessorKey: "nombre", // Assuming 'nombre' is the new field name
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
  {
    accessorKey: "descripcion", // Assuming 'descripcion' is the new field name
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("descripcion") as string | undefined;
      return description ? (
        <span className="truncate max-w-[400px] inline-block">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
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

    