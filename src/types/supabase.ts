export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      capacidad: {
        Row: {
          carga_max_kg: number | null
          created_at: string
          id: string
          id_repartidor: string
          nombre_vehiculo: string | null
          tipo_vehiculo: string
          volumen_max_m3: number | null
        }
        Insert: {
          carga_max_kg?: number | null
          created_at?: string
          id?: string
          id_repartidor: string
          nombre_vehiculo?: string | null
          tipo_vehiculo: string
          volumen_max_m3?: number | null
        }
        Update: {
          carga_max_kg?: number | null
          created_at?: string
          id?: string
          id_repartidor?: string
          nombre_vehiculo?: string | null
          tipo_vehiculo?: string
          volumen_max_m3?: number | null
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
      clientes: {
        Row: {
          apellido: string | null
          created_at: string
          direccion_completa: string | null
          email: string | null
          estado: boolean | null
          id: string
          id_empresa: string | null
          id_tipo_cliente: string | null
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
        }
        Insert: {
          apellido?: string | null
          created_at?: string
          direccion_completa?: string | null
          email?: string | null
          estado?: boolean | null
          id?: string
          id_empresa?: string | null
          id_tipo_cliente?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
        }
        Update: {
          apellido?: string | null
          created_at?: string
          direccion_completa?: string | null
          email?: string | null
          estado?: boolean | null
          id?: string
          id_empresa?: string | null
          id_tipo_cliente?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_id_tipo_cliente_fkey"
            columns: ["id_tipo_cliente"]
            isOneToOne: false
            referencedRelation: "tipos_cliente"
            referencedColumns: ["id_tipo_cliente"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string
          cuit: string | null
          direccion_fiscal: string | null
          email_contacto: string | null
          id: string
          id_tipo_empresa: string | null
          latitud: number | null
          longitud: number | null
          notas: string | null
          razon_social: string
          telefono_contacto: string | null
        }
        Insert: {
          created_at?: string
          cuit?: string | null
          direccion_fiscal?: string | null
          email_contacto?: string | null
          id?: string
          id_tipo_empresa?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          razon_social: string
          telefono_contacto?: string | null
        }
        Update: {
          created_at?: string
          cuit?: string | null
          direccion_fiscal?: string | null
          email_contacto?: string | null
          id?: string
          id_tipo_empresa?: string | null
          latitud?: number | null
          longitud?: number | null
          notas?: string | null
          razon_social?: string
          telefono_contacto?: string | null
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
      envios: {
        Row: {
          client_location: string | null
          created_at: string
          dimensiones_cm: string | null
          direccion_destino: string
          direccion_origen: string | null
          distancia_km: number | null
          estado: string
          fecha_solicitud: string
          id: string
          id_cliente: string
          id_empresa_cliente: string | null
          id_repartidor_preferido: string | null
          id_reparto: string | null
          id_tipo_envio: string
          id_tipo_paquete: string
          id_tipo_servicio: string
          latitud_destino: number | null
          latitud_origen: number | null
          longitud_destino: number | null
          longitud_origen: number | null
          notas: string | null
          peso: number | null
          precio_calculado: number | null
          precio_servicio_final: number | null
          precio_total: number | null
          reasoning: string | null
          suggested_options: Json | null
        }
        Insert: {
          client_location?: string | null
          created_at?: string
          dimensiones_cm?: string | null
          direccion_destino: string
          direccion_origen?: string | null
          distancia_km?: number | null
          estado?: string
          fecha_solicitud?: string
          id?: string
          id_cliente: string
          id_empresa_cliente?: string | null
          id_repartidor_preferido?: string | null
          id_reparto?: string | null
          id_tipo_envio: string
          id_tipo_paquete: string
          id_tipo_servicio: string
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          notas?: string | null
          peso?: number | null
          precio_calculado?: number | null
          precio_servicio_final?: number | null
          precio_total?: number | null
          reasoning?: string | null
          suggested_options?: Json | null
        }
        Update: {
          client_location?: string | null
          created_at?: string
          dimensiones_cm?: string | null
          direccion_destino?: string
          direccion_origen?: string | null
          distancia_km?: number | null
          estado?: string
          fecha_solicitud?: string
          id?: string
          id_cliente?: string
          id_empresa_cliente?: string | null
          id_repartidor_preferido?: string | null
          id_reparto?: string | null
          id_tipo_envio?: string
          id_tipo_paquete?: string
          id_tipo_servicio?: string
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          notas?: string | null
          peso?: number | null
          precio_calculado?: number | null
          precio_servicio_final?: number | null
          precio_total?: number | null
          reasoning?: string | null
          suggested_options?: Json | null
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
            foreignKeyName: "envios_id_empresa_cliente_fkey"
            columns: ["id_empresa_cliente"]
            isOneToOne: false
            referencedRelation: "empresas"
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
            foreignKeyName: "envios_id_reparto_fkey"
            columns: ["id_reparto"]
            isOneToOne: false
            referencedRelation: "repartos"
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
        ]
      }
      paradas_reparto: {
        Row: {
          created_at: string
          direccion_parada: string
          estado_parada: string
          hora_estimada_llegada: string | null
          hora_real_llegada: string | null
          id: string
          id_envio: string
          id_reparto: string
          orden: number
          tipo_parada: Database["public"]["Enums"]["tipoparadaenum"]
        }
        Insert: {
          created_at?: string
          direccion_parada: string
          estado_parada?: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: string
          id_envio: string
          id_reparto: string
          orden: number
          tipo_parada: Database["public"]["Enums"]["tipoparadaenum"]
        }
        Update: {
          created_at?: string
          direccion_parada?: string
          estado_parada?: string
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: string
          id_envio?: string
          id_reparto?: string
          orden?: number
          tipo_parada?: Database["public"]["Enums"]["tipoparadaenum"]
        }
        Relationships: [
          {
            foreignKeyName: "paradas_reparto_id_envio_fkey"
            columns: ["id_envio"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paradas_reparto_id_reparto_fkey"
            columns: ["id_reparto"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
        ]
      }
      repartidores: {
        Row: {
          activo: boolean
          apellido: string
          created_at: string
          dni: string | null
          email: string | null
          id: string
          nombre: string
          telefono: string | null
        }
        Insert: {
          activo?: boolean
          apellido: string
          created_at?: string
          dni?: string | null
          email?: string | null
          id?: string
          nombre: string
          telefono?: string | null
        }
        Update: {
          activo?: boolean
          apellido?: string
          created_at?: string
          dni?: string | null
          email?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      repartos: {
        Row: {
          created_at: string
          estado: string
          fecha_programada: string
          id: string
          id_empresa: string | null
          id_empresa_despachante: string | null
          id_repartidor: string | null
          id_tipo_reparto: string
          tipo: string | null
        }
        Insert: {
          created_at?: string
          estado?: string
          fecha_programada?: string
          id?: string
          id_empresa?: string | null
          id_empresa_despachante?: string | null
          id_repartidor?: string | null
          id_tipo_reparto: string
          tipo?: string | null
        }
        Update: {
          created_at?: string
          estado?: string
          fecha_programada?: string
          id?: string
          id_empresa?: string | null
          id_empresa_despachante?: string | null
          id_repartidor?: string | null
          id_tipo_reparto?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartos_id_empresa_despachante_fkey"
            columns: ["id_empresa_despachante"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
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
        ]
      }
      tarifas_servicio: {
        Row: {
          created_at: string
          hasta_km: number
          id_tarifa_servicio: string
          id_tipo_servicio: string
          precio: number
        }
        Insert: {
          created_at?: string
          hasta_km: number
          id_tarifa_servicio?: string
          id_tipo_servicio: string
          precio: number
        }
        Update: {
          created_at?: string
          hasta_km?: number
          id_tarifa_servicio?: string
          id_tipo_servicio?: string
          precio?: number
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
      tipos_cliente: {
        Row: {
          created_at: string
          descripcion: string | null
          id_tipo_cliente: string
          nombre: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id_tipo_cliente?: string
          nombre: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id_tipo_cliente?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_empresa: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_envio: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id_tipo_envio: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id_tipo_envio?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id_tipo_envio?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_paquete: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          dimensiones: string | null
          id_tipo_paquete: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          dimensiones?: string | null
          id_tipo_paquete?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          dimensiones?: string | null
          id_tipo_paquete?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_reparto: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id_tipo_reparto: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id_tipo_reparto?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id_tipo_reparto?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_servicio: {
        Row: {
          created_at: string
          descripcion: string | null
          id_tipo_servicio: string
          nombre: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id_tipo_servicio?: string
          nombre: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id_tipo_servicio?: string
          nombre?: string
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
      capacidad_enum: "moto" | "auto" | "camioneta" | "bici"
      estado_envio_enum:
        | "pendiente"
        | "asignado"
        | "en curso"
        | "entregado"
        | "cancelado"
      estado_repartidor_enum: "activo" | "inactivo"
      tipo_cliente_enum: "Individual" | "Empresarial" | "Temporal"
      tipo_empresa_enum:
        | "Delivery Gastronómico"
        | "Productos Personales"
        | "Mensajería"
        | "Varios"
      tipo_envio_general_enum: "Empresarial" | "Individual"
      tipo_parada_enum: "entrega" | "retiro"
      tipo_reparto_enum: "individual" | "empresa"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      capacidad_enum: ["moto", "auto", "camioneta", "bici"],
      estado_envio_enum: [
        "pendiente",
        "asignado",
        "en curso",
        "entregado",
        "cancelado",
      ],
      estado_repartidor_enum: ["activo", "inactivo"],
      tipo_cliente_enum: ["Individual", "Empresarial", "Temporal"],
      tipo_empresa_enum: [
        "Delivery Gastronómico",
        "Productos Personales",
        "Mensajería",
        "Varios",
      ],
      tipo_envio_general_enum: ["Empresarial", "Individual"],
      tipo_parada_enum: ["entrega", "retiro"],
      tipo_reparto_enum: ["individual", "empresa"],
      tipoparadaenum: ["RECOLECCION", "ENTREGA"],
    },
  },
} as const
