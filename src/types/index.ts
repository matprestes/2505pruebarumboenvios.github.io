
export interface ClientType {
  id: string;
  name: string;
  description?: string;
}

export interface PackageType {
  id: string;
  name: string;
  description?: string;
  dimensions?: string; // e.g., "10x10x10 cm"
}

export interface DistanceRate {
  id: string;
  distancia_hasta_km: number;
  precio: number;
  fecha_vigencia_desde: string; // YYYY-MM-DD format
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  distanceRates: DistanceRate[];
}

export type DeliveryStatus = "asignado" | "completo" | "pendiente" | "encurso";
export const deliveryStatuses: DeliveryStatus[] = ["asignado", "completo", "pendiente", "encurso"];

export type DeliveryCategory = "viaje de empresa" | "viaje individual";
export const deliveryCategories: DeliveryCategory[] = ["viaje de empresa", "viaje individual"];

export interface DeliveryType {
  id: string;
  name: string;
  description?: string;
  estado: DeliveryStatus;
  tipo_reparto: DeliveryCategory;
}

export type ShipmentStatus = "en transito" | "entregado" | "asignado" | "pendiente";
export const shipmentStatuses: ShipmentStatus[] = ["en transito", "entregado", "asignado", "pendiente"];

export interface ShipmentType {
  id: string;
  name: string;
  description?: string;
  estado: ShipmentStatus;
}

export type EntityType = 'client' | 'package' | 'service' | 'delivery' | 'shipment';
