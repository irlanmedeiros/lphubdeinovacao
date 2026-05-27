## Objetivo

Trazer a identidade visual oficial do **Hub de Inovação** (PDF anexado) para a landing page atual, que hoje está num tom genérico "azul marinho escuro". A landing passa a parecer parte do mesmo ecossistema do portal de empresas (`inovatec-connect-hub.lovable.app`), e o formulário de pré‑cadastro fica legível.

## O que muda visualmente

**Linguagem da marca (extraída do PDF):**
- Fundo claro (off‑white / cinza muito leve), não mais navy chapado.
- Faixa "arco‑íris" (azul · vermelho · verde · amarelo · laranja · magenta) no topo e rodapé como assinatura da marca.
- Tipografia bold e arredondada para títulos em azul `#1A4BA0`, com pequena barra vermelha de acento.
- Logo "HUB DE INOVAÇÃO" reconstruído em SVG (hexágono multicolor + wordmark) e usado no header, hero e footer.
- Cards de eixos temáticos coloridos em bloco cheio (azul, vermelho, verde, amarelo) com ícone num círculo branco, exatamente como o slide 5.

**Seções reestilizadas:**
1. **Header** — fundo branco, faixa arco‑íris fina no topo, logo SVG à esquerda, navegação + botão vermelho "Pré‑cadastro".
2. **Hero** — fundo claro com gradiente sutil (azul ↔ branco) inspirado no portal de referência; título grande em navy "Transforme sua ideia em **solução pública**" com barra vermelha de acento; cartão do formulário branco com sombra forte à direita; chips de estatísticas (9 finalistas / 3 vencedores / 100% apoio) em pílulas coloridas.
3. **"O que é o edital"** — quatro cards brancos com ícone em círculo colorido, mantendo conteúdo atual.
4. **Eixos temáticos** — grid de 4 cards em bloco de cor cheia (cidades = azul, gestão = vermelho, serviços = verde, comunicação = amarelo), com ícone branco em círculo, título em caixa alta e descrição (réplica fiel do slide 5).
5. **Processo / Jornada** — timeline horizontal com bolinhas numeradas em azul e barra arco‑íris ligando as 7 etapas (slide 6).
6. **Origem + Resultados** — duas colunas: texto à esquerda, painel de resultados (R$ 500mi, ROI 8x, 207 serviços, etc.) em cards em fundo navy à direita — único bloco escuro da página, para criar contraste, como o slide 10.
7. **Sobre a INOVATEC‑JP** — banner claro com 3 selos (Serviço Social Autônomo, Validado pelo TCE‑PB, UFPB + Iniciativa Privada).
8. **FAQ** — accordion com tipografia maior e borda esquerda colorida ao expandir.
9. **Footer** — fundo navy, faixa arco‑íris embaixo, logo, navegação, contatos.

## Correção do formulário (bug do "texto branco no fundo branco")

- Forçar `text-foreground` (cor escura) explicitamente nos `Input`, `select` e nas labels dos radios do `RegistrationForm`, já que o `Input` base usa `bg-transparent` e estava herdando a cor do contexto navy.
- Trocar `placeholder:text-muted-foreground` por uma cor com contraste garantido em fundo branco.
- Estilizar o card do formulário com borda azul fina + faixa arco‑íris no topo do cartão, alinhado ao restante da identidade.
- Botão de submit passa a usar o vermelho da marca (CTA principal), e o estado "enviado" usa o verde da marca com check em hexágono.

## Tokens / CSS

Em `src/styles.css`:
- Manter os tokens já existentes (`--navy`, `--brand-blue`, `--brand-red`, `--brand-green`, `--brand-yellow`).
- Adicionar `--brand-orange` e `--brand-magenta` (cores da faixa arco‑íris do PDF).
- Adicionar utilitário `--gradient-rainbow` para a faixa do topo/rodapé.
- Trocar `--background` do hero para um tom muito claro com leve gradiente em vez do navy chapado.

## Arquivos a alterar

- `src/styles.css` — novos tokens de cor + gradiente arco‑íris.
- `src/components/landing/Sections.tsx` — reestruturar Header, Hero, EditalInfo, Timeline, Origin, About, FAQ, Footer com a nova identidade.
- `src/components/landing/RegistrationForm.tsx` — correção de contraste + estilo do cartão.
- `src/components/landing/HubLogo.tsx` *(novo)* — logo SVG do Hub (hexágono multicolor + wordmark) reutilizável.
- `src/components/landing/RainbowStripe.tsx` *(novo)* — faixa decorativa arco‑íris reusada no topo/rodapé.

## Fora do escopo

- Não toco em backend, schema, server functions, rota `/admin`, nem na lógica de submissão.
- Não adiciono novas seções/conteúdo — só reestilização do que já existe + correção do form.
