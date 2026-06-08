## Objetivo

Adicionar três coisas:

1. Página pública **/status** para consulta da inscrição por **protocolo + email**.
2. **PDF de comprovante** gerado ao finalizar a proposta (assinado pelo responsável).
3. **Emails automáticos** em cada evento da inscrição (submissão, mudança de status, avisos do edital, lembretes de prazo).

---

## 1. Protocolo de submissão

Hoje o identificador é o `id` UUID da `registrations`. Para o usuário digitar no comprovante, vamos gerar um **protocolo curto** legível e usar como chave de consulta.

- Nova coluna `registrations.protocolo` (texto único): formato `INOVA-2026-000123` (sequência por ano).
- Gerado server-side em `finalizarProposta` quando `cadastro_completo` vira `true`.
- Sequência via `CREATE SEQUENCE inova_protocolo_seq` (reinicia a cada ano via prefixo).
- Endpoint de consulta exige **UUID** (`id`) **+ email do responsável** que bate com `responsavel_email`. O protocolo curto também é aceito como entrada (mais amigável que UUID).

## 2. Página /status (consulta pública)

Rota pública nova `src/routes/status.tsx`:

- Form com dois campos: **Protocolo ou ID** + **Email do responsável**.
- Server fn `consultarStatus({ identificador, email })` → busca por `protocolo` OU `id`, valida email, retorna apenas:
  - dados do proponente (nome, CNPJ/cidade), título da proposta, eixo, protocolo, data de submissão, status (`em_analise` / `aprovado` / `reprovado` / `pendencias`), última atualização, lista de anexos (nomes), link para baixar o comprovante PDF.
- Layout segue o mockup anexado (card de busca + card de resultado com badges coloridos por status).
- Link "Consultar status" no Header e no Footer.

## 3. PDF de comprovante completo

Novo server fn `gerarComprovantePDF(id)` chamado por `finalizarProposta` (e disponível para re-download em /status).

- Geração com **pdf-lib** (puro JS, compatível com runtime Worker).
- Conteúdo (várias páginas):
  1. **Capa**: logo INOVATEC-JP, título "Comprovante de Submissão", protocolo, data/hora, hash SHA-256 do conteúdo.
  2. **Proponente & equipe**: todos os dados já salvos.
  3. **Proposta completa**: 72 campos agrupados nas 5 fases, com seções e títulos.
  4. **Tabelas**: cronograma, metas, orçamento (com total), indicadores, entregas documentais.
  5. **Anexos**: lista (tipo, nome, tamanho, data) — sem embutir os arquivos.
  6. **Bloco de assinatura digital** (escolha "mais completa"):
     - Texto de declaração ("Declaro, sob as penas da lei, que as informações aqui prestadas são verdadeiras…").
     - Nome completo do responsável + CPF + email + IP + user-agent + timestamp ISO.
     - **Hash SHA-256** de todo o conteúdo do PDF impresso no rodapé de cada página.
     - **Campo de assinatura desenhada (opcional)**: na última tela do wizard, abrir um modal "Finalizar e assinar" com `<canvas>` para o responsável desenhar a assinatura. O PNG da assinatura é salvo em `proposta-anexos/{id}/assinatura.png` e embutido no PDF. Se o usuário pular, o PDF imprime apenas o aceite digital + hash.
- PDF salvo em `proposta-anexos/{id}/comprovante.pdf` e o path guardado em `registrations.comprovante_path`.
- URL assinada (signed URL, 1h) gerada sob demanda pelo server fn de consulta.

## 4. Emails automáticos

Usar **Lovable Emails** (built-in) com templates React Email — domínio próprio fica para depois, começa com remetente padrão.

Eventos que disparam email para o `responsavel_email`:

| Evento | Trigger | Conteúdo |
|---|---|---|
| Submissão confirmada | `finalizarProposta` ok | Protocolo + PDF de comprovante anexado + link /status |
| Status alterado | admin muda `status` na tabela `registrations` | Novo status + observação opcional + link /status |
| Pendência registrada | admin marca `status='pendencias'` com mensagem | Lista de pendências + prazo + link /status |
| Aviso do edital (broadcast) | admin envia da página admin | Assunto + corpo livre → todos os inscritos com `cadastro_completo=true` |
| Lembrete de prazo | `pg_cron` diário | Datas-chave do edital (ex.: encerramento de inscrições, divulgação) |
| Resultado final | admin muda para `aprovado`/`reprovado` | Mensagem específica + próximos passos |

Implementação:

- 1 server route `POST /api/internal/emails/send` (admin-only via service role + verificação interna) que chama o Lovable Emails.
- 1 server fn `enviarEmailInscricao({ id, template, vars })` que monta o template e invoca a route.
- 1 trigger Postgres em `registrations` que, ao detectar mudança de `status`, faz `pg_net.http_post` para `/api/public/hooks/status-changed` (verificação por `apikey` anon).
- 1 server route `POST /api/public/hooks/status-changed` consome o webhook e envia o email.
- 1 cron diário (`pg_cron`) chamando `/api/public/hooks/lembretes-edital` que consulta uma tabela nova `edital_eventos` (data + descrição + janela de aviso em dias) e dispara emails apenas no dia certo.
- Página admin ganha botões:
  - "Enviar comunicado a todos" (broadcast com editor de assunto/corpo).
  - "Marcar aprovado / reprovado / com pendências" com campo de mensagem opcional.
- Tabela nova `email_log` (inscricao_id, template, to, sent_at, status, error) para auditoria.

## 5. Mudanças de schema (1 migração)

```text
- registrations: + protocolo TEXT UNIQUE, + comprovante_path TEXT,
                 + comprovante_hash TEXT, + assinatura_path TEXT,
                 + assinatura_ip TEXT, + assinatura_ua TEXT,
                 + assinatura_at TIMESTAMPTZ
- SEQUENCE inova_protocolo_seq
- TABLE edital_eventos (titulo, data_evento, dias_antes_avisar, ativo)
- TABLE email_log (inscricao_id, template, destinatario, status, error, sent_at)
- TRIGGER notify_status_change AFTER UPDATE OF status ON registrations
- GRANTs + RLS coerentes (admin gerencia, anon não lê)
```

## 6. Estrutura de arquivos novos

```text
src/routes/status.tsx                              # nova rota pública
src/routes/api/public/hooks/status-changed.ts      # webhook do trigger
src/routes/api/public/hooks/lembretes-edital.ts    # cron diário
src/routes/api/internal/emails/send.ts             # envio via Lovable Emails
src/lib/status.functions.ts                        # consultarStatus
src/lib/comprovante.functions.ts                   # gerarComprovantePDF, baixarComprovante
src/lib/comprovante/pdf-builder.ts                 # montagem do PDF com pdf-lib
src/lib/emails.functions.ts                        # enviarEmailInscricao, broadcast
src/lib/emails/templates/                          # submission, status-change, broadcast, lembrete
src/components/cadastro/AssinaturaCanvas.tsx       # canvas de assinatura no último step
src/components/status/StatusCard.tsx               # card de resultado
src/components/admin/EnviarComunicado.tsx          # broadcast UI
src/components/admin/AlterarStatus.tsx             # mudar status + mensagem
```

## 7. Fora de escopo

- Domínio próprio para emails (usa remetente padrão Lovable Emails).
- Notificações in-app / push.
- Tradução do PDF para outros idiomas.

## 8. Detalhes técnicos

- `pdf-lib` é puro JS e roda no Worker SSR — sem `sharp`/`puppeteer`.
- Hash do PDF: gerar bytes, calcular SHA-256, **carimbar o hash dentro do rodapé** numa segunda passada (re-serialize) para garantir integridade verificável.
- Trigger usa `pg_net` (já permitido) com a anon key no header `apikey`; route bypassa auth por estar em `/api/public/`.
- Validação em todos os endpoints com Zod (min/max, formato de email, formato de protocolo `^INOVA-\d{4}-\d{6}$`).
- `consultarStatus` faz rate-limit simples por IP via tabela in-memory? Não — adicionamos contagem por IP em `email_log`-style? **Decisão:** não implementar rate-limit nesta entrega; documentar como melhoria futura.
- Botão "Baixar comprovante" no /status gera signed URL na hora (não exposto público).
