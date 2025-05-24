
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TipoPaquete } from "@/types"; // Renamed
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";

export const getTipoPaqueteColumns = ( // Renamed
  onEdit: (item: TipoPaquete) => void, // Renamed
  onDelete: (item: TipoPaquete) => void // Renamed
): ColumnDef<TipoPaquete>[] => [ // Renamed
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
      const description = row.getValue("descripcion") as string | undefined;
      return description ? (
        <span className="truncate max-w-[300px] inline-block">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
  },
  {
    accessorKey: "dimensiones",
    header: "Dimensiones",
    cell: ({ row }) => {
      const dimensions = row.getValue("dimensiones") as string | undefined;
      return dimensions ? (
        <span>{dimensions}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
  },
  {
    accessorKey: "activo",
    header: "Activo",
    cell: ({ row }) => {
      const isActive = row.getValue("activo") as boolean;
      return <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Sí" : "No"}</Badge>;
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

    