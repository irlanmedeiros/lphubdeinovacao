
-- 1. Sequence + helper for protocolo
CREATE SEQUENCE IF NOT EXISTS public.inova_protocolo_seq START 1;

CREATE OR REPLACE FUNCTION public.next_protocolo()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  n bigint;
BEGIN
  n := nextval('public.inova_protocolo_seq');
  RETURN 'INOVA-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 6, '0');
END;
$$;

-- 2. Registrations new columns
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS protocolo text UNIQUE,
  ADD COLUMN IF NOT EXISTS comprovante_path text,
  ADD COLUMN IF NOT EXISTS comprovante_hash text,
  ADD COLUMN IF NOT EXISTS comprovante_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS assinatura_path text,
  ADD COLUMN IF NOT EXISTS assinatura_ip text,
  ADD COLUMN IF NOT EXISTS assinatura_ua text,
  ADD COLUMN IF NOT EXISTS assinatura_at timestamptz,
  ADD COLUMN IF NOT EXISTS status_message text;

-- 3. Edital events
CREATE TABLE IF NOT EXISTS public.edital_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  data_evento date NOT NULL,
  dias_antes_avisar integer NOT NULL DEFAULT 7,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.edital_eventos TO authenticated;
GRANT ALL ON public.edital_eventos TO service_role;
ALTER TABLE public.edital_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage edital_eventos" ON public.edital_eventos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_edital_eventos_updated BEFORE UPDATE ON public.edital_eventos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. Email log
CREATE TABLE IF NOT EXISTS public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES public.registrations(id) ON DELETE SET NULL,
  template text NOT NULL,
  destinatario text NOT NULL,
  assunto text,
  status text NOT NULL DEFAULT 'sent',
  error text,
  payload jsonb,
  sent_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.email_log TO authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read email_log" ON public.email_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Notify status-change trigger using pg_net
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_url text := 'https://lphubdeinovacao.lovable.app/api/public/hooks/status-changed';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dmxvcWd0anllcm1zeGFmcmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTM3NDUsImV4cCI6MjA5NTQ2OTc0NX0.UWbwcM2lfm9aoXj8jj2JHm44eWxtaFb_BIxWNQe8JyU';
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM net.http_post(
      url := webhook_url,
      headers := jsonb_build_object('Content-Type', 'application/json', 'apikey', anon_key),
      body := jsonb_build_object(
        'registration_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'status_message', NEW.status_message
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_status_change ON public.registrations;
CREATE TRIGGER trg_notify_status_change
  AFTER UPDATE OF status ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.notify_status_change();
