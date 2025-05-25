
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getClienteColumns } from "./columns";
import { ClienteForm } from "./cliente-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Cliente, SelectOption } from "@/types";
import { addClienteAction, updateClienteAction, deleteClienteAction, getClienteByIdAction, getTiposClienteForSelectAction, getEmpresasForSelectAction } from "@/app/clientes/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface ClientesDataTableProps {
  initialData: Cliente[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function ClientesDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: ClientesDataTableProps) {
  const [data, setData] = useState<Cliente[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Partial<Cliente> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [tiposClienteOptions, setTiposClienteOptions] = useState<SelectOption[]>([]);
  const [empresasOptions, setEmpresasOptions] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
    setTotalCount(initialCount);
  }, [initialData, initialCount]);
  
  useEffect(() => {
    async function fetchOptions() {
      const [tiposCliente, empresas] = await Promise.all([
        getTiposClienteForSelectAction(),
        getEmpresasForSelectAction(),
      ]);
      setTiposClienteOptions(tiposCliente);
      setEmpresasOptions(empresas);
    }
    fetchOptions();
  }, []);


  const handleNew = () => {
    setEditingCliente(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (cliente: Cliente) => {
    // Fetch full client data if not all fields are in the table row
    const fullCliente = await getClienteByIdAction(cliente.id);
    setEditingCliente(fullCliente);
    setIsFormOpen(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      setIsSubmitting(true);
      const result = await deleteClienteAction(clienteToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        // Trigger re-fetch by navigating
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setClienteToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const action = editingCliente?.id ? updateClienteAction(editingCliente.id, values) : addClienteAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingCliente(null);
      // Trigger re-fetch
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getClienteColumns(handleEdit, handleDelete), []);
  
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre" 
        filterPlaceholder="Buscar por nombre, apellido, email..."
        newButtonLabel="Nuevo Cliente"
        onNew={handleNew}
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        // Server-side pagination/filtering props
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingCliente(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCliente?.id ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </DialogTitle>
            {editingCliente?.id && <DialogDescription>ID: {editingCliente.id}</DialogDescription>}
          </DialogHeader>
          <ClienteForm
            onSubmit={handleFormSubmit}
            initialData={editingCliente}
            onCancel={() => { setIsFormOpen(false); setEditingCliente(null); }}
            tiposClienteOptions={tiposClienteOptions}
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
        description={`¿Estás seguro de que deseas eliminar el cliente "${clienteToDelete?.nombre} ${clienteToDelete?.apellido || ''}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
