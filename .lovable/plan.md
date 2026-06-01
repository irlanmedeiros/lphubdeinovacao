
## Plano — Seção "DADOS DA PROPOSTA" no /cadastro

Implementação completa (fases 1–5) como **wizard multi-step** dentro da rota `/cadastro`, com **persistência tipada** (colunas novas em `registrations` + tabelas filhas), **autosave com debounce de 1s** e **uploads múltiplos** via Supabase Storage.

---

### 1. Banco de dados (1 migration grande)

**Alterações em `registrations`** — adicionar todas as colunas de texto/booleanos/enums da proposta (campos 1, 3, 4, 5–14, 16–17, 19–21, 23–24, 26, 28, 30–37, 39–45, 47, 49–51, 53–59, 61, 63–64, 66, 69, 71, plus listaAnexos/linksExternos). Tipos: `text` (nullable) para todos os campos longos; `boolean` para flags Sim/Não; `text` para tri-state (Sim/Não/Talvez, Sim/Não/Ainda não definido); `numeric(14,2)` para `valor_total_orcamento`; `integer` para `percentual_preenchimento`.

**Novas tabelas filhas** (cada uma com `registration_id uuid FK ON DELETE CASCADE`, `ordem int`, GRANT para `service_role`, RLS habilitada, política `admins can read` via `has_role`):
- `registration_proposta_cronograma` — etapa, atividade, prazo_dias, entrega (campo 25)
- `registration_proposta_metas` — meta, indicador, resultado, prazo (campo 29)
- `registration_proposta_orcamento` — item, descricao, valor (campo 46)
- `registration_proposta_indicadores` — indicador, metodo_medicao, resultado_esperado (campo 60)
- `registration_proposta_entregas_documentais` — entrega (text), checked (bool) — campo 27
- `registration_proposta_arquivos` — tipo (`evidencia_estagio` | `registro_titularidade` | `complementar`), path, filename, mime, size_bytes — campos 22, 71, 72

**Storage**: novo bucket privado `proposta-anexos` (50 MB limit por arquivo, mime allowlist no server).

**Sem `cadastro_completo: true` parcial** — só vira `true` quando o wizard for finalizado na última etapa.

---

### 2. Server functions (`src/lib/proposta.functions.ts` — novo arquivo)

- `getProposta({ id })` — retorna registration + todas as filhas e lista de arquivos. Validação: id existe.
- `savePropostaPartial({ id, patch })` — usado pelo autosave. Aceita patch parcial Zod com TODOS os campos opcionais, faz `UPDATE` em `registrations` apenas das colunas presentes. Retorna `{ ok, updatedAt }`.
- `savePropostaTable({ id, table, rows })` — substitui linhas de uma tabela filha (delete-and-insert por simplicidade). Tabelas permitidas: cronograma, metas, orcamento, indicadores, entregas_documentais. Recalcula `valor_total_orcamento` quando salva orçamento.
- `uploadPropostaAnexo({ id, tipo, filename, contentType, base64 })` — sobe pro bucket `proposta-anexos`, insere em `registration_proposta_arquivos`. Limite 10 MB, mimes: pdf/png/jpg/gif/mp4/mov/ppt/pptx/doc/docx.
- `removePropostaAnexo({ id, anexoId })`.
- `finalizarProposta({ id })` — valida campos obrigatórios server-side (todos os obrigatórios da spec), seta `cadastro_completo=true`, `status='em_analise'`, retorna erros por campo se faltar algo.

Reaproveita `submitFullRegistration` apenas para o salvamento inicial dos dados de proponente/equipe (já existe).

---

### 3. Frontend — wizard em `/cadastro`

Refatorar `src/routes/cadastro.tsx` para suportar **6 etapas** (1 atual + 5 novas da proposta) com componentes separados em `src/components/cadastro/`:

```
cadastro/
  WizardShell.tsx          // barra de progresso, nav Anterior/Próximo, indicador "Salvando…/Salvo"
  useAutoSave.ts           // hook: debounce 1s, chama savePropostaPartial
  StepProponente.tsx       // conteúdo atual de cadastro.tsx (tipo, proponente, equipe)
  StepPropostaBasica.tsx   // FASE 1: campos 1–14
  StepSolucaoTec.tsx       // FASE 2: campos 15–25 (inclui CronogramaTable)
  StepExecucao.tsx         // FASE 3: campos 26–45 (EntregasDocs, MetasTable, condicionais)
  StepOrcamento.tsx        // FASE 4: campos 46–61 (OrcamentoTable com total, IndicadoresTable)
  StepLegalDocs.tsx        // FASE 5: campos 62–72 (condicionais, AnexosUpload)
  fields/
    CharCountTextarea.tsx  // textarea com contador min/max
    DynamicTable.tsx       // tabela add/remove genérica (cronograma/metas/orçamento/indicadores)
    AnexosUpload.tsx       // multi-file upload com lista e remoção
    ConditionalField.tsx   // mostra/oculta baseado em watch()
    RadioGroup.tsx         // wrap do shadcn radio
```

**Schemas Zod** (`src/lib/proposta.schemas.ts`) — um schema por etapa + schema final consolidado para `finalizarProposta`. Constantes (eixos, tipos de solução, estágios, opções pré-preenchidas de entregas documentais) em `src/lib/proposta.constants.ts`.

**Autosave**:
- `react-hook-form` com `mode: "onChange"`.
- Hook `useAutoSave` que assiste `formState.dirtyFields`, debounce 1s, dispara `savePropostaPartial` só com campos sujos.
- Indicador no header do wizard: `idle | saving | saved | error`.
- Cargas iniciais via `getProposta` no `useEffect` quando `id` presente — hidrata os defaults do form.

**Tabelas dinâmicas** (cronograma, metas, orçamento, indicadores): `useFieldArray` + pré-preenchidos da spec. Salvam via `savePropostaTable` em debounce separado (2s) ao detectar mudança no array. Orçamento calcula total no client e mostra em destaque.

**Condicionais** (campos 19, 39, 49, 63/64, 66, 69, 71) — `watch()` + render condicional; schema marca como `.optional()` quando flag = "Não".

**Uploads** (campos 22, 71, 72): componente `AnexosUpload` com lista de arquivos já enviados (de `getProposta`), botão remover, drag-drop opcional. Reusa padrão base64 do `uploadComprovacao`.

**Navegação**:
- Botões "Anterior" / "Próximo" no rodapé de cada step.
- "Próximo" valida só os campos da etapa atual (`trigger(stepFields)`).
- Barra de progresso topo com 6 bolinhas clicáveis (só permite pular para steps anteriores ou steps já válidos).
- Última etapa: botão "Enviar inscrição" chama `finalizarProposta`; em sucesso vai para tela `done`.

**Acessibilidade**: labels associadas, `aria-invalid`, `aria-describedby` para erros, navegação por teclado já vem do shadcn.

**Responsividade**: tabelas dinâmicas com `overflow-x-auto` no mobile; grid colapsa pra 1 coluna abaixo de `md`.

---

### 4. Detalhes técnicos / decisões

- **Persistência de booleanos tri-state** (campos 52, 62, 67) — armazenar como `text` ('sim'|'nao'|'talvez'|'indefinido') pra evitar 3 colunas.
- **Tipo de solução tecnológica** (campo 15) e **estágio** com "Outro" — armazenar valor selecionado em uma coluna + valor livre em coluna `_outro` quando "Outro" for marcado.
- **Entregas documentais** (campo 27): tabela filha com seed das 5 opções padrão na criação do registro, mais linhas livres adicionadas pelo usuário; checkbox controla `checked`.
- **Validação cruzada** (consistência orçamento, prazo total, etc.) — implementar apenas como **avisos não-bloqueantes** no client (toast amarelo), nunca como erro de schema, pra não travar autosave.
- **Recuperação após reload**: `getProposta` na montagem hidrata o form completo a partir do banco; nada fica só no `localStorage`.
- **Logs**: `console.error` no servidor; no client, `toast.error` com mensagem amigável.
- **`finalizarProposta`** valida todos os campos obrigatórios server-side e retorna `{ ok: false, errors: { campo: msg } }` pro client highlight.

### 5. Fora de escopo (deixado explícito)

- Exportação PDF / versão impressível.
- i18n.
- Tooltips de termos técnicos (pode entrar depois como melhoria de UX).
- Painel admin para visualizar a proposta completa — apenas a lista atual continua funcionando; novos campos aparecem só no payload.
