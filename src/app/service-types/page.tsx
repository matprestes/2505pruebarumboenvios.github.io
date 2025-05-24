
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoServicioColumns } from "@/components/service-types/columns"; // Renamed
import { TipoServicioForm } from "@/components/service-types/service-type-form"; // Renamed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoServicio, TarifaServicio } from "@/types"; // Renamed
import { tipoServicioSchema } from "@/lib/schemas"; // Renamed
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposServicio: TipoServicio[] = [ // Renamed
  {
    id_tipo_servicio: generateId(),
    nombre: "Envíos Express",
    descripcion: "Entrega urgente en la ciudad.",
    tarifas_servicio: [ // Renamed
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 2.0, precio: 1100.00, created_at: new Date().toISOString() }, // id_tipo_servicio will be set later
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 4.0, precio: 1650.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 6.0, precio: 4200.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 8.0, precio: 5800.00, created_at: new Date().toISOString() },
    ],
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Envíos LowCost",
    descripcion: "Entrega económica programada.",
    tarifas_servicio: [
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 3.0, precio: 550.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 5.0, precio: 770.00, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 10.0, precio: 1000.00, created_at: new Date().toISOString() },
    ],
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Moto Fija",
    descripcion: "Servicio de mensajería con moto asignada para cliente.",
    tarifas_servicio: [ 
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 50, precio: 50000, created_at: new Date().toISOString() }
    ]
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Plan Emprendedores",
    descripcion: "Tarifas especiales y soluciones para emprendedores.",
    tarifas_servicio: [
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 5, precio: 600, created_at: new Date().toISOString() },
      { id_tarifa_servicio: generateId(), id_tipo_servicio: "", hasta_km: 10, precio: 900, created_at: new Date().toISOString() },
    ]
  },
  {
    id_tipo_servicio: generateId(),
    nombre: "Envíos Flex",
    descripcion: "Servicio adaptable a necesidades específicas.",
    tarifas_servicio: [] 
  }
].map(ts => ({
    ...ts, 
    tarifas_servicio: ts.tarifas_servicio?.map(tarifa => ({...tarifa, id_tipo_servicio: ts.id_tipo_servicio!})) || [] 
}));


export default function TiposServicioPage() { // Renamed
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]); // Renamed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoServicio, setEditingTipoServicio] = useState<TipoServicio | null>(null); // Renamed
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoServicioToDelete, setTipoServicioToDelete] = useState<TipoServicio | null>(null); // Renamed
  const { toast } = useToast();
  
  useEffect(() => {
    const loadedServiceTypes = initialTiposServicio.map(st => ({
      ...st,
      tarifas_servicio: st.tarifas_servicio || [], 
    }));
    setTiposServicio(loadedServiceTypes);
  }, []);

  const handleNewTipoServicio = () => { // Renamed
    setEditingTipoServicio(null);
    setIsFormOpen(true);
  };

  const handleEditTipoServicio = (tipoServicio: TipoServicio) => { // Renamed
    setEditingTipoServicio({
      ...tipoServicio,
      tarifas_servicio: tipoServicio.tarifas_servicio || [], 
    });
    setIsFormOpen(true);
  };

  const handleDeleteTipoServicio = (tipoServicio: TipoServicio) => { // Renamed
    setTipoServicioToDelete(tipoServicio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoServicioToDelete) {
      setTiposServicio((prev) => prev.filter((st) => st.id_tipo_servicio !== tipoServicioToDelete.id_tipo_servicio)); // Renamed
      toast({ title: "Éxito", description: "Tipo de servicio eliminado correctamente." });
      setTipoServicioToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoServicioSchema>) => { // Renamed schema
    const processedValues = {
      ...values,
      tarifas_servicio: values.tarifas_servicio?.map(dr => ({ 
        ...dr, 
        id_tarifa_servicio: dr.id_tarifa_servicio || generateId(), 
        created_at: new Date().toISOString() // Assuming created_at is set here for mock
      })) || [],
    };

    if (editingTipoServicio) {
      const updatedTipoServicio = {
        ...editingTipoServicio,
        ...processedValues,
        id_tipo_servicio: editingTipoServicio.id_tipo_servicio!, // Ensure ID is present
        tarifas_servicio: processedValues.tarifas_servicio.map(t => ({...t, id_tipo_servicio: editingTipoServicio.id_tipo_servicio!}))
      };
      setTiposServicio((prev) =>
        prev.map((st) =>
          st.id_tipo_servicio === editingTipoServicio.id_tipo_servicio ? updatedTipoServicio : st
        )
      );
      toast({ title: "Éxito", description: "Tipo de servicio actualizado." });
    } else {
      const newId = generateId();
      const newTipoServicio = { 
        ...processedValues, 
        id_tipo_servicio: newId, 
        created_at: new Date().toISOString(),
        tarifas_servicio: processedValues.tarifas_servicio.map(t => ({...t, id_tipo_servicio: newId}))
      };
      setTiposServicio((prev) => [...prev, newTipoServicio]); // Renamed
      toast({ title: "Éxito", description: "Nuevo tipo de servicio creado." });
    }
    setIsFormOpen(false);
    setEditingTipoServicio(null);
  };

  const columns = React.useMemo(
    () => getTipoServicioColumns(handleEditTipoServicio, handleDeleteTipoServicio), // Renamed
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposServicio} // Renamed
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Servicio"
        onNew={handleNewTipoServicio} // Renamed
        onEdit={handleEditTipoServicio} // Renamed
        onDelete={handleDeleteTipoServicio} // Renamed
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
          <TipoServicioForm // Renamed
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

    