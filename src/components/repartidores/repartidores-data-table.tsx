
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getRepartidorColumns } from "./columns";
import { RepartidorForm } from "./repartidor-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Repartidor } from "@/types";
import { addRepartidorAction, updateRepartidorAction, deleteRepartidorAction, getRepartidorByIdAction } from "@/app/repartidores/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { repartidorSchema } from "@/lib/schemas";
import type * as z from "zod";

interface RepartidoresDataTableProps {
  initialData: Repartidor[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function RepartidoresDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: RepartidoresDataTableProps) {
  const [data, setData] = useState<Repartidor[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRepartidor, setEditingRepartidor] = useState<Partial<Repartidor> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [repartidorToDelete, setRepartidorToDelete] = useState<Repartidor | null>(null);
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
    setEditingRepartidor(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (repartidor: Repartidor) => {
    setIsSubmitting(true);
    const fullRepartidor = await getRepartidorByIdAction(repartidor.id);
    setEditingRepartidor(fullRepartidor);
    setIsFormOpen(true);
    setIsSubmitting(false);
  };

  const handleDelete = (repartidor: Repartidor) => {
    setRepartidorToDelete(repartidor);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (repartidorToDelete) {
      setIsSubmitting(true);
      const result = await deleteRepartidorAction(repartidorToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setRepartidorToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof repartidorSchema>) => {
    setIsSubmitting(true);
    const action = editingRepartidor?.id ? updateRepartidorAction(editingRepartidor.id, values) : addRepartidorAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingRepartidor(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getRepartidorColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Buscar por nombre, DNI..."
        newButtonLabel="Nuevo Repartidor"
        onNew={handleNew}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingRepartidor(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRepartidor?.id ? "Editar Repartidor" : "Crear Nuevo Repartidor"}
            </DialogTitle>
            {editingRepartidor?.id && <DialogDescription>ID: {editingRepartidor.id}</DialogDescription>}
          </DialogHeader>
          <RepartidorForm
            onSubmit={handleFormSubmit}
            initialData={editingRepartidor}
            onCancel={() => { setIsFormOpen(false); setEditingRepartidor(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el repartidor "${repartidorToDelete?.nombre} ${repartidorToDelete?.apellido}"? Esta acción no se puede deshacer.`}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
