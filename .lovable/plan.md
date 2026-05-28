## Substituir logo customizada e remover emojis

### 1. Logo real
- Copiar `user-uploads://Asset_1.svg` para `src/assets/hub-logo.svg`
- Deletar `src/components/landing/HubLogo.tsx`
- Em `Sections.tsx` substituir os 3 usos de `<HubLogo />`:
  - **Header** (`variant dark`): `<img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-12 w-auto" />`
  - **About** (centralizado, maior): `className="h-20 w-auto"`
  - **Footer** (`variant light`): igual ao header, mas com `className="... brightness-0 invert"` para ficar branco sobre o navy
- Remover o import `HubLogo` de `Sections.tsx`

### 2. Remover emojis e usar ícones lucide

**Hero — selos de benefícios** (linhas 70-72): substituir `✓` por `<Check className="h-3.5 w-3.5 text-[var(--brand-green)]" />` dentro de cada chip.

**Timeline — 7 etapas** (linhas 204-211): trocar `e: "📝"` etc. por componentes lucide:
- Inscrição → `FileText`
- Habilitação → `ClipboardCheck`
- Avaliação → `Search`
- Finalistas → `Trophy`
- Pitch → `Mic`
- Vencedores → `Medal`
- Formalização → `Handshake`

Renderizar o ícone (no lugar do `text-2xl {s.e}`) num círculo colorido pequeno acima do título, usando a cor da marca por etapa para variar (alternando blue/red/yellow/green).

**About — 3 cards de pilares** (linhas 308-311): trocar `e: "🏛️" / "⚖️" / "🎓"` por:
- Serviço Social Autônomo → `Landmark`
- Validado pelo TCE-PB → `Scale`
- UFPB + Iniciativa Privada → `GraduationCap`

Renderizar `<Icon className="h-6 w-6" />` dentro do quadrado colorido (substituindo o emoji).

### 3. Imports
Adicionar ao import do lucide-react em `Sections.tsx`:
`Check, FileText, ClipboardCheck, Search, Mic, Medal, Handshake, Landmark, Scale, GraduationCap`
(manter `Trophy` que já existe).

### Fora de escopo
- Não mexer em RegistrationForm, cadastro.tsx, admin, backend, cores ou copy.
- Não alterar a `<RainbowStripe />`.