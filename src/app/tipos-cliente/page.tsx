
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoClienteColumns } from "@/components/tipos-cliente/columns";
import { TipoClienteForm } from "@/components/tipos-cliente/client-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoCliente } from "@/types";
import { tipoClienteSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposCliente: TipoCliente[] = [
  { id_tipo_cliente: generateId(), nombre: "Individual", descripcion: "Cliente particular", created_at: new Date().toISOString() },
  { id_tipo_cliente: generateId(), nombre: "Corporativo", descripcion: "Cliente empresarial", created_at: new Date().toISOString() },
];

export default function TiposClientePage() {
  const [tiposCliente, setTiposCliente] = useState<TipoCliente[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoCliente, setEditingTipoCliente] = useState<TipoCliente | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoClienteToDelete, setTipoClienteToDelete] = useState<TipoCliente | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // En una aplicación real, aquí se cargarían los datos desde Supabase
    setTiposCliente(initialTiposCliente);
  }, []);

  const handleNewTipoCliente = () => {
    setEditingTipoCliente(null);
    setIsFormOpen(true);
  };

  const handleEditTipoCliente = (tipoCliente: TipoCliente) => {
    setEditingTipoCliente(tipoCliente);
    setIsFormOpen(true);
  };

  const handleDeleteTipoCliente = (tipoCliente: TipoCliente) => {
    setTipoClienteToDelete(tipoCliente);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoClienteToDelete) {
      setTiposCliente((prev) => prev.filter((ct) => ct.id_tipo_cliente !== tipoClienteToDelete.id_tipo_cliente));
      toast({ title: "Éxito", description: "Tipo de cliente eliminado correctamente." });
      setTipoClienteToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoClienteSchema>) => {
    if (editingTipoCliente) {
      setTiposCliente((prev) =>
        prev.map((ct) =>
          ct.id_tipo_cliente === editingTipoCliente.id_tipo_cliente ? { ...editingTipoCliente, ...values, created_at: editingTipoCliente.created_at } : ct
        )
      );
      toast({ title: "Éxito", description: "Tipo de cliente actualizado." });
    } else {
      const newTipoCliente: TipoCliente = { 
        ...values, 
        id_tipo_cliente: generateId(), 
        created_at: new Date().toISOString() 
      };
      setTiposCliente((prev) => [...prev, newTipoCliente]);
      toast({ title: "Éxito", description: "Nuevo tipo de cliente creado." });
    }
    setIsFormOpen(false);
    setEditingTipoCliente(null);
  };

  const columns = React.useMemo(
    () => getTipoClienteColumns(handleEditTipoCliente, handleDeleteTipoCliente),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] 
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposCliente}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Cliente"
        onNew={handleNewTipoCliente}
        onEdit={handleEditTipoCliente}
        onDelete={handleDeleteTipoCliente}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingTipoCliente(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipoCliente ? "Editar Tipo de Cliente" : "Crear Nuevo Tipo de Cliente"}
            </DialogTitle>
          </DialogHeader>
          <TipoClienteForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoCliente}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTipoCliente(null);
            }}
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
    </div>
  );
}
