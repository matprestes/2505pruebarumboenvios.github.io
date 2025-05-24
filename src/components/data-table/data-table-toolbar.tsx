"use client";

import { type Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId: string;
  filterPlaceholder: string;
  newButtonLabel: string;
  onNew: () => void;
}

export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder,
  newButtonLabel,
  onNew,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterPlaceholder}
          value={
            (table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
          }
          className="h-10 w-[200px] lg:w-[300px]"
        />
      </div>
      <Button onClick={onNew} size="sm">
        <PlusCircle className="mr-2 h-4 w-4" />
        {newButtonLabel}
      </Button>
    </div>
  );
}
