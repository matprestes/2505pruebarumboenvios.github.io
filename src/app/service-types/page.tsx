
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
  {
    id: generateId(),
    name: "Envíos Express",
    description: "Entrega urgente en la ciudad.",
    distanceRates: [
      { id: generateId(), distancia_hasta_km: 2.0, precio: 1100.00, fecha_vigencia_desde: "2024-07-01" },
      { id: generateId(), distancia_hasta_km: 4.0, precio: 1650.00, fecha_vigencia_desde: "2024-07-01" },
      { id: generateId(), distancia_hasta_km: 6.0, precio: 4200.00, fecha_vigencia_desde: "2025-05-23" },
      { id: generateId(), distancia_hasta_km: 8.0, precio: 5800.00, fecha_vigencia_desde: "2025-05-23" },
    ],
  },
  {
    id: generateId(),
    name: "Envíos LowCost",
    description: "Entrega económica programada.",
    distanceRates: [
      { id: generateId(), distancia_hasta_km: 3.0, precio: 550.00, fecha_vigencia_desde: "2024-06-01" },
      { id: generateId(), distancia_hasta_km: 5.0, precio: 770.00, fecha_vigencia_desde: "2024-06-01" },
      { id: generateId(), distancia_hasta_km: 10.0, precio: 1000.00, fecha_vigencia_desde: "2024-01-01" },
    ],
  },
  {
    id: generateId(),
    name: "Moto Fija",
    description: "Servicio de mensajería con moto asignada para cliente.",
    distanceRates: [ // Example: Could be a flat rate or tiered based on time/contract
      { id: generateId(), distancia_hasta_km: 50, precio: 50000, fecha_vigencia_desde: "2024-01-01" } // Monthly fixed rate example
    ]
  },
  {
    id: generateId(),
    name: "Plan Emprendedores",
    description: "Tarifas especiales y soluciones para emprendedores.",
    distanceRates: [
      { id: generateId(), distancia_hasta_km: 5, precio: 600, fecha_vigencia_desde: "2024-05-01" },
      { id: generateId(), distancia_hasta_km: 10, precio: 900, fecha_vigencia_desde: "2024-05-01" },
    ]
  },
  {
    id: generateId(),
    name: "Envíos Flex",
    description: "Servicio adaptable a necesidades específicas.",
    distanceRates: [] // Starts with no specific rates, to be configured
  }
];


export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [serviceTypeToDelete, setServiceTypeToDelete] = useState<ServiceType | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate fetching data and ensuring distanceRates is always an array
    const loadedServiceTypes = initialServiceTypes.map(st => ({
      ...st,
      distanceRates: st.distanceRates || [], 
    }));
    setServiceTypes(loadedServiceTypes);
  }, []);

  const handleNewServiceType = () => {
    setEditingServiceType(null);
    setIsFormOpen(true);
  };

  const handleEditServiceType = (serviceType: ServiceType) => {
    setEditingServiceType({
      ...serviceType,
      distanceRates: serviceType.distanceRates || [], // Ensure distanceRates is an array
    });
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
    // Ensure distanceRates have unique IDs if any are new (though generateId in form should handle it)
    const processedValues = {
      ...values,
      distanceRates: values.distanceRates?.map(dr => ({ ...dr, id: dr.id || generateId() })) || [],
    };

    if (editingServiceType) {
      setServiceTypes((prev) =>
        prev.map((st) =>
          st.id === editingServiceType.id ? { ...editingServiceType, ...processedValues } : st
        )
      );
      toast({ title: "Éxito", description: "Tipo de servicio actualizado." });
    } else {
      const newServiceType = { ...processedValues, id: generateId() };
      setServiceTypes((prev) => [...prev, newServiceType]);
      toast({ title: "Éxito", description: "Nuevo tipo de servicio creado." });
    }
    setIsFormOpen(false);
    setEditingServiceType(null);
  };

  const columns = React.useMemo(
    () => getServiceTypeColumns(handleEditServiceType, handleDeleteServiceType),
    [] // Re-memoize if handler functions change identity, though typically stable.
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
        <DialogContent className="sm:max-w-2xl"> {/* Increased width for more complex form */}
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
