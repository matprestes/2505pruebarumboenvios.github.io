"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getServiceTypeColumns } from "@/components/service-types/columns";
import { ServiceTypeForm } from "@/components/service-types/service-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { ServiceType } from "@/types";
import { serviceTypeSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data
const initialServiceTypes: ServiceType[] = [
  { id: generateId(), name: "Estándar", description: "Envío regular (3-5 días)", baseRate: 5.00, ratePerKm: 0.10, ratePerKg: 0.50 },
  { id: generateId(), name: "Express", description: "Envío rápido (1-2 días)", baseRate: 15.00, ratePerKm: 0.20, ratePerKg: 1.00 },
  { id: generateId(), name: "Económico", description: "Envío más lento y barato", baseRate: 2.50, ratePerKm: 0.05 },
];


export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [serviceTypeToDelete, setServiceTypeToDelete] = useState<ServiceType | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setServiceTypes(initialServiceTypes);
  }, []);

  const handleNewServiceType = () => {
    setEditingServiceType(null);
    setIsFormOpen(true);
  };

  const handleEditServiceType = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setIsFormOpen(true);
  };

  const handleDeleteServiceType = (serviceType: ServiceType) => {
    setServiceTypeToDelete(serviceType);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceTypeToDelete) {
      setServiceTypes((prev) => prev.filter((st) => st.id !== serviceTypeToDelete.id));
      toast({ title: "Éxito", description: "Tipo de servicio eliminado correctamente." });
      setServiceTypeToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof serviceTypeSchema>) => {
    const processedValues = {
      ...values,
      ratePerKm: values.ratePerKm === '' ? undefined : values.ratePerKm,
      ratePerKg: values.ratePerKg === '' ? undefined : values.ratePerKg,
    };

    if (editingServiceType) {
      setServiceTypes((prev) =>
        prev.map((st) =>
          st.id === editingServiceType.id ? { ...editingServiceType, ...processedValues } as ServiceType : st
        )
      );
      toast({ title: "Éxito", description: "Tipo de servicio actualizado." });
    } else {
      const newServiceType = { ...processedValues, id: generateId() } as ServiceType;
      setServiceTypes((prev) => [...prev, newServiceType]);
      toast({ title: "Éxito", description: "Nuevo tipo de servicio creado." });
    }
    setIsFormOpen(false);
    setEditingServiceType(null);
  };

  const columns = React.useMemo(
    () => getServiceTypeColumns(handleEditServiceType, handleDeleteServiceType),
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={serviceTypes}
        filterColumnId="name"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Servicio"
        onNew={handleNewServiceType}
        onEdit={handleEditServiceType}
        onDelete={handleDeleteServiceType}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingServiceType(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingServiceType ? "Editar Tipo de Servicio" : "Crear Nuevo Tipo de Servicio"}
            </DialogTitle>
          </DialogHeader>
          <ServiceTypeForm
            onSubmit={handleFormSubmit}
            initialData={editingServiceType}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingServiceType(null);
            }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de servicio "${serviceTypeToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
