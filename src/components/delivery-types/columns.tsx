
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";

export const getDeliveryTypeColumns = (
  onEdit: (item: DeliveryType) => void,
  onDelete: (item: DeliveryType) => void
): ColumnDef<DeliveryType>[] => [
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
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      return description ? (
        <span className="truncate max-w-[300px] inline-block">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (estado === "completo") variant = "default"; // Green-like (primary)
      if (estado === "pendiente") variant = "secondary"; // Yellow-like (secondary)
      if (estado === "encurso") variant = "outline"; // Blue-like (accent)
      if (estado === "asignado") variant = "outline"; // another distinct color
      return <Badge variant={variant} className="capitalize">{estado}</Badge>;
    },
  },
  {
    accessorKey: "tipo_reparto",
    header: "Tipo de Reparto",
    cell: ({ row }) => <div className="capitalize">{row.getValue("tipo_reparto")}</div>,
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
