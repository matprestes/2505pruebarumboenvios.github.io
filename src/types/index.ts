
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

export type EntityType = 'client' | 'package' | 'service';
