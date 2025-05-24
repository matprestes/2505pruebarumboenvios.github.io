
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Based on the new schema from the user's description
export type Database = {
  public: {
    Tables: {
      tipos_cliente: {
        Row: {
          id_tipo_cliente: string // uuid
          nombre: string
          descripcion: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id_tipo_cliente?: string // uuid
          nombre: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id_tipo_cliente?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tipos_paquete: {
        Row: {
          id_tipo_paquete: string // uuid
          nombre: string
          descripcion: string | null
          dimensiones: string | null
          activo: boolean
          created_at: string // timestamptz
        }
        Insert: {
          id_tipo_paquete?: string // uuid
          nombre: string
          descripcion?: string | null
          dimensiones?: string | null
          activo?: boolean
          created_at?: string
        }
        Update: {
          id_tipo_paquete?: string
          nombre?: string
          descripcion?: string | null
          dimensiones?: string | null
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      tipos_servicio: {
        Row: {
          id_tipo_servicio: string // uuid
          nombre: string
          descripcion: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id_tipo_servicio?: string // uuid
          nombre: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id_tipo_servicio?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tarifas_servicio: {
        Row: {
          id_tarifa_servicio: string // uuid
          id_tipo_servicio: string // uuid
          hasta_km: number
          precio: number
          created_at: string // timestamptz
        }
        Insert: {
          id_tarifa_servicio?: string // uuid
          id_tipo_servicio: string // uuid
          hasta_km: number
          precio: number
          created_at?: string
        }
        Update: {
          id_tarifa_servicio?: string
          id_tipo_servicio?: string
          hasta_km?: number
          precio?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tarifas_servicio_tipo_servicio"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id_tipo_servicio"]
          }
        ]
      }
      tipos_reparto: {
        Row: {
          id_tipo_reparto: string // uuid
          nombre: string
          descripcion: string | null
          activo: boolean
          created_at: string // timestamptz
        }
        Insert: {
          id_tipo_reparto?: string // uuid
          nombre: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
        }
        Update: {
          id_tipo_reparto?: string
          nombre?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      tipos_envio: {
        Row: {
          id_tipo_envio: string // uuid
          nombre: string
          descripcion: string | null
          activo: boolean
          created_at: string // timestamptz
        }
        Insert: {
          id_tipo_envio?: string // uuid
          nombre: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
        }
        Update: {
          id_tipo_envio?: string
          nombre?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          id: string // uuid, PK
          id_tipo_cliente: string // uuid, FK to tipos_cliente
          nombre: string
          apellido: string | null
          email: string | null
          telefono: string | null
          direccion_completa: string | null
          // Assuming other fields like 'razon_social', 'cuit' might be specific to certain client types
          // or handled via a flexible 'datos_adicionales' JSON field if needed.
          // For now, keeping it simple as per general client info.
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_tipo_cliente: string
          nombre: string
          apellido?: string | null
          email?: string | null
          telefono?: string | null
          direccion_completa?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_tipo_cliente?: string
          nombre?: string
          apellido?: string | null
          email?: string | null
          telefono?: string | null
          direccion_completa?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_clientes_tipo_cliente"
            columns: ["id_tipo_cliente"]
            isOneToOne: false
            referencedRelation: "tipos_cliente"
            referencedColumns: ["id_tipo_cliente"]
          }
        ]
      }
      empresas: {
        Row: {
          id: string // uuid, PK
          id_tipo_empresa: string // uuid, FK to tipos_empresa
          razon_social: string
          cuit: string | null
          email_contacto: string | null
          telefono_contacto: string | null
          direccion_fiscal: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_tipo_empresa: string
          razon_social: string
          cuit?: string | null
          email_contacto?: string | null
          telefono_contacto?: string | null
          direccion_fiscal?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_tipo_empresa?: string
          razon_social?: string
          cuit?: string | null
          email_contacto?: string | null
          telefono_contacto?: string | null
          direccion_fiscal?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresas_tipo_empresa"
            columns: ["id_tipo_empresa"]
            isOneToOne: false
            referencedRelation: "tipos_empresa"
            referencedColumns: ["id"]
          }
        ]
      }
      tipos_empresa: {
        Row: {
          id: string // uuid, PK
          nombre: string
          descripcion: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
        }
        Relationships: []
      }
      repartidores: {
        Row: {
          id: string // uuid, PK
          nombre: string
          apellido: string
          dni: string | null
          telefono: string | null
          email: string | null
          activo: boolean
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          dni?: string | null
          telefono?: string | null
          email?: string | null
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          dni?: string | null
          telefono?: string | null
          email?: string | null
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      capacidad: {
        Row: {
          id: string // uuid, PK
          id_repartidor: string // uuid, FK to repartidores
          tipo_vehiculo: string // e.g., 'moto', 'auto', 'bicicleta'
          carga_max_kg: number | null
          volumen_max_m3: number | null // Assuming m3, could be cm3
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_repartidor: string
          tipo_vehiculo: string
          carga_max_kg?: number | null
          volumen_max_m3?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          id_repartidor?: string
          tipo_vehiculo?: string
          carga_max_kg?: number | null
          volumen_max_m3?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_capacidad_repartidor"
            columns: ["id_repartidor"]
            isOneToOne: false // A repartidor could have multiple capacities over time, or one current. Assuming one current active.
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          }
        ]
      }
      repartos: {
        Row: {
          id: string // uuid, PK
          id_repartidor: string | null // uuid, FK to repartidores, nullable if unassigned
          id_tipo_reparto: string // uuid, FK to tipos_reparto
          fecha_programada: string // date
          estado: string // e.g., 'PENDIENTE', 'ASIGNADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'
          tipo: string // This was mentioned, example: 'EMPRESA', 'INDIVIDUAL'
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_repartidor?: string | null
          id_tipo_reparto: string
          fecha_programada: string
          estado: string
          tipo: string
          created_at?: string
        }
        Update: {
          id?: string
          id_repartidor?: string | null
          id_tipo_reparto?: string
          fecha_programada?: string
          estado?: string
          tipo?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_repartos_repartidor"
            columns: ["id_repartidor"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_repartos_tipo_reparto"
            columns: ["id_tipo_reparto"]
            isOneToOne: false
            referencedRelation: "tipos_reparto"
            referencedColumns: ["id_tipo_reparto"]
          }
        ]
      }
      envios: {
        Row: {
          id: string // uuid, PK
          id_cliente: string // uuid, FK to clientes
          id_tipo_envio: string // uuid, FK to tipos_envio
          id_tipo_paquete: string // uuid, FK to tipos_paquete
          id_tipo_servicio: string // uuid, FK to tipos_servicio
          origen_direccion: string | null
          destino_direccion: string
          client_location: string | null // text for geocoded info or coordinates
          peso_kg: number | null
          dimensiones_cm: string | null // e.g., "30x20x10"
          fecha_solicitud: string // date
          status: string // text, e.g., 'PENDIENTE', 'ASIGNADO_REPARTO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO'. Default 'pending'
          precio_total: number | null
          id_reparto_asignado: string | null // uuid, FK to repartos, nullable
          suggested_options: Json | null // json
          reasoning: string | null // text
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_cliente: string
          id_tipo_envio: string
          id_tipo_paquete: string
          id_tipo_servicio: string
          origen_direccion?: string | null
          destino_direccion: string
          client_location?: string | null
          peso_kg?: number | null
          dimensiones_cm?: string | null
          fecha_solicitud?: string // default to NOW() in DB is better
          status?: string
          precio_total?: number | null
          id_reparto_asignado?: string | null
          suggested_options?: Json | null
          reasoning?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_cliente?: string
          id_tipo_envio?: string
          id_tipo_paquete?: string
          id_tipo_servicio?: string
          origen_direccion?: string | null
          destino_direccion?: string
          client_location?: string | null
          peso_kg?: number | null
          dimensiones_cm?: string | null
          fecha_solicitud?: string
          status?: string
          precio_total?: number | null
          id_reparto_asignado?: string | null
          suggested_options?: Json | null
          reasoning?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_envios_cliente"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_envios_tipo_envio"
            columns: ["id_tipo_envio"]
            isOneToOne: false
            referencedRelation: "tipos_envio"
            referencedColumns: ["id_tipo_envio"]
          },
          {
            foreignKeyName: "fk_envios_tipo_paquete"
            columns: ["id_tipo_paquete"]
            isOneToOne: false
            referencedRelation: "tipos_paquete"
            referencedColumns: ["id_tipo_paquete"]
          },
          {
            foreignKeyName: "fk_envios_tipo_servicio"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id_tipo_servicio"]
          },
          {
            foreignKeyName: "fk_envios_reparto_asignado"
            columns: ["id_reparto_asignado"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          }
        ]
      }
      paradas_reparto: {
        Row: {
          id: string // uuid, PK
          id_reparto: string // uuid, FK to repartos
          id_envio: string // uuid, FK to envios
          orden_parada: number
          direccion_parada: string // Can be denormalized from envio, or specific if different
          tipo_parada: "RECOLECCION" | "ENTREGA" // enum public.tipoparadaenum
          estado_parada: string // e.g., 'PENDIENTE', 'COMPLETADA', 'FALLIDA'
          hora_estimada_llegada: string | null // time
          hora_real_llegada: string | null // time
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_reparto: string
          id_envio: string
          orden_parada: number
          direccion_parada: string
          tipo_parada: "RECOLECCION" | "ENTREGA"
          estado_parada: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_reparto?: string
          id_envio?: string
          orden_parada?: number
          direccion_parada?: string
          tipo_parada?: "RECOLECCION" | "ENTREGA"
          estado_parada?: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_paradas_reparto_reparto"
            columns: ["id_reparto"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_paradas_reparto_envio"
            columns: ["id_envio"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          }
        ]
      }
      tarifas_distancia_calculadora: {
         Row: {
          id: string // uuid, PK
          tipo_calculadora: string // e.g., 'express', 'lowcost', 'personalizado_cliente_x'
          distancia_hasta_km: number
          precio: number
          fecha_vigencia_desde: string // date
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          tipo_calculadora: string
          distancia_hasta_km: number
          precio: number
          fecha_vigencia_desde?: string
          created_at?: string
        }
        Update: {
          id?: string
          tipo_calculadora?: string
          distancia_hasta_km?: number
          precio?: number
          fecha_vigencia_desde?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipoparadaenum: "RECOLECCION" | "ENTREGA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never


// Custom Application Types - Renamed to Spanish and updated fields
export type TipoCliente = Tables<'tipos_cliente'>;
export type TipoPaquete = Tables<'tipos_paquete'>;
export type TarifaServicio = Tables<'tarifas_servicio'>;
export type TipoServicio = Omit<Tables<'tipos_servicio'>, 'created_at'> & {
  tarifas_servicio?: TarifaServicio[];
};
export type TipoReparto = Tables<'tipos_reparto'>;
export type TipoEnvio = Tables<'tipos_envio'>;

// New entity types based on the prompt
export type Cliente = Tables<'clientes'>;
export type Empresa = Tables<'empresas'>;
export type TipoEmpresa = Tables<'tipos_empresa'>;
export type Repartidor = Tables<'repartidores'>;
export type Capacidad = Tables<'capacidad'>;
export type Reparto = Tables<'repartos'>;
export type Envio = Tables<'envios'>;
export type ParadaReparto = Tables<'paradas_reparto'>;
export type TarifaDistanciaCalculadora = Tables<'tarifas_distancia_calculadora'>;


// Enum-like constants for status fields previously in config types, now in instance types
export const tipoParadaEnum = ["RECOLECCION", "ENTREGA"] as const;
export type TipoParadaEnum = typeof tipoParadaEnum[number];

export const estadoRepartoValues = ["PENDIENTE", "ASIGNADO", "EN_CURSO", "COMPLETADO", "CANCELADO"] as const;
export type EstadoReparto = typeof estadoRepartoValues[number];

export const estadoEnvioValues = ["PENDIENTE", "ASIGNADO_REPARTO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"] as const;
export type EstadoEnvio = typeof estadoEnvioValues[number];


// For AI Naming Suggestions - ensure these match what the AI flow expects or update flow
export type EntityType = 'cliente' | 'paquete' | 'servicio' | 'reparto' | 'envio' | 'empresa' | 'repartidor';


// Constants for Supabase schema (if needed elsewhere, though types are usually preferred)
export const Constants = {
  public: {
    Enums: {
      tipoparadaenum: ["RECOLECCION", "ENTREGA"],
    },
  },
} as const

    