
-- ===== Add proposta columns to registrations =====
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS justificativa_eixo text,
  ADD COLUMN IF NOT EXISTS resumo_executivo text,
  ADD COLUMN IF NOT EXISTS descricao_problema text,
  ADD COLUMN IF NOT EXISTS publico_afetado text,
  ADD COLUMN IF NOT EXISTS prejuizos text,
  ADD COLUMN IF NOT EXISTS evidencias_problema text,
  ADD COLUMN IF NOT EXISTS objetivo_geral text,
  ADD COLUMN IF NOT EXISTS objetivos_especificos text,
  ADD COLUMN IF NOT EXISTS descricao_solucao text,
  ADD COLUMN IF NOT EXISTS funcionalidades text,
  ADD COLUMN IF NOT EXISTS utilizacao_admin_publica text,
  ADD COLUMN IF NOT EXISTS beneficio_populacao text,
  ADD COLUMN IF NOT EXISTS tipo_solucao_tecnologica text,
  ADD COLUMN IF NOT EXISTS tipo_solucao_tecnologica_outro text,
  ADD COLUMN IF NOT EXISTS arquitetura_tecnologica text,
  ADD COLUMN IF NOT EXISTS modulos_telas text,
  ADD COLUMN IF NOT EXISTS tem_integracao boolean,
  ADD COLUMN IF NOT EXISTS detalhes_integracao text,
  ADD COLUMN IF NOT EXISTS tecnologias text,
  ADD COLUMN IF NOT EXISTS estagio_desenvolvimento text,
  ADD COLUMN IF NOT EXISTS estagio_desenvolvimento_outro text,
  ADD COLUMN IF NOT EXISTS estagio_descricao text,
  ADD COLUMN IF NOT EXISTS metodologia text,
  ADD COLUMN IF NOT EXISTS detalhamento_etapas text,
  ADD COLUMN IF NOT EXISTS entregas_tecnicas text,
  ADD COLUMN IF NOT EXISTS outras_entregas text,
  ADD COLUMN IF NOT EXISTS descricao_metas text,
  ADD COLUMN IF NOT EXISTS publico_beneficiario_direto text,
  ADD COLUMN IF NOT EXISTS publico_beneficiario_indireto text,
  ADD COLUMN IF NOT EXISTS estimativa_alcance text,
  ADD COLUMN IF NOT EXISTS areas_publicas text,
  ADD COLUMN IF NOT EXISTS processos_servicos text,
  ADD COLUMN IF NOT EXISTS apoio_decisao text,
  ADD COLUMN IF NOT EXISTS diferenciais text,
  ADD COLUMN IF NOT EXISTS tem_tecnologias_emergentes boolean,
  ADD COLUMN IF NOT EXISTS descricao_tecnologias_emergentes text,
  ADD COLUMN IF NOT EXISTS viabilidade_tecnica text,
  ADD COLUMN IF NOT EXISTS recursos_tecnicos text,
  ADD COLUMN IF NOT EXISTS infraestrutura text,
  ADD COLUMN IF NOT EXISTS riscos text,
  ADD COLUMN IF NOT EXISTS mitigacao_riscos text,
  ADD COLUMN IF NOT EXISTS capacidade_equipe text,
  ADD COLUMN IF NOT EXISTS valor_total_orcamento numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS justificativa_orcamento text,
  ADD COLUMN IF NOT EXISTS tem_contrapartida boolean,
  ADD COLUMN IF NOT EXISTS descricao_contrapartida text,
  ADD COLUMN IF NOT EXISTS manutencao text,
  ADD COLUMN IF NOT EXISTS custos_continuos text,
  ADD COLUMN IF NOT EXISTS potencial_expansao text,
  ADD COLUMN IF NOT EXISTS escalabilidade text,
  ADD COLUMN IF NOT EXISTS cenarios_replicacao text,
  ADD COLUMN IF NOT EXISTS adaptacoes text,
  ADD COLUMN IF NOT EXISTS retorno_admin_publica text,
  ADD COLUMN IF NOT EXISTS retorno_populacao text,
  ADD COLUMN IF NOT EXISTS retorno_inovatec text,
  ADD COLUMN IF NOT EXISTS retorno_ecossistema text,
  ADD COLUMN IF NOT EXISTS descricao_resultados text,
  ADD COLUMN IF NOT EXISTS trata_dados_pessoais text,
  ADD COLUMN IF NOT EXISTS tipos_dados_pessoais text,
  ADD COLUMN IF NOT EXISTS medidas_seguranca text,
  ADD COLUMN IF NOT EXISTS tem_ia boolean,
  ADD COLUMN IF NOT EXISTS cuidados_ia text,
  ADD COLUMN IF NOT EXISTS de_autoria text,
  ADD COLUMN IF NOT EXISTS usa_componentes_terceiros boolean,
  ADD COLUMN IF NOT EXISTS detalhes_componentes_terceiros text,
  ADD COLUMN IF NOT EXISTS tem_registros boolean,
  ADD COLUMN IF NOT EXISTS detalhes_registros text,
  ADD COLUMN IF NOT EXISTS lista_anexos text,
  ADD COLUMN IF NOT EXISTS links_externos text;

-- ===== Child tables =====
CREATE TABLE IF NOT EXISTS public.registration_proposta_cronograma (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  ordem int NOT NULL DEFAULT 0,
  etapa text NOT NULL DEFAULT '',
  atividade text NOT NULL DEFAULT '',
  prazo_dias int NOT NULL DEFAULT 0,
  entrega text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_cronograma TO authenticated;
GRANT ALL ON public.registration_proposta_cronograma TO service_role;
ALTER TABLE public.registration_proposta_cronograma ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read cronograma" ON public.registration_proposta_cronograma
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.registration_proposta_metas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  ordem int NOT NULL DEFAULT 0,
  meta text NOT NULL DEFAULT '',
  indicador text NOT NULL DEFAULT '',
  resultado text NOT NULL DEFAULT '',
  prazo text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_metas TO authenticated;
GRANT ALL ON public.registration_proposta_metas TO service_role;
ALTER TABLE public.registration_proposta_metas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read metas" ON public.registration_proposta_metas
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.registration_proposta_orcamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  ordem int NOT NULL DEFAULT 0,
  item text NOT NULL DEFAULT '',
  descricao text NOT NULL DEFAULT '',
  valor numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_orcamento TO authenticated;
GRANT ALL ON public.registration_proposta_orcamento TO service_role;
ALTER TABLE public.registration_proposta_orcamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read orcamento" ON public.registration_proposta_orcamento
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.registration_proposta_indicadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  ordem int NOT NULL DEFAULT 0,
  indicador text NOT NULL DEFAULT '',
  metodo_medicao text NOT NULL DEFAULT '',
  resultado_esperado text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_indicadores TO authenticated;
GRANT ALL ON public.registration_proposta_indicadores TO service_role;
ALTER TABLE public.registration_proposta_indicadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read indicadores" ON public.registration_proposta_indicadores
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.registration_proposta_entregas_documentais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  ordem int NOT NULL DEFAULT 0,
  entrega text NOT NULL DEFAULT '',
  checked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_entregas_documentais TO authenticated;
GRANT ALL ON public.registration_proposta_entregas_documentais TO service_role;
ALTER TABLE public.registration_proposta_entregas_documentais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read entregas" ON public.registration_proposta_entregas_documentais
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.registration_proposta_arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('evidencia_estagio', 'registro_titularidade', 'complementar')),
  path text NOT NULL,
  filename text NOT NULL,
  mime text NOT NULL,
  size_bytes int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_proposta_arquivos TO authenticated;
GRANT ALL ON public.registration_proposta_arquivos TO service_role;
ALTER TABLE public.registration_proposta_arquivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read arquivos" ON public.registration_proposta_arquivos
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ===== Storage bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('proposta-anexos', 'proposta-anexos', false)
ON CONFLICT (id) DO NOTHING;
