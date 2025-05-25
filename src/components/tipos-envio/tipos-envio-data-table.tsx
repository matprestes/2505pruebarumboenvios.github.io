
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoEnvioColumns } from "./columns";
import { TipoEnvioForm } from "./shipment-type-form"; // Nombre de archivo existente
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoEnvio } from "@/types";
import { tipoEnvioSchema } from "@/lib/schemas";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  addTipoEnvioAction,
  updateTipoEnvioAction,
  deleteTipoEnvioAction,
  getTipoEnvioByIdAction,
} from "@/app/tipos-envio/actions";

interface TiposEnvioDataTableProps {
  initialData: TipoEnvio[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposEnvioDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposEnvioDataTableProps) {
  const [data, setData] = useState<TipoEnvio[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoEnvio, setEditingTipoEnvio] = useState<Partial<TipoEnvio> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoEnvioToDelete, setTipoEnvioToDelete] = useState<TipoEnvio | null>(null);
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
    setEditingTipoEnvio(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoEnvio: TipoEnvio) => {
    if (!tipoEnvio.id_tipo_envio) {
      toast({ title: "Error", description: "ID de tipo de envío no válido.", variant: "destructive" });
      return;
    }
    const fullTipoEnvio = await getTipoEnvioByIdAction(tipoEnvio.id_tipo_envio);
    setEditingTipoEnvio(fullTipoEnvio);
    setIsFormOpen(true);
  };

  const handleDelete = (tipoEnvio: TipoEnvio) => {
    setTipoEnvioToDelete(tipoEnvio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoEnvioToDelete && tipoEnvioToDelete.id_tipo_envio) {
      setIsSubmitting(true);
      const result = await deleteTipoEnvioAction(tipoEnvioToDelete.id_tipo_envio);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoEnvioToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoEnvioSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoEnvio?.id_tipo_envio
      ? updateTipoEnvioAction(editingTipoEnvio.id_tipo_envio, values)
      : addTipoEnvioAction(values);

    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoEnvio(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getTipoEnvioColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Envío"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoEnvio(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoEnvio?.id_tipo_envio ? "Editar Tipo de Envío" : "Crear Nuevo Tipo de Envío"}
            </DialogTitle>
            {editingTipoEnvio?.id_tipo_envio && <DialogDescription>ID: {editingTipoEnvio.id_tipo_envio}</DialogDescription>}
          </DialogHeader>
          <TipoEnvioForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoEnvio as TipoEnvio | null}
            onCancel={() => { setIsFormOpen(false); setEditingTipoEnvio(null); }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de envío "${tipoEnvioToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
