
REVOKE EXECUTE ON FUNCTION public.next_protocolo() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_status_change() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_protocolo() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_status_change() TO service_role;
