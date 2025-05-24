"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getClientTypeColumns } from "@/components/client-types/columns";
import { ClientTypeForm } from "@/components/client-types/client-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { ClientType } from "@/types";
import { clientTypeSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - replace with API calls in a real application
const initialClientTypes: ClientType[] = [
  { id: generateId(), name: "Individual", description: "Cliente particular" },
  { id: generateId(), name: "Corporativo", description: "Cliente empresarial" },
];

export default function ClientTypesPage() {
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClientType, setEditingClientType] = useState<ClientType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [clientTypeToDelete, setClientTypeToDelete] = useState<ClientType | null>(null);
  const { toast } = useToast();

  // Load initial data on mount (client-side)
  useEffect(() => {
    setClientTypes(initialClientTypes);
  }, []);

  const handleNewClientType = () => {
    setEditingClientType(null);
    setIsFormOpen(true);
  };

  const handleEditClientType = (clientType: ClientType) => {
    setEditingClientType(clientType);
    setIsFormOpen(true);
  };

  const handleDeleteClientType = (clientType: ClientType) => {
    setClientTypeToDelete(clientType);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clientTypeToDelete) {
      setClientTypes((prev) => prev.filter((ct) => ct.id !== clientTypeToDelete.id));
      toast({ title: "Éxito", description: "Tipo de cliente eliminado correctamente." });
      setClientTypeToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof clientTypeSchema>) => {
    if (editingClientType) {
      setClientTypes((prev) =>
        prev.map((ct) =>
          ct.id === editingClientType.id ? { ...editingClientType, ...values } : ct
        )
      );
      toast({ title: "Éxito", description: "Tipo de cliente actualizado." });
    } else {
      const newClientType = { ...values, id: generateId() };
      setClientTypes((prev) => [...prev, newClientType]);
      toast({ title: "Éxito", description: "Nuevo tipo de cliente creado." });
    }
    setIsFormOpen(false);
    setEditingClientType(null);
  };

  const columns = React.useMemo(
    () => getClientTypeColumns(handleEditClientType, handleDeleteClientType),
    [] // Dependencies array ensures columns are memoized. Add specific dependencies if functions change.
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={clientTypes}
        filterColumnId="name"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Cliente"
        onNew={handleNewClientType}
        onEdit={handleEditClientType} // Passed for consistency, actual edit triggered by row action
        onDelete={handleDeleteClientType} // Passed for consistency, actual delete triggered by row action
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingClientType(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingClientType ? "Editar Tipo de Cliente" : "Crear Nuevo Tipo de Cliente"}
            </DialogTitle>
          </DialogHeader>
          <ClientTypeForm
            onSubmit={handleFormSubmit}
            initialData={editingClientType}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingClientType(null);
            }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de cliente "${clientTypeToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
