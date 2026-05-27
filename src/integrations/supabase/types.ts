export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      registration_team_members: {
        Row: {
          area_atuacao: string
          cpf: string
          created_at: string
          email: string
          formacao: string
          funcao: string
          id: string
          nome: string
          registration_id: string
          telefone: string
        }
        Insert: {
          area_atuacao: string
          cpf: string
          created_at?: string
          email: string
          formacao: string
          funcao: string
          id?: string
          nome: string
          registration_id: string
          telefone: string
        }
        Update: {
          area_atuacao?: string
          cpf?: string
          created_at?: string
          email?: string
          formacao?: string
          funcao?: string
          id?: string
          nome?: string
          registration_id?: string
          telefone?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          cadastro_completo: boolean
          cep: string | null
          cnpj: string | null
          comprovacao_path: string | null
          cpf: string | null
          created_at: string
          eixo_tematico: string | null
          email: string
          endereco: string | null
          estado: string | null
          estagio_ideia: string | null
          id: string
          municipio: string | null
          nome_completo: string
          nome_fantasia: string | null
          nome_social: string | null
          notas_admin: string | null
          razao_social: string | null
          representante_cpf: string | null
          representante_nome: string | null
          status: Database["public"]["Enums"]["registration_status"]
          telefone: string | null
          tipo_inscricao: Database["public"]["Enums"]["tipo_inscricao_enum"]
          titulo_proposta: string | null
          updated_at: string
          whatsapp: string
        }
        Insert: {
          cadastro_completo?: boolean
          cep?: string | null
          cnpj?: string | null
          comprovacao_path?: string | null
          cpf?: string | null
          created_at?: string
          eixo_tematico?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          estagio_ideia?: string | null
          id?: string
          municipio?: string | null
          nome_completo: string
          nome_fantasia?: string | null
          nome_social?: string | null
          notas_admin?: string | null
          razao_social?: string | null
          representante_cpf?: string | null
          representante_nome?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          telefone?: string | null
          tipo_inscricao: Database["public"]["Enums"]["tipo_inscricao_enum"]
          titulo_proposta?: string | null
          updated_at?: string
          whatsapp: string
        }
        Update: {
          cadastro_completo?: boolean
          cep?: string | null
          cnpj?: string | null
          comprovacao_path?: string | null
          cpf?: string | null
          created_at?: string
          eixo_tematico?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          estagio_ideia?: string | null
          id?: string
          municipio?: string | null
          nome_completo?: string
          nome_fantasia?: string | null
          nome_social?: string | null
          notas_admin?: string | null
          razao_social?: string | null
          representante_cpf?: string | null
          representante_nome?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          telefone?: string | null
          tipo_inscricao?: Database["public"]["Enums"]["tipo_inscricao_enum"]
          titulo_proposta?: string | null
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      registration_status:
        | "novo"
        | "em_analise"
        | "contatado"
        | "aprovado"
        | "recusado"
      tipo_inscricao_enum: "individual" | "equipe" | "empresa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      registration_status: [
        "novo",
        "em_analise",
        "contatado",
        "aprovado",
        "recusado",
      ],
      tipo_inscricao_enum: ["individual", "equipe", "empresa"],
    },
  },
} as const
