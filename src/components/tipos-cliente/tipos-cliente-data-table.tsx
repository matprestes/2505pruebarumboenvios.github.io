
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoClienteColumns } from "./columns";
import { TipoClienteForm } from "./tipo-cliente-form"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoCliente } from "@/types";
import { tipoClienteSchema } from "@/lib/schemas";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  addTipoClienteAction,
  updateTipoClienteAction,
  deleteTipoClienteAction,
  getTipoClienteByIdAction,
} from "@/app/tipos-cliente/actions";

interface TiposClienteDataTableProps {
  initialData: TipoCliente[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposClienteDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposClienteDataTableProps) {
  const [data, setData] = useState<TipoCliente[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoCliente, setEditingTipoCliente] = useState<Partial<TipoCliente> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoClienteToDelete, setTipoClienteToDelete] = useState<TipoCliente | null>(null);
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
    setEditingTipoCliente(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoCliente: TipoCliente) => {
    if (!tipoCliente.id_tipo_cliente) {
      toast({ title: "Error", description: "ID de tipo de cliente no válido.", variant: "destructive" });
      return;
    }
    const fullTipoCliente = await getTipoClienteByIdAction(tipoCliente.id_tipo_cliente);
    setEditingTipoCliente(fullTipoCliente);
    setIsFormOpen(true);
  };

  const handleDelete = (tipoCliente: TipoCliente) => {
    setTipoClienteToDelete(tipoCliente);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoClienteToDelete && tipoClienteToDelete.id_tipo_cliente) {
      setIsSubmitting(true);
      const result = await deleteTipoClienteAction(tipoClienteToDelete.id_tipo_cliente);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoClienteToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoClienteSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoCliente?.id_tipo_cliente
      ? updateTipoClienteAction(editingTipoCliente.id_tipo_cliente, values)
      : addTipoClienteAction(values);

    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoCliente(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };
  
  const columns = useMemo(() => getTipoClienteColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Cliente"
        onNew={handleNew}
        onEdit={handleEdit} 
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoCliente(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipoCliente?.id_tipo_cliente ? "Editar Tipo de Cliente" : "Crear Nuevo Tipo de Cliente"}
            </DialogTitle>
            {editingTipoCliente?.id_tipo_cliente && <DialogDescription>ID: {editingTipoCliente.id_tipo_cliente}</DialogDescription>}
          </DialogHeader>
          <TipoClienteForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoCliente as TipoCliente | null}
            onCancel={() => { setIsFormOpen(false); setEditingTipoCliente(null); }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de cliente "${tipoClienteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
