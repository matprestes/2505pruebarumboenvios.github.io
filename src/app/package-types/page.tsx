
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoPaqueteColumns } from "@/components/package-types/columns"; // Renamed
import { TipoPaqueteForm } from "@/components/package-types/package-type-form"; // Renamed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoPaquete } from "@/types"; // Renamed
import { tipoPaqueteSchema } from "@/lib/schemas"; // Renamed
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposPaquete: TipoPaquete[] = [ // Renamed
  { id_tipo_paquete: generateId(), nombre: "Sobre", descripcion: "Documentos y objetos planos", dimensiones: "Max 30x40cm, 0.5kg", activo: true, created_at: new Date().toISOString() },
  { id_tipo_paquete: generateId(), nombre: "Paquete Pequeño", descripcion: "Cajas pequeñas", dimensiones: "Max 20x20x20cm, 2kg", activo: true, created_at: new Date().toISOString() },
  { id_tipo_paquete: generateId(), nombre: "Paquete Mediano", descripcion: "Cajas medianas", dimensiones: "Max 40x40x40cm, 10kg", activo: false, created_at: new Date().toISOString() },
];

export default function TiposPaquetePage() { // Renamed
  const [tiposPaquete, setTiposPaquete] = useState<TipoPaquete[]>([]); // Renamed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoPaquete, setEditingTipoPaquete] = useState<TipoPaquete | null>(null); // Renamed
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoPaqueteToDelete, setTipoPaqueteToDelete] = useState<TipoPaquete | null>(null); // Renamed
  const { toast } = useToast();

  useEffect(() => {
    setTiposPaquete(initialTiposPaquete); // Renamed
  }, []);

  const handleNewTipoPaquete = () => { // Renamed
    setEditingTipoPaquete(null);
    setIsFormOpen(true);
  };

  const handleEditTipoPaquete = (tipoPaquete: TipoPaquete) => { // Renamed
    setEditingTipoPaquete(tipoPaquete);
    setIsFormOpen(true);
  };

  const handleDeleteTipoPaquete = (tipoPaquete: TipoPaquete) => { // Renamed
    setTipoPaqueteToDelete(tipoPaquete);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoPaqueteToDelete) {
      setTiposPaquete((prev) => prev.filter((pt) => pt.id_tipo_paquete !== tipoPaqueteToDelete.id_tipo_paquete)); // Renamed
      toast({ title: "Éxito", description: "Tipo de paquete eliminado correctamente." });
      setTipoPaqueteToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoPaqueteSchema>) => { // Renamed schema
    if (editingTipoPaquete) {
      setTiposPaquete((prev) => // Renamed
        prev.map((pt) =>
          pt.id_tipo_paquete === editingTipoPaquete.id_tipo_paquete ? { ...editingTipoPaquete, ...values, created_at: editingTipoPaquete.created_at } : pt // Preserve created_at
        )
      );
      toast({ title: "Éxito", description: "Tipo de paquete actualizado." });
    } else {
      const newTipoPaquete = { ...values, id_tipo_paquete: generateId(), created_at: new Date().toISOString(), activo: values.activo ?? true }; // Renamed
      setTiposPaquete((prev) => [...prev, newTipoPaquete]); // Renamed
      toast({ title: "Éxito", description: "Nuevo tipo de paquete creado." });
    }
    setIsFormOpen(false);
    setEditingTipoPaquete(null);
  };
  
  const columns = React.useMemo(
    () => getTipoPaqueteColumns(handleEditTipoPaquete, handleDeleteTipoPaquete), // Renamed
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposPaquete} // Renamed
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Paquete"
        onNew={handleNewTipoPaquete} // Renamed
        onEdit={handleEditTipoPaquete} // Renamed
        onDelete={handleDeleteTipoPaquete} // Renamed
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingTipoPaquete(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTipoPaquete ? "Editar Tipo de Paquete" : "Crear Nuevo Tipo de Paquete"}
            </DialogTitle>
          </DialogHeader>
          <TipoPaqueteForm // Renamed
            onSubmit={handleFormSubmit}
            initialData={editingTipoPaquete}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTipoPaquete(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de paquete "${tipoPaqueteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}

    