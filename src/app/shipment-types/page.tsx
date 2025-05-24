
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoEnvioColumns } from "@/components/shipment-types/columns"; // Renamed
import { TipoEnvioForm } from "@/components/shipment-types/shipment-type-form"; // Renamed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoEnvio } from "@/types"; // Renamed
import { tipoEnvioSchema } from "@/lib/schemas"; // Renamed
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated for new structure
const initialTiposEnvio: TipoEnvio[] = [ // Renamed
  { id_tipo_envio: generateId(), nombre: "Envío Estándar Nacional", descripcion: "Entrega estándar a nivel nacional.", activo: true, created_at: new Date().toISOString() },
  { id_tipo_envio: generateId(), nombre: "Envío Frágil Asegurado", descripcion: "Para artículos delicados con seguro.", activo: true, created_at: new Date().toISOString() },
  { id_tipo_envio: generateId(), nombre: "Envío Internacional Económico", descripcion: "Opción más barata para envíos al exterior.", activo: false, created_at: new Date().toISOString() },
];

export default function TiposEnvioPage() { // Renamed
  const [tiposEnvio, setTiposEnvio] = useState<TipoEnvio[]>([]); // Renamed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoEnvio, setEditingTipoEnvio] = useState<TipoEnvio | null>(null); // Renamed
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoEnvioToDelete, setTipoEnvioToDelete] = useState<TipoEnvio | null>(null); // Renamed
  const { toast } = useToast();

  useEffect(() => {
    setTiposEnvio(initialTiposEnvio); // Renamed
  }, []);

  const handleNewTipoEnvio = () => { // Renamed
    setEditingTipoEnvio(null);
    setIsFormOpen(true);
  };

  const handleEditTipoEnvio = (tipoEnvio: TipoEnvio) => { // Renamed
    setEditingTipoEnvio(tipoEnvio);
    setIsFormOpen(true);
  };

  const handleDeleteTipoEnvio = (tipoEnvio: TipoEnvio) => { // Renamed
    setTipoEnvioToDelete(tipoEnvio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoEnvioToDelete) {
      setTiposEnvio((prev) => prev.filter((st) => st.id_tipo_envio !== tipoEnvioToDelete.id_tipo_envio)); // Renamed
      toast({ title: "Éxito", description: "Tipo de envío eliminado correctamente." });
      setTipoEnvioToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoEnvioSchema>) => { // Renamed
    if (editingTipoEnvio) {
      setTiposEnvio((prev) => // Renamed
        prev.map((st) =>
          st.id_tipo_envio === editingTipoEnvio.id_tipo_envio ? { ...editingTipoEnvio, ...values, created_at: editingTipoEnvio.created_at } : st // Preserve created_at
        )
      );
      toast({ title: "Éxito", description: "Tipo de envío actualizado." });
    } else {
      const newTipoEnvio = { ...values, id_tipo_envio: generateId(), created_at: new Date().toISOString(), activo: values.activo ?? true }; // Renamed
      setTiposEnvio((prev) => [...prev, newTipoEnvio]); // Renamed
      toast({ title: "Éxito", description: "Nuevo tipo de envío creado." });
    }
    setIsFormOpen(false);
    setEditingTipoEnvio(null);
  };
  
  const columns = React.useMemo(
    () => getTipoEnvioColumns(handleEditTipoEnvio, handleDeleteTipoEnvio), // Renamed
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposEnvio} // Renamed
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Envío"
        onNew={handleNewTipoEnvio} // Renamed
        onEdit={handleEditTipoEnvio} // Renamed
        onDelete={handleDeleteTipoEnvio} // Renamed
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoEnvio(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoEnvio ? "Editar Tipo de Envío" : "Crear Nuevo Tipo de Envío"}
            </DialogTitle>
          </DialogHeader>
          <TipoEnvioForm // Renamed
            onSubmit={handleFormSubmit}
            initialData={editingTipoEnvio}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTipoEnvio(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de envío "${tipoEnvioToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}

    