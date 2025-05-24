
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Envio } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export const getEnvioColumns = (
  onEdit: (item: Envio) => void,
  onDelete: (item: Envio) => void
): ColumnDef<Envio>[] => [
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
    header: "ID Envío",
    cell: ({ row }) => <div className="font-mono text-xs">{row.original.id.substring(0,8)}...</div>
  },
  {
    accessorKey: "clientes",
    header: "Cliente",
    cell: ({ row }) => {
        const cliente = row.original.clientes;
        return cliente ? `${cliente.nombre} ${cliente.apellido || ''}` : <span className="text-muted-foreground italic">N/A</span>;
    }
  },
  {
    accessorKey: "tipos_envio.nombre",
    header: "Tipo Envío",
    cell: ({ row }) => row.original.tipos_envio?.nombre || <span className="text-muted-foreground italic">N/A</span>,
  },
  {
    accessorKey: "direccion_destino",
    header: "Destino",
    cell: ({ row }) => <span className="truncate max-w-[150px] inline-block">{row.getValue("direccion_destino")}</span>
  },
  {
    accessorKey: "fecha_solicitud",
    header: "Fecha Solicitud",
    cell: ({ row }) => {
      const date = row.getValue("fecha_solicitud") as string;
       try {
        return <span>{format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy')}</span>;
      } catch (e) {
        return <span>Fecha inválida</span>
      }
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <Badge variant={row.getValue("estado") === "ENTREGADO" ? "default" : "secondary"}>{row.getValue("estado")}</Badge>,
  },
  {
    accessorKey: "precio_servicio_final",
    header: "Precio Final",
    cell: ({ row }) => {
        const precio = row.getValue("precio_servicio_final") as number | null;
        return precio ? `$${precio.toFixed(2)}` : <span className="text-muted-foreground italic">N/A</span>;
    }
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

    