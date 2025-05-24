
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoServicioColumns } from "@/components/service-types/columns";
import { TipoServicioForm } from "@/components/service-types/service-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoServicio, TarifaServicio } from "@/types";
import { tipoServicioSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposServicio: TipoServicio[] = [
  {
    id_tipo_servicio: generateId(),
    nombre: "Envíos Express",
    descripcion: "Entrega urgente en la ciudad.",
    created_at: new Date().toISOString(),
    tarifas_servicio: [
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 5.0, precio: 1500.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 10.0, precio: 2500.00, created_at: new Date().toISOString() },
    ],
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Envíos LowCost",
    descripcion: "Entrega económica programada.",
    created_at: new Date().toISOString(),
    tarifas_servicio: [
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 5.0, precio: 800.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 10.0, precio: 1200.00, created_at: new Date().toISOString() },
    ],
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Moto Fija",
    descripcion: "Servicio de mensajería con moto asignada para cliente.",
    created_at: new Date().toISOString(),
    tarifas_servicio: [ 
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 50, precio: 50000, created_at: new Date().toISOString() }
    ]
  },
].map(ts => {
  const serviceId = ts.id_tipo_servicio;
  return {
    ...ts, 
    tarifas_servicio: ts.tarifas_servicio?.map(tarifa => ({...tarifa, id_tipo_servicio: serviceId!})) || [] 
  };
});


export default function TiposServicioPage() {
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoServicio, setEditingTipoServicio] = useState<TipoServicio | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoServicioToDelete, setTipoServicioToDelete] = useState<TipoServicio | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadedServiceTypes = initialTiposServicio.map(st => ({
      ...st,
      tarifas_servicio: st.tarifas_servicio || [], 
    }));
    setTiposServicio(loadedServiceTypes);
  }, []);

  const handleNewTipoServicio = () => {
    setEditingTipoServicio(null);
    setIsFormOpen(true);
  };

  const handleEditTipoServicio = (tipoServicio: TipoServicio) => {
    setEditingTipoServicio({
      ...tipoServicio,
      tarifas_servicio: tipoServicio.tarifas_servicio || [], 
    });
    setIsFormOpen(true);
  };

  const handleDeleteTipoServicio = (tipoServicio: TipoServicio) => {
    setTipoServicioToDelete(tipoServicio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoServicioToDelete) {
      setTiposServicio((prev) => prev.filter((st) => st.id_tipo_servicio !== tipoServicioToDelete.id_tipo_servicio));
      toast({ title: "Éxito", description: "Tipo de servicio eliminado correctamente." });
      setTipoServicioToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoServicioSchema>) => {
    const serviceId = editingTipoServicio?.id_tipo_servicio || generateId();
    
    const processedValues = {
      ...values,
      tarifas_servicio: values.tarifas_servicio?.map(dr => ({ 
        ...dr, 
        id_tarifa_servicio: dr.id_tarifa_servicio || generateId(), 
        id_tipo_servicio: serviceId, // Ensure FK is set
        created_at: dr.created_at || new Date().toISOString() 
      })) || [],
    };

    if (editingTipoServicio) {
      const updatedTipoServicio: TipoServicio = {
        ...editingTipoServicio,
        ...processedValues,
        id_tipo_servicio: serviceId,
        created_at: editingTipoServicio.created_at || new Date().toISOString(),
      };
      setTiposServicio((prev) =>
        prev.map((st) =>
          st.id_tipo_servicio === editingTipoServicio.id_tipo_servicio ? updatedTipoServicio : st
        )
      );
      toast({ title: "Éxito", description: "Tipo de servicio actualizado." });
    } else {
      const newTipoServicio: TipoServicio = { 
        ...processedValues, 
        id_tipo_servicio: serviceId, 
        created_at: new Date().toISOString(),
      };
      setTiposServicio((prev) => [...prev, newTipoServicio]);
      toast({ title: "Éxito", description: "Nuevo tipo de servicio creado." });
    }
    setIsFormOpen(false);
    setEditingTipoServicio(null);
  };

  const columns = React.useMemo(
    () => getTipoServicioColumns(handleEditTipoServicio, handleDeleteTipoServicio),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposServicio}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Servicio"
        onNew={handleNewTipoServicio}
        onEdit={handleEditTipoServicio}
        onDelete={handleDeleteTipoServicio}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingTipoServicio(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTipoServicio ? "Editar Tipo de Servicio" : "Crear Nuevo Tipo de Servicio"}
            </DialogTitle>
          </DialogHeader>
          <TipoServicioForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoServicio}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTipoServicio(null);
            }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de servicio "${tipoServicioToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}

    