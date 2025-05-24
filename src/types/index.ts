
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Based on the new schema
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
          id_tipo_servicio: string // uuid, FK to tipos_servicio
          hasta_km: number
          precio: number
          created_at: string // timestamptz
        }
        Insert: {
          id_tarifa_servicio?: string // uuid
          id_tipo_servicio: string
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
            foreignKeyName: "tarifas_servicio_id_tipo_servicio_fkey"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id_tipo_servicio"]
          },
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
      empresas: {
        Row: {
          id: string // uuid, PK
          id_tipo_empresa: string | null // uuid, FK to tipos_empresa
          razon_social: string
          cuit: string | null
          email_contacto: string | null
          telefono_contacto: string | null
          direccion_fiscal: string | null
          latitud: number | null
          longitud: number | null
          notas: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_tipo_empresa?: string | null
          razon_social: string
          cuit?: string | null
          email_contacto?: string | null
          telefono_contacto?: string | null
          direccion_fiscal?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_tipo_empresa?: string | null
          razon_social?: string
          cuit?: string | null
          email_contacto?: string | null
          telefono_contacto?: string | null
          direccion_fiscal?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_id_tipo_empresa_fkey"
            columns: ["id_tipo_empresa"]
            isOneToOne: false
            referencedRelation: "tipos_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          id: string // uuid, PK
          id_tipo_cliente: string | null // uuid, FK to tipos_cliente
          id_empresa: string | null // uuid, FK to empresas
          nombre: string
          apellido: string | null
          email: string | null
          telefono: string | null
          direccion_completa: string | null
          latitud: number | null
          longitud: number | null
          notas: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_tipo_cliente?: string | null
          id_empresa?: string | null
          nombre: string
          apellido?: string | null
          email?: string | null
          telefono?: string | null
          direccion_completa?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_tipo_cliente?: string | null
          id_empresa?: string | null
          nombre?: string
          apellido?: string | null
          email?: string | null
          telefono?: string | null
          direccion_completa?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_id_tipo_cliente_fkey"
            columns: ["id_tipo_cliente"]
            isOneToOne: false
            referencedRelation: "tipos_cliente"
            referencedColumns: ["id_tipo_cliente"]
          },
          {
            foreignKeyName: "clientes_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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
          nombre_vehiculo: string | null
          tipo_vehiculo: string
          carga_max_kg: number | null
          volumen_max_m3: number | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_repartidor: string
          nombre_vehiculo?: string | null
          tipo_vehiculo: string
          carga_max_kg?: number | null
          volumen_max_m3?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          id_repartidor?: string
          nombre_vehiculo?: string | null
          tipo_vehiculo?: string
          carga_max_kg?: number | null
          volumen_max_m3?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capacidad_id_repartidor_fkey"
            columns: ["id_repartidor"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
        ]
      }
      repartos: {
        Row: {
          id: string // uuid, PK
          id_repartidor: string | null // uuid, FK to repartidores
          id_tipo_reparto: string // uuid, FK to tipos_reparto
          id_empresa: string | null // uuid, FK to empresas (empresa para la que es el reparto)
          id_empresa_despachante: string | null // uuid, FK to empresas (empresa que despacha)
          fecha_programada: string // date
          estado: string // e.g., PENDIENTE, ASIGNADO, EN_CURSO, COMPLETADO, CANCELADO
          tipo: string | null // e.g. EMPRESA, INDIVIDUAL
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_repartidor?: string | null
          id_tipo_reparto: string
          id_empresa?: string | null
          id_empresa_despachante?: string | null
          fecha_programada: string
          estado?: string
          tipo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_repartidor?: string | null
          id_tipo_reparto?: string
          id_empresa?: string | null
          id_empresa_despachante?: string | null
          fecha_programada?: string
          estado?: string
          tipo?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repartos_id_repartidor_fkey"
            columns: ["id_repartidor"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_id_tipo_reparto_fkey"
            columns: ["id_tipo_reparto"]
            isOneToOne: false
            referencedRelation: "tipos_reparto"
            referencedColumns: ["id_tipo_reparto"]
          },
          {
            foreignKeyName: "repartos_id_empresa_fkey" // Empresa para la que es el reparto
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_id_empresa_despachante_fkey" // Empresa que despacha
            columns: ["id_empresa_despachante"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
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
          id_reparto: string | null // uuid, FK to repartos
          id_repartidor_preferido: string | null // uuid, FK to repartidores
          id_empresa_cliente: string | null // uuid, FK to empresas
          direccion_origen: string | null
          latitud_origen: number | null
          longitud_origen: number | null
          direccion_destino: string
          latitud_destino: number | null
          longitud_destino: number | null
          client_location: string | null
          peso: number | null
          dimensiones_cm: string | null
          fecha_solicitud: string // date
          estado: string
          precio_total: number | null
          precio_calculado: number | null
          distancia_km: number | null
          notas: string | null
          suggested_options: Json | null
          reasoning: string | null
          precio_servicio_final: number | null
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_cliente: string
          id_tipo_envio: string
          id_tipo_paquete: string
          id_tipo_servicio: string
          id_reparto?: string | null
          id_repartidor_preferido?: string | null
          id_empresa_cliente?: string | null
          direccion_origen?: string | null
          latitud_origen?: number | null
          longitud_origen?: number | null
          direccion_destino: string
          latitud_destino?: number | null
          longitud_destino?: number | null
          client_location?: string | null
          peso?: number | null
          dimensiones_cm?: string | null
          fecha_solicitud?: string
          estado?: string
          precio_total?: number | null
          precio_calculado?: number | null
          distancia_km?: number | null
          notas?: string | null
          suggested_options?: Json | null
          reasoning?: string | null
          precio_servicio_final?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          id_cliente?: string
          id_tipo_envio?: string
          id_tipo_paquete?: string
          id_tipo_servicio?: string
          id_reparto?: string | null
          id_repartidor_preferido?: string | null
          id_empresa_cliente?: string | null
          direccion_origen?: string | null
          latitud_origen?: number | null
          longitud_origen?: number | null
          direccion_destino?: string
          latitud_destino?: number | null
          longitud_destino?: number | null
          client_location?: string | null
          peso?: number | null
          dimensiones_cm?: string | null
          fecha_solicitud?: string
          estado?: string
          precio_total?: number | null
          precio_calculado?: number | null
          distancia_km?: number | null
          notas?: string | null
          suggested_options?: Json | null
          reasoning?: string | null
          precio_servicio_final?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "envios_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_id_tipo_envio_fkey"
            columns: ["id_tipo_envio"]
            isOneToOne: false
            referencedRelation: "tipos_envio"
            referencedColumns: ["id_tipo_envio"]
          },
          {
            foreignKeyName: "envios_id_tipo_paquete_fkey"
            columns: ["id_tipo_paquete"]
            isOneToOne: false
            referencedRelation: "tipos_paquete"
            referencedColumns: ["id_tipo_paquete"]
          },
          {
            foreignKeyName: "envios_id_tipo_servicio_fkey"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id_tipo_servicio"]
          },
          {
            foreignKeyName: "envios_id_reparto_fkey"
            columns: ["id_reparto"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_id_repartidor_preferido_fkey"
            columns: ["id_repartidor_preferido"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_id_empresa_cliente_fkey"
            columns: ["id_empresa_cliente"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          }
        ]
      }
      paradas_reparto: {
        Row: {
          id: string // uuid, PK
          id_reparto: string // uuid, FK to repartos
          id_envio: string // uuid, FK to envios
          orden: number
          direccion_parada: string
          tipo_parada: Database["public"]["Enums"]["tipoparadaenum"]
          estado_parada: string
          hora_estimada_llegada: string | null // time
          hora_real_llegada: string | null // time
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          id_reparto: string
          id_envio: string
          orden: number
          direccion_parada: string
          tipo_parada: Database["public"]["Enums"]["tipoparadaenum"]
          estado_parada?: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_reparto?: string
          id_envio?: string
          orden?: number
          direccion_parada?: string
          tipo_parada?: Database["public"]["Enums"]["tipoparadaenum"]
          estado_parada?: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paradas_reparto_id_reparto_fkey"
            columns: ["id_reparto"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paradas_reparto_id_envio_fkey"
            columns: ["id_envio"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          },
        ]
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


// Custom Application Types
export type TipoCliente = Tables<'tipos_cliente'>;
export type TipoPaquete = Tables<'tipos_paquete'>;
export type TarifaServicio = Tables<'tarifas_servicio'>;
export type TipoServicio = Tables<'tipos_servicio'> & {
  tarifas_servicio?: TarifaServicio[];
};
export type TipoReparto = Tables<'tipos_reparto'>;
export type TipoEnvio = Tables<'tipos_envio'>;
export type TipoEmpresa = Tables<'tipos_empresa'>;

export type Cliente = Tables<'clientes'> & { tipos_cliente?: Pick<TipoCliente, 'nombre'> | null, empresas?: Pick<Empresa, 'razon_social'> | null };
export type Empresa = Tables<'empresas'> & { tipos_empresa?: Pick<TipoEmpresa, 'nombre'> | null };
export type Repartidor = Tables<'repartidores'>;
export type Capacidad = Tables<'capacidad'> & { repartidores?: Pick<Repartidor, 'nombre' | 'apellido'> | null };
export type Reparto = Tables<'repartos'> & {
  tipos_reparto?: Pick<TipoReparto, 'nombre'> | null,
  repartidores?: Pick<Repartidor, 'nombre' | 'apellido'> | null,
  empresas?: Pick<Empresa, 'razon_social'> | null, // Empresa para la que es el reparto
  empresa_despachante?: Pick<Empresa, 'razon_social'> | null // Empresa que despacha
};
export type Envio = Tables<'envios'> & {
  clientes?: Pick<Cliente, 'nombre' | 'apellido'> | null,
  tipos_envio?: Pick<TipoEnvio, 'nombre'> | null,
  tipos_paquete?: Pick<TipoPaquete, 'nombre'> | null,
  tipos_servicio?: Pick<TipoServicio, 'nombre'> | null,
  repartos?: Pick<Reparto, 'id' | 'fecha_programada' | 'estado'> | null,
  repartidores?: Pick<Repartidor, 'nombre' | 'apellido'> | null, // Repartidor preferido
  empresas?: Pick<Empresa, 'razon_social'> | null // Empresa cliente
};
export type ParadaReparto = Tables<'paradas_reparto'> & { repartos?: Pick<Reparto, 'id' | 'fecha_programada'> | null, envios?: Pick<Envio, 'id' | 'direccion_destino'> | null };


// Enum-like constants
export const tipoParadaEnum = ["RECOLECCION", "ENTREGA"] as const;
export type TipoParadaEnum = typeof tipoParadaEnum[number];

export const estadoRepartoValues = ["PENDIENTE", "ASIGNADO", "EN_CURSO", "COMPLETADO", "CANCELADO"] as const;
export type EstadoReparto = typeof estadoRepartoValues[number];

export const estadoEnvioValues = ["PENDIENTE", "ASIGNADO_REPARTO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"] as const;
export type EstadoEnvio = typeof estadoEnvioValues[number];

// For AI Naming Suggestions
export type EntityType = 'cliente' | 'paquete' | 'servicio' | 'reparto' | 'envio' | 'empresa' | 'repartidor' | 'parada' | 'capacidad' | 'tarifa' | 'tipo_empresa';


export type SelectOption = {
  value: string;
  label: string;
};
