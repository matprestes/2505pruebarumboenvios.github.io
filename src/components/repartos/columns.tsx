
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Reparto } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

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
    header: "ID Reparto",
    cell: ({ row }) => <div className="font-mono text-xs">{row.original.id.substring(0,8)}...</div>
  },
  {
    accessorKey: "tipos_reparto.nombre",
    header: "Tipo de Reparto",
    cell: ({ row }) => row.original.tipos_reparto?.nombre || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "repartidores",
    header: "Repartidor",
    cell: ({ row }) => {
      const repartidor = row.original.repartidores;
      return repartidor ? `${repartidor.nombre} ${repartidor.apellido}` : <span className="text-muted-foreground italic">N/A</span>;
    }
  },
  {
    accessorKey: "fecha_programada",
    header: "Fecha Programada",
    cell: ({ row }) => {
      const date = row.getValue("fecha_programada") as string;
      try {
        return <span>{format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy')}</span>; // Ensure correct parsing if date is YYYY-MM-DD
      } catch (e) {
        return <span>Fecha inválida</span>
      }
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <Badge variant={row.getValue("estado") === "COMPLETADO" ? "default" : "secondary"}>{row.getValue("estado")}</Badge>,
  },
   {
    accessorKey: "empresas.razon_social",
    header: "Empresa (Destino/Servicio)",
    cell: ({ row }) => row.original.empresas?.razon_social || <span className="text-muted-foreground italic">N/A</span>,
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

    