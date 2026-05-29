## Corrigir substituição de emojis que não pegou

O `src/components/landing/Sections.tsx` hoje é apenas um arquivo de re-export. As edições anteriores foram aplicadas nele, mas os componentes reais vivem em arquivos próprios (`Timeline.tsx`, `About.tsx`, etc.) — por isso ao clonar o repo os emojis ainda aparecem.

### 1. `src/components/landing/Timeline.tsx`
Trocar o array de steps para usar componentes lucide ao invés de strings de emoji:
- Inscrição → `FileText`
- Habilitação → `ClipboardCheck`
- Avaliação → `Search`
- Finalistas → `Trophy`
- Pitch → `Mic`
- Vencedores → `Medal`
- Formalização → `Handshake`

Adicionar uma cor por etapa (alternando brand-blue / brand-red / brand-yellow / brand-green) e renderizar `<Icon className="h-6 w-6" style={{ color }} />` no lugar do `<div className="text-2xl">{s.e}</div>`.

### 2. `src/components/landing/About.tsx`
Trocar `e: "🏛️" / "⚖️" / "🎓"` por:
- Serviço Social Autônomo → `Landmark`
- Validado pelo TCE-PB → `Scale`
- UFPB + Iniciativa Privada → `GraduationCap`

Renderizar `<Icon className="h-6 w-6 text-white" />` dentro do quadrado colorido, substituindo o `{p.e}`.

### 3. `src/lib/constants.ts`
Linha 25 tem `icon: "🤝"` num eixo temático. Verificar se é usado em algum lugar; se sim, trocar por ícone lucide equivalente (`Handshake`) ou simplesmente remover esse campo se não estiver sendo renderizado (os Eixos já usam ícones lucide próprios em `Eixos.tsx`).

### Fora de escopo
- Não mexer em logo (já está usando o SVG real corretamente nos arquivos certos)
- Não mexer em backend, formulário, admin, copy ou cores
