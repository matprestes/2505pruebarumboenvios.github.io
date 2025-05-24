
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getRepartoColumns } from "./columns";
import { RepartoForm } from "./reparto-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Reparto, SelectOption } from "@/types";
import { addRepartoAction, updateRepartoAction, deleteRepartoAction, getRepartoByIdAction } from "@/app/repartos/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface RepartosDataTableProps {
  initialData: Reparto[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
  tiposRepartoOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasOptions: SelectOption[];
}

export default function RepartosDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
  tiposRepartoOptions,
  repartidoresOptions,
  empresasOptions,
}: RepartosDataTableProps) {
  const [data, setData] = useState<Reparto[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReparto, setEditingReparto] = useState<Partial<Reparto> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [repartoToDelete, setRepartoToDelete] = useState<Reparto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
    setTotalCount(initialCount);
  }, [initialData, initialCount]);

  const handleNew = () => {
    setEditingReparto(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (reparto: Reparto) => {
    const fullReparto = await getRepartoByIdAction(reparto.id);
    setEditingReparto(fullReparto);
    setIsFormOpen(true);
  };

  const handleDelete = (reparto: Reparto) => {
    setRepartoToDelete(reparto);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (repartoToDelete) {
      setIsSubmitting(true);
      const result = await deleteRepartoAction(repartoToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setRepartoToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const action = editingReparto?.id ? updateRepartoAction(editingReparto.id, values) : addRepartoAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingReparto(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getRepartoColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="estado" // Example, adjust as needed
        filterPlaceholder="Buscar por estado, repartidor..."
        newButtonLabel="Nuevo Reparto"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingReparto(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReparto?.id ? "Editar Reparto" : "Crear Nuevo Reparto"}
            </DialogTitle>
            {editingReparto?.id && <DialogDescription>ID: {editingReparto.id}</DialogDescription>}
          </DialogHeader>
          <RepartoForm
            onSubmit={handleFormSubmit}
            initialData={editingReparto}
            onCancel={() => { setIsFormOpen(false); setEditingReparto(null); }}
            tiposRepartoOptions={tiposRepartoOptions}
            repartidoresOptions={repartidoresOptions}
            empresasOptions={empresasOptions}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el reparto ID ${repartoToDelete?.id?.substring(0,8)}...? Esta acción no se puede deshacer.`}
      />
    </>
  );
}

    