
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getEnvioColumns } from "./columns";
import { EnvioForm } from "./envio-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Envio, SelectOption } from "@/types";
import { addEnvioAction, updateEnvioAction, deleteEnvioAction, getEnvioByIdAction } from "@/app/envios/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { envioSchema } from "@/lib/schemas";
import type * as z from "zod";

interface EnviosDataTableProps {
  initialData: Envio[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
  clientesOptions: SelectOption[];
  tiposEnvioOptions: SelectOption[];
  tiposPaqueteOptions: SelectOption[];
  tiposServicioOptions: SelectOption[];
  repartosOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasClienteOptions: SelectOption[];
}

export default function EnviosDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
  clientesOptions,
  tiposEnvioOptions,
  tiposPaqueteOptions,
  tiposServicioOptions,
  repartosOptions,
  repartidoresOptions,
  empresasClienteOptions,
}: EnviosDataTableProps) {
  const [data, setData] = useState<Envio[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEnvio, setEditingEnvio] = useState<Partial<Envio> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [envioToDelete, setEnvioToDelete] = useState<Envio | null>(null);
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
    setEditingEnvio(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (envio: Envio) => {
    const fullEnvio = await getEnvioByIdAction(envio.id);
    setEditingEnvio(fullEnvio);
    setIsFormOpen(true);
  };

  const handleDelete = (envio: Envio) => {
    setEnvioToDelete(envio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (envioToDelete) {
      setIsSubmitting(true);
      const result = await deleteEnvioAction(envioToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setEnvioToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof envioSchema>) => {
    setIsSubmitting(true);
    const action = editingEnvio?.id ? updateEnvioAction(editingEnvio.id, values) : addEnvioAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingEnvio(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getEnvioColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="id"
        filterPlaceholder="Buscar por ID, cliente, destino..."
        newButtonLabel="Nuevo Envío"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingEnvio(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-3xl"> {/* Wider dialog for more fields */}
          <DialogHeader>
            <DialogTitle>
              {editingEnvio?.id ? "Editar Envío" : "Crear Nuevo Envío"}
            </DialogTitle>
            {editingEnvio?.id && <DialogDescription>ID: {editingEnvio.id}</DialogDescription>}
          </DialogHeader>
          <EnvioForm
            onSubmit={handleFormSubmit}
            initialData={editingEnvio}
            onCancel={() => { setIsFormOpen(false); setEditingEnvio(null); }}
            clientesOptions={clientesOptions}
            tiposEnvioOptions={tiposEnvioOptions}
            tiposPaqueteOptions={tiposPaqueteOptions}
            tiposServicioOptions={tiposServicioOptions}
            repartosOptions={repartosOptions}
            repartidoresOptions={repartidoresOptions}
            empresasClienteOptions={empresasClienteOptions}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el envío ID ${envioToDelete?.id?.substring(0,8)}...? Esta acción no se puede deshacer.`}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
