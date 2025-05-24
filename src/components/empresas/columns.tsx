
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Empresa } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const getEmpresaColumns = (
  onEdit: (item: Empresa) => void,
  onDelete: (item: Empresa) => void
): ColumnDef<Empresa>[] => [
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
    accessorKey: "razon_social",
    header: "Razón Social",
    cell: ({ row }) => <div className="font-medium">{row.getValue("razon_social")}</div>,
  },
  {
    accessorKey: "tipos_empresa.nombre",
    header: "Tipo Empresa",
     cell: ({ row }) => row.original.tipos_empresa?.nombre || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "cuit",
    header: "CUIT",
  },
  {
    accessorKey: "email_contacto",
    header: "Email Contacto",
  },
  {
    accessorKey: "telefono_contacto",
    header: "Teléfono Contacto",
  },
  {
    accessorKey: "direccion_fiscal",
    header: "Dirección Fiscal",
    cell: ({ row }) => <span className="truncate max-w-[200px] inline-block">{row.getValue("direccion_fiscal") || 'N/A'}</span>
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

    