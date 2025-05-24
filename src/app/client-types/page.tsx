
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoClienteColumns } from "@/components/client-types/columns"; // Renamed
import { TipoClienteForm } from "@/components/client-types/client-type-form"; // Renamed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoCliente } from "@/types"; // Renamed
import { tipoClienteSchema } from "@/lib/schemas"; // Renamed
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposCliente: TipoCliente[] = [
  { id_tipo_cliente: generateId(), nombre: "Individual", descripcion: "Cliente particular", created_at: new Date().toISOString() },
  { id_tipo_cliente: generateId(), nombre: "Corporativo", descripcion: "Cliente empresarial", created_at: new Date().toISOString() },
];

export default function TiposClientePage() { // Renamed
  const [tiposCliente, setTiposCliente] = useState<TipoCliente[]>([]); // Renamed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoCliente, setEditingTipoCliente] = useState<TipoCliente | null>(null); // Renamed
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoClienteToDelete, setTipoClienteToDelete] = useState<TipoCliente | null>(null); // Renamed
  const { toast } = useToast();

  useEffect(() => {
    setTiposCliente(initialTiposCliente); // Renamed
  }, []);

  const handleNewTipoCliente = () => { // Renamed
    setEditingTipoCliente(null);
    setIsFormOpen(true);
  };

  const handleEditTipoCliente = (tipoCliente: TipoCliente) => { // Renamed
    setEditingTipoCliente(tipoCliente);
    setIsFormOpen(true);
  };

  const handleDeleteTipoCliente = (tipoCliente: TipoCliente) => { // Renamed
    setTipoClienteToDelete(tipoCliente);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoClienteToDelete) {
      setTiposCliente((prev) => prev.filter((ct) => ct.id_tipo_cliente !== tipoClienteToDelete.id_tipo_cliente)); // Renamed
      toast({ title: "Éxito", description: "Tipo de cliente eliminado correctamente." });
      setTipoClienteToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoClienteSchema>) => { // Renamed schema
    if (editingTipoCliente) {
      setTiposCliente((prev) => // Renamed
        prev.map((ct) =>
          ct.id_tipo_cliente === editingTipoCliente.id_tipo_cliente ? { ...editingTipoCliente, ...values, created_at: editingTipoCliente.created_at } : ct // Preserve created_at
        )
      );
      toast({ title: "Éxito", description: "Tipo de cliente actualizado." });
    } else {
      const newTipoCliente = { ...values, id_tipo_cliente: generateId(), created_at: new Date().toISOString() }; // Renamed
      setTiposCliente((prev) => [...prev, newTipoCliente]); // Renamed
      toast({ title: "Éxito", description: "Nuevo tipo de cliente creado." });
    }
    setIsFormOpen(false);
    setEditingTipoCliente(null);
  };

  const columns = React.useMemo(
    () => getTipoClienteColumns(handleEditTipoCliente, handleDeleteTipoCliente), // Renamed
    [] 
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposCliente} // Renamed
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Cliente"
        onNew={handleNewTipoCliente} // Renamed
        onEdit={handleEditTipoCliente} // Renamed
        onDelete={handleDeleteTipoCliente} // Renamed
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
          <TipoClienteForm // Renamed
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

    