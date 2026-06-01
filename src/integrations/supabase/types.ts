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
      registration_proposta_arquivos: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime: string
          path: string
          registration_id: string
          size_bytes: number
          tipo: string
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime: string
          path: string
          registration_id: string
          size_bytes: number
          tipo: string
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime?: string
          path?: string
          registration_id?: string
          size_bytes?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_arquivos_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_proposta_cronograma: {
        Row: {
          atividade: string
          created_at: string
          entrega: string
          etapa: string
          id: string
          ordem: number
          prazo_dias: number
          registration_id: string
        }
        Insert: {
          atividade?: string
          created_at?: string
          entrega?: string
          etapa?: string
          id?: string
          ordem?: number
          prazo_dias?: number
          registration_id: string
        }
        Update: {
          atividade?: string
          created_at?: string
          entrega?: string
          etapa?: string
          id?: string
          ordem?: number
          prazo_dias?: number
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_cronograma_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_proposta_entregas_documentais: {
        Row: {
          checked: boolean
          created_at: string
          entrega: string
          id: string
          ordem: number
          registration_id: string
        }
        Insert: {
          checked?: boolean
          created_at?: string
          entrega?: string
          id?: string
          ordem?: number
          registration_id: string
        }
        Update: {
          checked?: boolean
          created_at?: string
          entrega?: string
          id?: string
          ordem?: number
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_entregas_documentais_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_proposta_indicadores: {
        Row: {
          created_at: string
          id: string
          indicador: string
          metodo_medicao: string
          ordem: number
          registration_id: string
          resultado_esperado: string
        }
        Insert: {
          created_at?: string
          id?: string
          indicador?: string
          metodo_medicao?: string
          ordem?: number
          registration_id: string
          resultado_esperado?: string
        }
        Update: {
          created_at?: string
          id?: string
          indicador?: string
          metodo_medicao?: string
          ordem?: number
          registration_id?: string
          resultado_esperado?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_indicadores_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_proposta_metas: {
        Row: {
          created_at: string
          id: string
          indicador: string
          meta: string
          ordem: number
          prazo: string
          registration_id: string
          resultado: string
        }
        Insert: {
          created_at?: string
          id?: string
          indicador?: string
          meta?: string
          ordem?: number
          prazo?: string
          registration_id: string
          resultado?: string
        }
        Update: {
          created_at?: string
          id?: string
          indicador?: string
          meta?: string
          ordem?: number
          prazo?: string
          registration_id?: string
          resultado?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_metas_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_proposta_orcamento: {
        Row: {
          created_at: string
          descricao: string
          id: string
          item: string
          ordem: number
          registration_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          item?: string
          ordem?: number
          registration_id: string
          valor?: number
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          item?: string
          ordem?: number
          registration_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "registration_proposta_orcamento_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
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
          adaptacoes: string | null
          apoio_decisao: string | null
          areas_publicas: string | null
          arquitetura_tecnologica: string | null
          beneficio_populacao: string | null
          cadastro_completo: boolean
          capacidade_equipe: string | null
          cenarios_replicacao: string | null
          cep: string | null
          cnpj: string | null
          comprovacao_path: string | null
          cpf: string | null
          created_at: string
          cuidados_ia: string | null
          custos_continuos: string | null
          de_autoria: string | null
          descricao_contrapartida: string | null
          descricao_metas: string | null
          descricao_problema: string | null
          descricao_resultados: string | null
          descricao_solucao: string | null
          descricao_tecnologias_emergentes: string | null
          detalhamento_etapas: string | null
          detalhes_componentes_terceiros: string | null
          detalhes_integracao: string | null
          detalhes_registros: string | null
          diferenciais: string | null
          eixo_tematico: string | null
          email: string
          endereco: string | null
          entregas_tecnicas: string | null
          escalabilidade: string | null
          estado: string | null
          estagio_descricao: string | null
          estagio_desenvolvimento: string | null
          estagio_desenvolvimento_outro: string | null
          estagio_ideia: string | null
          estimativa_alcance: string | null
          evidencias_problema: string | null
          funcionalidades: string | null
          id: string
          infraestrutura: string | null
          justificativa_eixo: string | null
          justificativa_orcamento: string | null
          links_externos: string | null
          lista_anexos: string | null
          manutencao: string | null
          medidas_seguranca: string | null
          metodologia: string | null
          mitigacao_riscos: string | null
          modulos_telas: string | null
          municipio: string | null
          nome_completo: string
          nome_fantasia: string | null
          nome_social: string | null
          notas_admin: string | null
          objetivo_geral: string | null
          objetivos_especificos: string | null
          outras_entregas: string | null
          potencial_expansao: string | null
          prejuizos: string | null
          processos_servicos: string | null
          publico_afetado: string | null
          publico_beneficiario_direto: string | null
          publico_beneficiario_indireto: string | null
          razao_social: string | null
          recursos_tecnicos: string | null
          representante_cpf: string | null
          representante_nome: string | null
          resumo_executivo: string | null
          retorno_admin_publica: string | null
          retorno_ecossistema: string | null
          retorno_inovatec: string | null
          retorno_populacao: string | null
          riscos: string | null
          status: Database["public"]["Enums"]["registration_status"]
          tecnologias: string | null
          telefone: string | null
          tem_contrapartida: boolean | null
          tem_ia: boolean | null
          tem_integracao: boolean | null
          tem_registros: boolean | null
          tem_tecnologias_emergentes: boolean | null
          tipo_inscricao: Database["public"]["Enums"]["tipo_inscricao_enum"]
          tipo_solucao_tecnologica: string | null
          tipo_solucao_tecnologica_outro: string | null
          tipos_dados_pessoais: string | null
          titulo_proposta: string | null
          trata_dados_pessoais: string | null
          updated_at: string
          usa_componentes_terceiros: boolean | null
          utilizacao_admin_publica: string | null
          valor_total_orcamento: number | null
          viabilidade_tecnica: string | null
          whatsapp: string
        }
        Insert: {
          adaptacoes?: string | null
          apoio_decisao?: string | null
          areas_publicas?: string | null
          arquitetura_tecnologica?: string | null
          beneficio_populacao?: string | null
          cadastro_completo?: boolean
          capacidade_equipe?: string | null
          cenarios_replicacao?: string | null
          cep?: string | null
          cnpj?: string | null
          comprovacao_path?: string | null
          cpf?: string | null
          created_at?: string
          cuidados_ia?: string | null
          custos_continuos?: string | null
          de_autoria?: string | null
          descricao_contrapartida?: string | null
          descricao_metas?: string | null
          descricao_problema?: string | null
          descricao_resultados?: string | null
          descricao_solucao?: string | null
          descricao_tecnologias_emergentes?: string | null
          detalhamento_etapas?: string | null
          detalhes_componentes_terceiros?: string | null
          detalhes_integracao?: string | null
          detalhes_registros?: string | null
          diferenciais?: string | null
          eixo_tematico?: string | null
          email: string
          endereco?: string | null
          entregas_tecnicas?: string | null
          escalabilidade?: string | null
          estado?: string | null
          estagio_descricao?: string | null
          estagio_desenvolvimento?: string | null
          estagio_desenvolvimento_outro?: string | null
          estagio_ideia?: string | null
          estimativa_alcance?: string | null
          evidencias_problema?: string | null
          funcionalidades?: string | null
          id?: string
          infraestrutura?: string | null
          justificativa_eixo?: string | null
          justificativa_orcamento?: string | null
          links_externos?: string | null
          lista_anexos?: string | null
          manutencao?: string | null
          medidas_seguranca?: string | null
          metodologia?: string | null
          mitigacao_riscos?: string | null
          modulos_telas?: string | null
          municipio?: string | null
          nome_completo: string
          nome_fantasia?: string | null
          nome_social?: string | null
          notas_admin?: string | null
          objetivo_geral?: string | null
          objetivos_especificos?: string | null
          outras_entregas?: string | null
          potencial_expansao?: string | null
          prejuizos?: string | null
          processos_servicos?: string | null
          publico_afetado?: string | null
          publico_beneficiario_direto?: string | null
          publico_beneficiario_indireto?: string | null
          razao_social?: string | null
          recursos_tecnicos?: string | null
          representante_cpf?: string | null
          representante_nome?: string | null
          resumo_executivo?: string | null
          retorno_admin_publica?: string | null
          retorno_ecossistema?: string | null
          retorno_inovatec?: string | null
          retorno_populacao?: string | null
          riscos?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          tecnologias?: string | null
          telefone?: string | null
          tem_contrapartida?: boolean | null
          tem_ia?: boolean | null
          tem_integracao?: boolean | null
          tem_registros?: boolean | null
          tem_tecnologias_emergentes?: boolean | null
          tipo_inscricao: Database["public"]["Enums"]["tipo_inscricao_enum"]
          tipo_solucao_tecnologica?: string | null
          tipo_solucao_tecnologica_outro?: string | null
          tipos_dados_pessoais?: string | null
          titulo_proposta?: string | null
          trata_dados_pessoais?: string | null
          updated_at?: string
          usa_componentes_terceiros?: boolean | null
          utilizacao_admin_publica?: string | null
          valor_total_orcamento?: number | null
          viabilidade_tecnica?: string | null
          whatsapp: string
        }
        Update: {
          adaptacoes?: string | null
          apoio_decisao?: string | null
          areas_publicas?: string | null
          arquitetura_tecnologica?: string | null
          beneficio_populacao?: string | null
          cadastro_completo?: boolean
          capacidade_equipe?: string | null
          cenarios_replicacao?: string | null
          cep?: string | null
          cnpj?: string | null
          comprovacao_path?: string | null
          cpf?: string | null
          created_at?: string
          cuidados_ia?: string | null
          custos_continuos?: string | null
          de_autoria?: string | null
          descricao_contrapartida?: string | null
          descricao_metas?: string | null
          descricao_problema?: string | null
          descricao_resultados?: string | null
          descricao_solucao?: string | null
          descricao_tecnologias_emergentes?: string | null
          detalhamento_etapas?: string | null
          detalhes_componentes_terceiros?: string | null
          detalhes_integracao?: string | null
          detalhes_registros?: string | null
          diferenciais?: string | null
          eixo_tematico?: string | null
          email?: string
          endereco?: string | null
          entregas_tecnicas?: string | null
          escalabilidade?: string | null
          estado?: string | null
          estagio_descricao?: string | null
          estagio_desenvolvimento?: string | null
          estagio_desenvolvimento_outro?: string | null
          estagio_ideia?: string | null
          estimativa_alcance?: string | null
          evidencias_problema?: string | null
          funcionalidades?: string | null
          id?: string
          infraestrutura?: string | null
          justificativa_eixo?: string | null
          justificativa_orcamento?: string | null
          links_externos?: string | null
          lista_anexos?: string | null
          manutencao?: string | null
          medidas_seguranca?: string | null
          metodologia?: string | null
          mitigacao_riscos?: string | null
          modulos_telas?: string | null
          municipio?: string | null
          nome_completo?: string
          nome_fantasia?: string | null
          nome_social?: string | null
          notas_admin?: string | null
          objetivo_geral?: string | null
          objetivos_especificos?: string | null
          outras_entregas?: string | null
          potencial_expansao?: string | null
          prejuizos?: string | null
          processos_servicos?: string | null
          publico_afetado?: string | null
          publico_beneficiario_direto?: string | null
          publico_beneficiario_indireto?: string | null
          razao_social?: string | null
          recursos_tecnicos?: string | null
          representante_cpf?: string | null
          representante_nome?: string | null
          resumo_executivo?: string | null
          retorno_admin_publica?: string | null
          retorno_ecossistema?: string | null
          retorno_inovatec?: string | null
          retorno_populacao?: string | null
          riscos?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          tecnologias?: string | null
          telefone?: string | null
          tem_contrapartida?: boolean | null
          tem_ia?: boolean | null
          tem_integracao?: boolean | null
          tem_registros?: boolean | null
          tem_tecnologias_emergentes?: boolean | null
          tipo_inscricao?: Database["public"]["Enums"]["tipo_inscricao_enum"]
          tipo_solucao_tecnologica?: string | null
          tipo_solucao_tecnologica_outro?: string | null
          tipos_dados_pessoais?: string | null
          titulo_proposta?: string | null
          trata_dados_pessoais?: string | null
          updated_at?: string
          usa_componentes_terceiros?: boolean | null
          utilizacao_admin_publica?: string | null
          valor_total_orcamento?: number | null
          viabilidade_tecnica?: string | null
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
