
"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoPaqueteColumns } from "@/components/tipos-paquete/columns";
import { TipoPaqueteForm } from "@/components/tipos-paquete/package-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoPaquete } from "@/types";
import { tipoPaqueteSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data - updated to new structure
const initialTiposPaquete: TipoPaquete[] = [
  { id_tipo_paquete: generateId(), nombre: "Sobre", descripcion: "Documentos y objetos planos", dimensiones: "Max 30x40cm, 0.5kg", activo: true, created_at: new Date().toISOString() },
  { id_tipo_paquete: generateId(), nombre: "Paquete Pequeño", descripcion: "Cajas pequeñas", dimensiones: "Max 20x20x20cm, 2kg", activo: true, created_at: new Date().toISOString() },
  { id_tipo_paquete: generateId(), nombre: "Paquete Mediano", descripcion: "Cajas medianas", dimensiones: "Max 40x40x40cm, 10kg", activo: true, created_at: new Date().toISOString() },
  { id_tipo_paquete: generateId(), nombre: "Paquete Grande", descripcion: "Cajas grandes", dimensiones: "Max 60x60x60cm, 25kg", activo: false, created_at: new Date().toISOString() },
];

export default function TiposPaquetePage() {
  const [tiposPaquete, setTiposPaquete] = useState<TipoPaquete[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoPaquete, setEditingTipoPaquete] = useState<TipoPaquete | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoPaqueteToDelete, setTipoPaqueteToDelete] = useState<TipoPaquete | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTiposPaquete(initialTiposPaquete);
  }, []);

  const handleNewTipoPaquete = () => {
    setEditingTipoPaquete(null);
    setIsFormOpen(true);
  };

  const handleEditTipoPaquete = (tipoPaquete: TipoPaquete) => {
    setEditingTipoPaquete(tipoPaquete);
    setIsFormOpen(true);
  };

  const handleDeleteTipoPaquete = (tipoPaquete: TipoPaquete) => {
    setTipoPaqueteToDelete(tipoPaquete);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoPaqueteToDelete) {
      setTiposPaquete((prev) => prev.filter((pt) => pt.id_tipo_paquete !== tipoPaqueteToDelete.id_tipo_paquete));
      toast({ title: "Éxito", description: "Tipo de paquete eliminado correctamente." });
      setTipoPaqueteToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof tipoPaqueteSchema>) => {
    if (editingTipoPaquete) {
      setTiposPaquete((prev) =>
        prev.map((pt) =>
          pt.id_tipo_paquete === editingTipoPaquete.id_tipo_paquete ? { ...editingTipoPaquete, ...values, created_at: editingTipoPaquete.created_at } : pt
        )
      );
      toast({ title: "Éxito", description: "Tipo de paquete actualizado." });
    } else {
      const newTipoPaquete: TipoPaquete = { 
        ...values, 
        id_tipo_paquete: generateId(), 
        created_at: new Date().toISOString(), 
        activo: values.activo ?? true 
      };
      setTiposPaquete((prev) => [...prev, newTipoPaquete]);
      toast({ title: "Éxito", description: "Nuevo tipo de paquete creado." });
    }
    setIsFormOpen(false);
    setEditingTipoPaquete(null);
  };
  
  const columns = React.useMemo(
    () => getTipoPaqueteColumns(handleEditTipoPaquete, handleDeleteTipoPaquete),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={tiposPaquete}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Paquete"
        onNew={handleNewTipoPaquete}
        onEdit={handleEditTipoPaquete}
        onDelete={handleDeleteTipoPaquete}
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
          <TipoPaqueteForm
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
