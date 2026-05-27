
## 1. Pré-cadastro (Hero) — simplificar

Em `RegistrationForm.tsx`, manter apenas:
- Nome completo
- E-mail
- WhatsApp
- Tipo de inscrição: **Individual**, **Equipe**, **Empresa** (3 opções agora)

Remover do formulário: CPF, Eixo temático, Estágio da ideia.

Texto do checkbox passa a ser: *"Li e concordo com a Política de Privacidade."* (sem menção ao edital).

Após envio bem-sucedido, em vez de só mostrar "Cadastro confirmado", o estado de sucesso oferece um CTA destacado **"Preencher cadastro completo →"** que abre `/cadastro?id=<registrationId>&tipo=<tipo>` em nova aba (`target="_blank"`). Também mantém o link em `toast`.

Para isso, `submitRegistration` (server fn) passa a retornar `{ ok: true, id, tipo }`.

## 2. Hero — botão "Baixar edital" em destaque

No `Hero` (em `Sections.tsx`), abaixo do bloco de informações e acima/junto ao formulário, adicionar bloco em destaque com:
- Botão grande `Baixar Edital (PDF)` → `/edital-2026.pdf` (download), com ícone de download, cor `--brand-red`, sombra.
- Subtítulo curto: "Leia o edital completo antes de se inscrever."

## 3. Nova rota `/cadastro` — cadastro completo

Arquivo: `src/routes/cadastro.tsx` (público, abre em nova aba).

Lê query params `id` e `tipo` (individual | equipe | empresa). Se não houver `id`, ainda permite preencher, mas exige que e-mail bata com um pré-cadastro existente.

Estrutura do formulário (baseado nos PDFs anexos):

**Bloco 1 — Sobre a proposta** (sempre)
- Título da proposta
- Eixo temático (select com EIXOS)
- Estágio da ideia (select com ESTAGIOS)

**Bloco 2 — Dados do proponente**

Se `tipo = empresa` (PJ):
- Razão Social, CNPJ, Nome Fantasia
- Nome do representante legal, CPF do representante
- Upload: **Comprovação de poderes de representação** (PDF/JPG/PNG, máx 5 MB)
- Endereço completo, Município, Estado, CEP
- Telefone, WhatsApp, E-mail principal

Se `tipo = individual` (PF):
- Nome completo, CPF, Nome social (opcional)
- CPF do representante legal (se menor — opcional)
- Upload comprovação (opcional)
- Endereço completo, Município, Estado, CEP, Telefone, WhatsApp, E-mail

**Bloco 3 — Equipe** (somente se `tipo = equipe`, ou opcionalmente para empresa/individual)
- Lista dinâmica de membros (add/remove). Cada membro: Nome, CPF, E-mail, Telefone, Função na equipe, Área de atuação, Formação.
- Mínimo 1 membro quando tipo = equipe.

**Bloco 4 — Declarações**
- Aceite do edital + política de privacidade (aqui o aceite **inclui** o edital, conforme texto do PDF).

Submit → server fn `submitFullRegistration` que faz UPDATE em `registrations` (campos novos) + INSERT em `registration_team_members` quando aplicável, e salva o caminho do arquivo de comprovação.

## 4. Banco de dados — migration

**Adicionar valor ao enum `tipo_inscricao`:**
- `ALTER TYPE tipo_inscricao ADD VALUE 'empresa';`

**Tornar opcionais no `registrations`** (já que pré-cadastro agora não envia tudo):
- `cpf`, `eixo_tematico`, `estagio_ideia` → `DROP NOT NULL` (preenchidos depois no /cadastro)

**Adicionar colunas no `registrations`** (cadastro completo):
- `titulo_proposta text`
- `razao_social text`, `cnpj text`, `nome_fantasia text`
- `nome_social text`
- `representante_nome text`, `representante_cpf text`
- `comprovacao_path text` (caminho no Storage)
- `endereco text`, `municipio text`, `estado text`, `cep text`, `telefone text`
- `cadastro_completo boolean default false`

**Nova tabela `registration_team_members`**:
- `id uuid pk`, `registration_id uuid` (FK lógica), `nome`, `cpf`, `email`, `telefone`, `funcao`, `area_atuacao`, `formacao`, `created_at`
- GRANTs para `authenticated` (read via admin) e `service_role` (all). Sem INSERT direto do cliente — tudo via server fn com `supabaseAdmin`.
- RLS: somente admins leem (`has_role(auth.uid(), 'admin')`).

**Storage bucket `comprovacoes`** (privado):
- `INSERT INTO storage.buckets (id, name, public) VALUES ('comprovacoes','comprovacoes', false);`
- Policies em `storage.objects`: somente `service_role` insere/lê; admins leem via signed URL gerada por server fn.

## 5. Server functions

Em `src/lib/registrations.functions.ts`:

- `submitRegistration` (existente): aceitar novo schema reduzido (nome, email, whatsapp, tipo) + novo tipo `"empresa"`. Retornar `{ ok, id, tipo }`.
- `submitFullRegistration` **novo**: recebe `id` (uuid do pré-cadastro), validação Zod condicional por tipo, body com todos os campos + array de membros. Faz UPDATE + INSERT membros via `supabaseAdmin`. Define `cadastro_completo = true`.
- `uploadComprovacao` **novo**: recebe `id` + base64 do arquivo (pdf/jpg/png, ≤5 MB validado), faz upload no bucket `comprovacoes/<id>/<filename>` via `supabaseAdmin.storage`, retorna `path`.
- `listRegistrations` (admin): incluir colunas novas e flag `cadastro_completo`. (Opcional: expor membros em outra fn `listTeamMembers`.)

## 6. Admin (`/admin`) — pequeno ajuste

- Tabela exibe nova coluna **Cadastro completo** (badge "Pendente"/"Completo").
- Adicionar filtro por status já existe — não mudar nada além disso nesta iteração.

## 7. Footer — Política de Privacidade

Em `Sections.tsx`:
- Nova seção curta `<Privacy />` antes do `Footer`, com título "Política de Privacidade" e ~6–8 linhas em português explicando: dados coletados (nome, e-mail, WhatsApp, CPF, dados da proposta), finalidade (gestão do edital, contato sobre etapas), base legal (LGPD — consentimento e legítimo interesse), compartilhamento (apenas com a comissão do INOVATEC-JP), direitos do titular (acesso, correção, exclusão via e-mail de contato), retenção (até o encerramento do edital + 5 anos para fins legais).
- Adicionar link `Política de Privacidade` no `Footer` que rola até a seção (`#privacidade`).

## Detalhes técnicos / arquivos

**Criar**
- `src/routes/cadastro.tsx` — página pública com o formulário completo (react-hook-form + zod, discriminated union por `tipo`).
- `src/components/landing/Privacy.tsx` — ou seção dentro de `Sections.tsx`.

**Editar**
- `src/components/landing/RegistrationForm.tsx` — campos reduzidos, opção "empresa", novo CTA pós-envio.
- `src/components/landing/Sections.tsx` — Hero ganha bloco de download em destaque; export de `Privacy`.
- `src/routes/index.tsx` — incluir `<Privacy />` antes do `<Footer />`.
- `src/lib/registrations.functions.ts` — schemas + 2 novas server fns.
- `src/lib/constants.ts` — adicionar tipo "Empresa" à lista de tipos (se houver enum local) e manter EIXOS/ESTAGIOS.
- `src/routes/admin.tsx` — coluna `cadastro_completo`.

**Migration** (uma única chamada): enum value + DROP NOT NULL + novas colunas + nova tabela `registration_team_members` (com GRANTs + RLS + policies) + bucket `comprovacoes` + policies de storage.

## Fora de escopo

- E-mail transacional com link do cadastro completo (por ora só abre em nova aba via JS).
- Edição do cadastro completo após envio.
- Reenviar comprovação.
