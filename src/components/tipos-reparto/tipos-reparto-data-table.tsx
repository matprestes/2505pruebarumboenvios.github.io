
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoRepartoColumns } from "./columns";
import { TipoRepartoForm } from "./tipo-reparto-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoReparto } from "@/types";
import { tipoRepartoSchema } from "@/lib/schemas";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  addTipoRepartoAction,
  updateTipoRepartoAction,
  deleteTipoRepartoAction,
  getTipoRepartoByIdAction
} from "@/app/tipos-reparto/actions";

interface TiposRepartoDataTableProps {
  initialData: TipoReparto[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposRepartoDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposRepartoDataTableProps) {
  const [data, setData] = useState<TipoReparto[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoReparto, setEditingTipoReparto] = useState<Partial<TipoReparto> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoRepartoToDelete, setTipoRepartoToDelete] = useState<TipoReparto | null>(null);
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
    setEditingTipoReparto(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoReparto: TipoReparto) => {
    if (!tipoReparto.id_tipo_reparto) {
      toast({ title: "Error", description: "ID de tipo de reparto no válido.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const fullTipoReparto = await getTipoRepartoByIdAction(tipoReparto.id_tipo_reparto);
    setEditingTipoReparto(fullTipoReparto);
    setIsFormOpen(true);
    setIsSubmitting(false);
  };

  const handleDelete = (tipoReparto: TipoReparto) => {
    setTipoRepartoToDelete(tipoReparto);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoRepartoToDelete && tipoRepartoToDelete.id_tipo_reparto) {
      setIsSubmitting(true);
      const result = await deleteTipoRepartoAction(tipoRepartoToDelete.id_tipo_reparto);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoRepartoToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoRepartoSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoReparto?.id_tipo_reparto
      ? updateTipoRepartoAction(editingTipoReparto.id_tipo_reparto, values)
      : addTipoRepartoAction(values);

    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoReparto(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getTipoRepartoColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Reparto"
        onNew={handleNew}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoReparto(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoReparto?.id_tipo_reparto ? "Editar Tipo de Reparto" : "Crear Nuevo Tipo de Reparto"}
            </DialogTitle>
            {editingTipoReparto?.id_tipo_reparto && <DialogDescription>ID: {editingTipoReparto.id_tipo_reparto}</DialogDescription>}
          </DialogHeader>
          <TipoRepartoForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoReparto as TipoReparto | null}
            onCancel={() => { setIsFormOpen(false); setEditingTipoReparto(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de reparto "${tipoRepartoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
