
ALTER TYPE public.tipo_inscricao_enum ADD VALUE IF NOT EXISTS 'empresa';

ALTER TABLE public.registrations ALTER COLUMN cpf DROP NOT NULL;
ALTER TABLE public.registrations ALTER COLUMN eixo_tematico DROP NOT NULL;
ALTER TABLE public.registrations ALTER COLUMN estagio_ideia DROP NOT NULL;

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS titulo_proposta text,
  ADD COLUMN IF NOT EXISTS razao_social text,
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS nome_fantasia text,
  ADD COLUMN IF NOT EXISTS nome_social text,
  ADD COLUMN IF NOT EXISTS representante_nome text,
  ADD COLUMN IF NOT EXISTS representante_cpf text,
  ADD COLUMN IF NOT EXISTS comprovacao_path text,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS municipio text,
  ADD COLUMN IF NOT EXISTS estado text,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS telefone text,
  ADD COLUMN IF NOT EXISTS cadastro_completo boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.registration_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL,
  nome text NOT NULL,
  cpf text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  funcao text NOT NULL,
  area_atuacao text NOT NULL,
  formacao text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.registration_team_members TO authenticated;
GRANT ALL ON public.registration_team_members TO service_role;

ALTER TABLE public.registration_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins can read team members"
ON public.registration_team_members
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_team_members_registration ON public.registration_team_members(registration_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('comprovacoes', 'comprovacoes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "admins read comprovacoes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'comprovacoes' AND has_role(auth.uid(), 'admin'::app_role));
