"use client";

import React, { useState, useEffect } from "react";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getPackageTypeColumns } from "@/components/package-types/columns";
import { PackageTypeForm } from "@/components/package-types/package-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { PackageType } from "@/types";
import { packageTypeSchema } from "@/lib/schemas";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock data
const initialPackageTypes: PackageType[] = [
  { id: generateId(), name: "Sobre", description: "Documentos y objetos planos", dimensions: "Max 30x40cm, 0.5kg" },
  { id: generateId(), name: "Paquete Pequeño", description: "Cajas pequeñas", dimensions: "Max 20x20x20cm, 2kg" },
  { id: generateId(), name: "Paquete Mediano", description: "Cajas medianas", dimensions: "Max 40x40x40cm, 10kg" },
];

export default function PackageTypesPage() {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackageType, setEditingPackageType] = useState<PackageType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [packageTypeToDelete, setPackageTypeToDelete] = useState<PackageType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPackageTypes(initialPackageTypes);
  }, []);

  const handleNewPackageType = () => {
    setEditingPackageType(null);
    setIsFormOpen(true);
  };

  const handleEditPackageType = (packageType: PackageType) => {
    setEditingPackageType(packageType);
    setIsFormOpen(true);
  };

  const handleDeletePackageType = (packageType: PackageType) => {
    setPackageTypeToDelete(packageType);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (packageTypeToDelete) {
      setPackageTypes((prev) => prev.filter((pt) => pt.id !== packageTypeToDelete.id));
      toast({ title: "Éxito", description: "Tipo de paquete eliminado correctamente." });
      setPackageTypeToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = (values: z.infer<typeof packageTypeSchema>) => {
    if (editingPackageType) {
      setPackageTypes((prev) =>
        prev.map((pt) =>
          pt.id === editingPackageType.id ? { ...editingPackageType, ...values } : pt
        )
      );
      toast({ title: "Éxito", description: "Tipo de paquete actualizado." });
    } else {
      const newPackageType = { ...values, id: generateId() };
      setPackageTypes((prev) => [...prev, newPackageType]);
      toast({ title: "Éxito", description: "Nuevo tipo de paquete creado." });
    }
    setIsFormOpen(false);
    setEditingPackageType(null);
  };
  
  const columns = React.useMemo(
    () => getPackageTypeColumns(handleEditPackageType, handleDeletePackageType),
    []
  );

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={packageTypes}
        filterColumnId="name"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Paquete"
        onNew={handleNewPackageType}
        onEdit={handleEditPackageType}
        onDelete={handleDeletePackageType}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingPackageType(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPackageType ? "Editar Tipo de Paquete" : "Crear Nuevo Tipo de Paquete"}
            </DialogTitle>
          </DialogHeader>
          <PackageTypeForm
            onSubmit={handleFormSubmit}
            initialData={editingPackageType}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingPackageType(null);
            }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el tipo de paquete "${packageTypeToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
