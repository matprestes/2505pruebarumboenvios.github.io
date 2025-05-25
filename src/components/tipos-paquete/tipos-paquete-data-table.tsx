
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoPaqueteColumns } from "./columns";
import { TipoPaqueteForm } from "./tipo-paquete-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoPaquete } from "@/types";
import { tipoPaqueteSchema } from "@/lib/schemas";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  addTipoPaqueteAction,
  updateTipoPaqueteAction,
  deleteTipoPaqueteAction,
  getTipoPaqueteByIdAction
} from "@/app/tipos-paquete/actions";

interface TiposPaqueteDataTableProps {
  initialData: TipoPaquete[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposPaqueteDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposPaqueteDataTableProps) {
  const [data, setData] = useState<TipoPaquete[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoPaquete, setEditingTipoPaquete] = useState<Partial<TipoPaquete> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoPaqueteToDelete, setTipoPaqueteToDelete] = useState<TipoPaquete | null>(null);
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
    setEditingTipoPaquete(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoPaquete: TipoPaquete) => {
    if (!tipoPaquete.id_tipo_paquete) {
      toast({ title: "Error", description: "ID de tipo de paquete no válido.", variant: "destructive" });
      return;
    }
    const fullTipoPaquete = await getTipoPaqueteByIdAction(tipoPaquete.id_tipo_paquete);
    setEditingTipoPaquete(fullTipoPaquete);
    setIsFormOpen(true);
  };

  const handleDelete = (tipoPaquete: TipoPaquete) => {
    setTipoPaqueteToDelete(tipoPaquete);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoPaqueteToDelete && tipoPaqueteToDelete.id_tipo_paquete) {
      setIsSubmitting(true);
      const result = await deleteTipoPaqueteAction(tipoPaqueteToDelete.id_tipo_paquete);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoPaqueteToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoPaqueteSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoPaquete?.id_tipo_paquete
      ? updateTipoPaqueteAction(editingTipoPaquete.id_tipo_paquete, values)
      : addTipoPaqueteAction(values);

    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoPaquete(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getTipoPaqueteColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Paquete"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoPaquete(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoPaquete?.id_tipo_paquete ? "Editar Tipo de Paquete" : "Crear Nuevo Tipo de Paquete"}
            </DialogTitle>
            {editingTipoPaquete?.id_tipo_paquete && <DialogDescription>ID: {editingTipoPaquete.id_tipo_paquete}</DialogDescription>}
          </DialogHeader>
          <TipoPaqueteForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoPaquete as TipoPaquete | null}
            onCancel={() => { setIsFormOpen(false); setEditingTipoPaquete(null); }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de paquete "${tipoPaqueteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
