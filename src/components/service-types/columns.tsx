
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

// const formatCurrency = (amount?: number) => {
//   if (typeof amount !== 'number') return <span className="text-muted-foreground italic">N/A</span>;
//   return amount.toLocaleString('es-ES', { style: 'currency', currency: 'USD' }); // Adjust currency as needed
// };

export const getServiceTypeColumns = (
  onEdit: (item: ServiceType) => void,
  onDelete: (item: ServiceType) => void
): ColumnDef<ServiceType>[] => [
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
        <span className="truncate max-w-[400px] inline-block">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      );
    },
  },
  // Removed baseRate, ratePerKm, ratePerKg columns as pricing is now complex
  // These details will be available in the edit form.
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
