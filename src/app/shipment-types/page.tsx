
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getShipmentTypeColumns } from "@/components/shipment-types/columns";
import { ShipmentTypeForm } from "@/components/shipment-types/shipment-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { ShipmentType } from "@/types";
import { shipmentTypeSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data
const initialShipmentTypes: ShipmentType[] = [
  { id: generateId(), name: "Envío Estándar Nacional", description: "Entrega estándar a nivel nacional.", estado: "pendiente" },
  { id: generateId(), name: "Envío Frágil Asegurado", description: "Para artículos delicados con seguro.", estado: "asignado" },
  { id: generateId(), name: "Envío Internacional Económico", description: "Opción más barata para envíos al exterior.", estado: "en transito" },
];

export default function ShipmentTypesPage() {
  const [shipmentTypes, setShipmentTypes] = useState<ShipmentType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipmentType, setEditingShipmentType] = useState<ShipmentType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [shipmentTypeToDelete, setShipmentTypeToDelete] = useState<ShipmentType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setShipmentTypes(initialShipmentTypes);
  }, []);

  const handleNewShipmentType = () => {
    setEditingShipmentType(null);
    setIsFormOpen(true);
  };

  const handleEditShipmentType = (shipmentType: ShipmentType) => {
    setEditingShipmentType(shipmentType);
    setIsFormOpen(true);
  };

  const handleDeleteShipmentType = (shipmentType: ShipmentType) => {
    setShipmentTypeToDelete(shipmentType);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (shipmentTypeToDelete) {
      setShipmentTypes((prev) => prev.filter((st) => st.id !== shipmentTypeToDelete.id));
      toast({ title: "Éxito", description: "Tipo de envío eliminado correctamente." });
      setShipmentTypeToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof shipmentTypeSchema>) => {
    if (editingShipmentType) {
      setShipmentTypes((prev) =>
        prev.map((st) =>
          st.id === editingShipmentType.id ? { ...editingShipmentType, ...values } : st
        )
      );
      toast({ title: "Éxito", description: "Tipo de envío actualizado." });
    } else {
      const newShipmentType = { ...values, id: generateId() };
      setShipmentTypes((prev) => [...prev, newShipmentType]);
      toast({ title: "Éxito", description: "Nuevo tipo de envío creado." });
    }
    setIsFormOpen(false);
    setEditingShipmentType(null);
  };
  
  const columns = React.useMemo(
    () => getShipmentTypeColumns(handleEditShipmentType, handleDeleteShipmentType),
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={shipmentTypes}
        filterColumnId="name"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Envío"
        onNew={handleNewShipmentType}
        onEdit={handleEditShipmentType}
        onDelete={handleDeleteShipmentType}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingShipmentType(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingShipmentType ? "Editar Tipo de Envío" : "Crear Nuevo Tipo de Envío"}
            </DialogTitle>
          </DialogHeader>
          <ShipmentTypeForm
            onSubmit={handleFormSubmit}
            initialData={editingShipmentType}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingShipmentType(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de envío "${shipmentTypeToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
