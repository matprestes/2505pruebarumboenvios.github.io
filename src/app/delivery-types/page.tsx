
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getDeliveryTypeColumns } from "@/components/delivery-types/columns";
import { DeliveryTypeForm } from "@/components/delivery-types/delivery-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { DeliveryType } from "@/types";
import { deliveryTypeSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data
const initialDeliveryTypes: DeliveryType[] = [
  { id: generateId(), name: "Reparto Matutino Estándar", description: "Entregas programadas por la mañana.", estado: "pendiente", tipo_reparto: "viaje de empresa" },
  { id: generateId(), name: "Reparto Urgente Individual", description: "Entrega prioritaria para un solo cliente.", estado: "asignado", tipo_reparto: "viaje individual" },
  { id: generateId(), name: "Recogida Vespertina", description: "Recogidas por la tarde.", estado: "encurso", tipo_reparto: "viaje de empresa" },
];

export default function DeliveryTypesPage() {
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeliveryType, setEditingDeliveryType] = useState<DeliveryType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [deliveryTypeToDelete, setDeliveryTypeToDelete] = useState<DeliveryType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setDeliveryTypes(initialDeliveryTypes);
  }, []);

  const handleNewDeliveryType = () => {
    setEditingDeliveryType(null);
    setIsFormOpen(true);
  };

  const handleEditDeliveryType = (deliveryType: DeliveryType) => {
    setEditingDeliveryType(deliveryType);
    setIsFormOpen(true);
  };

  const handleDeleteDeliveryType = (deliveryType: DeliveryType) => {
    setDeliveryTypeToDelete(deliveryType);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deliveryTypeToDelete) {
      setDeliveryTypes((prev) => prev.filter((dt) => dt.id !== deliveryTypeToDelete.id));
      toast({ title: "Éxito", description: "Tipo de reparto eliminado correctamente." });
      setDeliveryTypeToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof deliveryTypeSchema>) => {
    if (editingDeliveryType) {
      setDeliveryTypes((prev) =>
        prev.map((dt) =>
          dt.id === editingDeliveryType.id ? { ...editingDeliveryType, ...values } : dt
        )
      );
      toast({ title: "Éxito", description: "Tipo de reparto actualizado." });
    } else {
      const newDeliveryType = { ...values, id: generateId() };
      setDeliveryTypes((prev) => [...prev, newDeliveryType]);
      toast({ title: "Éxito", description: "Nuevo tipo de reparto creado." });
    }
    setIsFormOpen(false);
    setEditingDeliveryType(null);
  };
  
  const columns = React.useMemo(
    () => getDeliveryTypeColumns(handleEditDeliveryType, handleDeleteDeliveryType),
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={deliveryTypes}
        filterColumnId="name"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Reparto"
        onNew={handleNewDeliveryType}
        onEdit={handleEditDeliveryType}
        onDelete={handleDeleteDeliveryType}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingDeliveryType(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDeliveryType ? "Editar Tipo de Reparto" : "Crear Nuevo Tipo de Reparto"}
            </DialogTitle>
          </DialogHeader>
          <DeliveryTypeForm
            onSubmit={handleFormSubmit}
            initialData={editingDeliveryType}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingDeliveryType(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de reparto "${deliveryTypeToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
