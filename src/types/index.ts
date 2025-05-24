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

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  baseRate: number;
  ratePerKm?: number;
  ratePerKg?: number;
}

export type EntityType = 'client' | 'package' | 'service';
