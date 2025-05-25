
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Reparto } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const getRepartoColumns = (
  onEdit: (item: Reparto) => void,
  onDelete: (item: Reparto) => void
): ColumnDef<Reparto>[] => [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-xs truncate w-20">{row.original.id}</div>,
  },
  {
    accessorKey: "repartidores.nombre", // Nested accessor
    header: "Repartidor",
    cell: ({ row }) => {
      const repartidor = row.original.repartidores;
      return repartidor ? `${repartidor.nombre} ${repartidor.apellido || ''}`.trim() : <span className="text-muted-foreground italic">N/A</span>;
    }
  },
  {
    accessorKey: "tipos_reparto.nombre", // Nested accessor
    header: "Tipo Reparto",
    cell: ({ row }) => row.original.tipos_reparto?.nombre || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "empresas.razon_social", // For id_empresa
    header: "Empresa",
    cell: ({ row }) => (row.original as any).empresas?.razon_social || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "empresa_despachante.razon_social", // For id_empresa_despachante
    header: "Emp. Despachante",
    cell: ({ row }) => (row.original as any).empresa_despachante?.razon_social || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "fecha_programada",
    header: "Fecha Prog.",
    cell: ({ row }) => {
      const date = row.getValue("fecha_programada") as string;
      try {
        // Dates from Supabase are YYYY-MM-DD. Adding time to avoid timezone issues with parsing.
        return <span>{format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })}</span>;
      } catch (e) {
        return <span className="text-destructive">Fecha inválida</span>;
      }
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (estado === "COMPLETADO") variant = "default";
      if (estado === "EN_CURSO") variant = "default"; // Or another color like blue if primary is used for completed
      if (estado === "PENDIENTE") variant = "outline";
      if (estado === "CANCELADO") variant = "destructive";
      return <Badge variant={variant}>{estado}</Badge>;
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => row.getValue("tipo") || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return <span>{new Date(date).toLocaleDateString('es-AR')}</span>;
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

    