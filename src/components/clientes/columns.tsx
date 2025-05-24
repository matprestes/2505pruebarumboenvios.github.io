
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Cliente } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"; // Reusable
import { Badge } from "@/components/ui/badge";

export const getClienteColumns = (
  onEdit: (item: Cliente) => void,
  onDelete: (item: Cliente) => void
): ColumnDef<Cliente>[] => [
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
    cell: ({ row }) => {
        const cliente = row.original;
        return <div className="font-medium">{cliente.nombre} {cliente.apellido || ''}</div>;
    }
  },
  {
    accessorKey: "tipos_cliente.nombre",
    header: "Tipo Cliente",
    cell: ({ row }) => row.original.tipos_cliente?.nombre || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "empresas.razon_social",
    header: "Empresa",
    cell: ({ row }) => row.original.empresas?.razon_social || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "direccion_completa",
    header: "Dirección",
    cell: ({ row }) => <span className="truncate max-w-[200px] inline-block">{row.getValue("direccion_completa") || 'N/A'}</span>
  },
  {
    accessorKey: "created_at",
    header: "Creado",
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

    