
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoEmpresaColumns } from "./columns";
import { TipoEmpresaForm } from "./tipo-empresa-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoEmpresa } from "@/types";
import { addTipoEmpresaAction, updateTipoEmpresaAction, deleteTipoEmpresaAction, getTipoEmpresaByIdAction } from "@/app/tipos-empresa/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { tipoEmpresaSchema } from "@/lib/schemas"; // Import the schema
import type * as z from "zod"; // Import z for type inference

interface TiposEmpresaDataTableProps {
  initialData: TipoEmpresa[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposEmpresaDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposEmpresaDataTableProps) {
  const [data, setData] = useState<TipoEmpresa[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoEmpresa, setEditingTipoEmpresa] = useState<Partial<TipoEmpresa> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoEmpresaToDelete, setTipoEmpresaToDelete] = useState<TipoEmpresa | null>(null);
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
    setEditingTipoEmpresa(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoEmpresa: TipoEmpresa) => {
    const fullTipoEmpresa = await getTipoEmpresaByIdAction(tipoEmpresa.id);
    setEditingTipoEmpresa(fullTipoEmpresa);
    setIsFormOpen(true);
  };

  const handleDelete = (tipoEmpresa: TipoEmpresa) => {
    setTipoEmpresaToDelete(tipoEmpresa);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoEmpresaToDelete) {
      setIsSubmitting(true);
      const result = await deleteTipoEmpresaAction(tipoEmpresaToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoEmpresaToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoEmpresaSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoEmpresa?.id ? updateTipoEmpresaAction(editingTipoEmpresa.id, values) : addTipoEmpresaAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoEmpresa(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getTipoEmpresaColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Buscar por nombre..."
        newButtonLabel="Nuevo Tipo de Empresa"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoEmpresa(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTipoEmpresa?.id ? "Editar Tipo de Empresa" : "Crear Nuevo Tipo de Empresa"}
            </DialogTitle>
            {editingTipoEmpresa?.id && <DialogDescription>ID: {editingTipoEmpresa.id}</DialogDescription>}
          </DialogHeader>
          <TipoEmpresaForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoEmpresa}
            onCancel={() => { setIsFormOpen(false); setEditingTipoEmpresa(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de empresa "${tipoEmpresaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
