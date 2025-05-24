
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoRepartoColumns } from "@/components/delivery-types/columns"; // Renamed
import { TipoRepartoForm } from "@/components/delivery-types/delivery-type-form"; // Renamed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoReparto } from "@/types"; // Renamed
import { tipoRepartoSchema } from "@/lib/schemas"; // Renamed
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure for tipos_reparto
const initialTiposReparto: TipoReparto[] = [ // Renamed
  { id_tipo_reparto: generateId(), nombre: "Reparto Matutino Estándar", descripcion: "Entregas programadas por la mañana.", activo: true, created_at: new Date().toISOString() },
  { id_tipo_reparto: generateId(), nombre: "Reparto Urgente Individual", descripcion: "Entrega prioritaria para un solo cliente.", activo: true, created_at: new Date().toISOString() },
  { id_tipo_reparto: generateId(), nombre: "Recogida Vespertina", descripcion: "Recogidas por la tarde.", activo: false, created_at: new Date().toISOString() },
];

export default function TiposRepartoPage() { // Renamed
  const [tiposReparto, setTiposReparto] = useState<TipoReparto[]>([]); // Renamed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoReparto, setEditingTipoReparto] = useState<TipoReparto | null>(null); // Renamed
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoRepartoToDelete, setTipoRepartoToDelete] = useState<TipoReparto | null>(null); // Renamed
  const { toast } = useToast();

  useEffect(() => {
    setTiposReparto(initialTiposReparto); // Renamed
  }, []);

  const handleNewTipoReparto = () => { // Renamed
    setEditingTipoReparto(null);
    setIsFormOpen(true);
  };

  const handleEditTipoReparto = (tipoReparto: TipoReparto) => { // Renamed
    setEditingTipoReparto(tipoReparto);
    setIsFormOpen(true);
  };

  const handleDeleteTipoReparto = (tipoReparto: TipoReparto) => { // Renamed
    setTipoRepartoToDelete(tipoReparto);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoRepartoToDelete) {
      setTiposReparto((prev) => prev.filter((dt) => dt.id_tipo_reparto !== tipoRepartoToDelete.id_tipo_reparto)); // Renamed
      toast({ title: "Éxito", description: "Tipo de reparto eliminado correctamente." });
      setTipoRepartoToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoRepartoSchema>) => { // Renamed schema
    if (editingTipoReparto) {
      setTiposReparto((prev) => // Renamed
        prev.map((dt) =>
          dt.id_tipo_reparto === editingTipoReparto.id_tipo_reparto ? { ...editingTipoReparto, ...values, created_at: editingTipoReparto.created_at } : dt // Preserve created_at
        )
      );
      toast({ title: "Éxito", description: "Tipo de reparto actualizado." });
    } else {
      const newTipoReparto = { ...values, id_tipo_reparto: generateId(), created_at: new Date().toISOString(), activo: values.activo ?? true }; // Renamed
      setTiposReparto((prev) => [...prev, newTipoReparto]); // Renamed
      toast({ title: "Éxito", description: "Nuevo tipo de reparto creado." });
    }
    setIsFormOpen(false);
    setEditingTipoReparto(null);
  };
  
  const columns = React.useMemo(
    () => getTipoRepartoColumns(handleEditTipoReparto, handleDeleteTipoReparto), // Renamed
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposReparto} // Renamed
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Reparto"
        onNew={handleNewTipoReparto} // Renamed
        onEdit={handleEditTipoReparto} // Renamed
        onDelete={handleDeleteTipoReparto} // Renamed
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoReparto(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoReparto ? "Editar Tipo de Reparto" : "Crear Nuevo Tipo de Reparto"}
            </DialogTitle>
          </DialogHeader>
          <TipoRepartoForm // Renamed
            onSubmit={handleFormSubmit}
            initialData={editingTipoReparto}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTipoReparto(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de reparto "${tipoRepartoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}

    