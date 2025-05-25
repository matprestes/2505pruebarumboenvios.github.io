
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getRepartoColumns } from "./columns";
import { RepartoForm } from "./reparto-form";
import { RepartoLoteForm } from "./reparto-lote-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Reparto, SelectOption, RepartoLoteFormValues, Cliente } from "@/types";
import { addRepartoAction, updateRepartoAction, deleteRepartoAction, getRepartoByIdAction, addRepartosLoteAction, getTiposRepartoForSelectAction, getRepartidoresForSelectAction, getEmpresasForSelectAction, getClientesByEmpresaAction } from "@/app/repartos/actions";
import { getTiposEnvioForSelectAction } from "@/app/tipos-envio/actions";
import { getTiposPaqueteForSelectAction } from "@/app/tipos-paquete/actions";
import { getTiposServicioForSelectAction } from "@/app/tipos-servicio/actions";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

interface RepartosDataTableProps {
  initialData: Reparto[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
  tiposRepartoOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasOptions: SelectOption[];
  tiposEnvioOptions: SelectOption[];
  tiposPaqueteOptions: SelectOption[];
  tiposServicioOptions: SelectOption[];
  // getClientesByEmpresaAction is passed directly
}

export default function RepartosDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
  tiposRepartoOptions,
  repartidoresOptions,
  empresasOptions,
  tiposEnvioOptions,
  tiposPaqueteOptions,
  tiposServicioOptions,
}: RepartosDataTableProps) {
  const [data, setData] = useState<Reparto[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReparto, setEditingReparto] = useState<Partial<Reparto> | null>(null);
  
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false); 

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [repartoToDelete, setRepartoToDelete] = useState<Reparto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
    setTotalCount(initialCount);
  }, [initialData, initialCount]);

  const handleNew = () => {
    setEditingReparto(null);
    setIsFormOpen(true);
  };

  const handleNewBatch = () => { 
    setIsBatchFormOpen(true);
  };

  const handleEdit = async (reparto: Reparto) => {
    const fullReparto = await getRepartoByIdAction(reparto.id);
    setEditingReparto(fullReparto);
    setIsFormOpen(true);
  };

  const handleDelete = (reparto: Reparto) => {
    setRepartoToDelete(reparto);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (repartoToDelete) {
      setIsSubmitting(true);
      const result = await deleteRepartoAction(repartoToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setRepartoToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const action = editingReparto?.id ? updateRepartoAction(editingReparto.id, values) : addRepartoAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingReparto(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleBatchFormSubmit = async (values: RepartoLoteFormValues) => {
    setIsSubmitting(true);
    const result = await addRepartosLoteAction(values);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsBatchFormOpen(false);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };


  const columns = useMemo(() => getRepartoColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="estado"
        filterPlaceholder="Buscar por estado, repartidor..."
        newButtonLabel="Nuevo Reparto"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
        customHeaderActions={(
          <Button onClick={handleNewBatch} size="sm" variant="outline" className="ml-2">
            <ListPlus className="mr-2 h-4 w-4" />
            Crear Reparto por Lote
          </Button>
        )}
      />
      {/* Dialog for Single Reparto */}
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingReparto(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReparto?.id ? "Editar Reparto" : "Crear Nuevo Reparto"}
            </DialogTitle>
            {editingReparto?.id && <DialogDescription>ID: {editingReparto.id}</DialogDescription>}
          </DialogHeader>
          <RepartoForm
            onSubmit={handleFormSubmit}
            initialData={editingReparto}
            onCancel={() => { setIsFormOpen(false); setEditingReparto(null); }}
            tiposRepartoOptions={tiposRepartoOptions}
            repartidoresOptions={repartidoresOptions}
            empresasOptions={empresasOptions}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for Batch Reparto Creation */}
      <Dialog open={isBatchFormOpen} onOpenChange={setIsBatchFormOpen}>
        <DialogContent className="sm:max-w-3xl"> {/* Wider dialog for batch form */}
          <DialogHeader>
            <DialogTitle>Crear Repartos por Lote</DialogTitle>
            <DialogDescription>Configure los detalles para generar múltiples repartos.</DialogDescription>
          </DialogHeader>
          <RepartoLoteForm
            onSubmit={handleBatchFormSubmit}
            onCancel={() => setIsBatchFormOpen(false)}
            tiposRepartoOptions={tiposRepartoOptions}
            repartidoresOptions={repartidoresOptions}
            empresasOptions={empresasOptions}
            tiposEnvioOptions={tiposEnvioOptions}
            tiposPaqueteOptions={tiposPaqueteOptions}
            tiposServicioOptions={tiposServicioOptions}
            getClientesByEmpresaAction={getClientesByEmpresaAction}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el reparto ID ${repartoToDelete?.id?.substring(0,8)}...? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
