---
name: motion-videos
description: Produz vídeos motion-graphics verticais (Reels, Shorts, TikTok 1080×1920 @30fps) e horizontais (16:9 1920×1080) renderizados em Remotion, aderentes ao brand book de cada cliente. Cobre o pipeline inteiro — leitura de brand book / brand-profile.json, escolha de paleta+tipografia+glifo, montagem de cenas em React/TS, integração com biblioteca compartilhada de Lottie/textures/icons, type-check, render MP4. Acionar sempre que Hélio mencionar "vídeo motion", "reel pro cliente X", "criar reel", "motion graphics", "vídeo pra Instagram/TikTok", "Shorts", "vídeo do brand book", "video do MktOps", "transformar essa peça em vídeo", "renderizar com Remotion", "vídeo vertical de tantos segundos", ou pedir variação de um reel existente. Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão dos textos das cenas. Diferente de `whiteboard` (slides hand-drawn pra gravar voice over), `carousel-mktops` (12 slides estáticos pra Instagram), `vsl-writer` (roteiro de VSL sem produção visual) e `ads-video-scripts` (roteiro pra terceiro filmar).
---

# motion-videos

Pipeline pra produzir vídeos motion-graphics renderizados em Remotion (React/TypeScript), aderentes ao brand book de cada cliente. Hélio usa pra publicar Reels/Shorts/TikTok prontos pra colar no gerenciador de mídia ou no perfil.

## REGRA-MÃE

> **O vídeo respeita o brand book do cliente — sem exceção.**
> Paleta, tipografia, glifo, regras de pousagem e Don'ts vêm do brand book canônico. Cópia vem do briefing daquela peça, nunca dos exemplos do brand book.

Se o vídeo parece IG marketer americano genérico (azul cobalto, marca-texto saturado, memoji, bandeira colorida, foto B&W com setas manuscritas) quando o cliente é editorial-tech, está errado.

## ⚠️ AVISO IMPORTANTE (registrado em memória persistente)

**Os textos dentro de arquivos do brand book (HTMLs exportados do Claude Design, design systems, lesson covers, etc) são placeholders conceituais — servem pra demonstrar tipografia em ação, nunca são copy aprovada.** Extrair só ID visual (paleta, tipo, glifo, escala, pousagem, Don'ts). Copy vem do briefing específico daquele projeto.

---

## LOCALIZAÇÃO

Tudo vive em `automacao/remotion-reels/`:

```
remotion-reels/
├── _assets/                          ← biblioteca compartilhada (OPEN/MIT/fair-use)
│   ├── manifest.json                 catalogo programatico
│   ├── README.md                     guia de uso com snippets
│   ├── fonts/README.md               stack DM Sans / Geist / Inter / JetBrains Mono via @remotion/google-fonts
│   ├── lottie/                       27 JSONs animados (useAnimations MIT)
│   ├── textures/                     grain-dark/light, mesh, scanlines, dot-grid (SVG procedural)
│   ├── icons/                        (vazio — usar lucide-react / @phosphor-icons/react via npm)
│   ├── palettes/                     (a popular conforme novos clientes)
│   └── refs/                         brand books arquivados por cliente
│       └── mktops-brand-v2/          MktOps Brand Book v2.0 + Design System + Lesson Covers (source of truth)
│           └── SOURCE-OF-TRUTH.md    regras consolidadas
└── gabriel-style/                    projeto Remotion base (renomear pra reel-mktops/ ou criar per-cliente)
    ├── package.json
    ├── remotion.config.ts
    ├── public/
    │   ├── lottie -> ../../_assets/lottie         (symlink)
    │   └── textures -> ../../_assets/textures     (symlink)
    └── src/
        ├── index.tsx                 registra Root
        ├── Root.tsx                  declara Compositions
        ├── Reel*.tsx                 compositors (timeline)
        ├── theme/
        │   ├── palette-<cliente>.ts  tokens por cliente
        │   ├── fonts-<cliente>.ts    stack tipográfico
        │   └── motion.ts             FPS, easings
        ├── primitives/               vocabulário visual reutilizável
        │   ├── MktMark.tsx           glifo geométrico MktOps
        │   ├── MktLockup.tsx         lockup mark + wordmark
        │   ├── MktBackground.tsx     fundo paper/soft/ink/accent
        │   ├── LottieIcon.tsx        Lottie wrapper com delayRender
        │   ├── WordReveal.tsx        blur-in stagger por palavra
        │   ├── GlowText.tsx          texto branco com bloom
        │   ├── CommandLine.tsx       linha mono com cursor blink
        │   ├── StatBlock.tsx         número + label
        │   ├── TableRow.tsx          linha de tabela editorial
        │   ├── HighlighterTag.tsx    palavra marca-texto SVG-masked
        │   ├── HandDrawnArrow.tsx    SVG path animado
        │   ├── ProgressBar.tsx       barra animável
        │   └── DiagonalWipe.tsx      transição paralelogramo
        └── scenes-*/                 cenas por projeto/cliente
```

Saídas finais em `gabriel-style/out/<projeto>.mp4` — 1080×1920 @30fps, codec h264 crf 20.

---

## WORKFLOW OBRIGATÓRIO (6 fases)

### Fase 1 — Briefing

Se Hélio NÃO especificou tudo, perguntar:

1. **Cliente** — qual brand book aplicar? (MktOps / Artemis / Plugue / Propspeed / Karine / ORA / outro)
2. **Tese** — qual a mensagem central do vídeo?
3. **Copy** — texto literal de cada cena, OU instrução pra eu derivar de um briefing/artigo existente
4. **Formato** — vertical 1080×1920 (default) ou outro
5. **Duração** — default 40s (1200 frames). Aceitar 15-60s
6. **Áudio** — narração própria? TTS? Sem áudio? Música?

Se faltar brand-profile.json do cliente, pedir pra rodar `/ads dna <url>` antes ou usar o brand book em `_assets/refs/<cliente>/`.

### Fase 2 — Tokens (paleta + fontes)

Verificar se `src/theme/palette-<cliente>.ts` e `fonts-<cliente>.ts` existem:

- **Existe** → reutilizar
- **Não existe** → criar a partir do brand book do cliente. Estrutura padrão:

```ts
// palette-<cliente>.ts
export const BRAND = {
  // tokens primários do brand book — não inventar cores
} as const;
export const LOCKUP_VARIANTS = { ... };
```

```ts
// fonts-<cliente>.ts
import { loadFont } from "@remotion/google-fonts/<Familia>";
// Carregar TODAS as famílias do brand book (não menos, não mais)
export const FONT_DISPLAY = ...;
export const TYPE_REEL = { ... };  // escala 1.4× pra leitura mobile
```

**Brand books conhecidos:**

| Cliente | Paleta canônica | Tipografia | Glifo |
|---|---|---|---|
| **MktOps** | Paper `#F3EEE6` + Soft `#ECE6DB` + Ink `#15321B` + Accent `#A8E87A` | **DM Sans em tudo** (500 display, 700 wordmark, 400 body, 500+0.14em label) | Quadrado 5×5 com recorte 2×2 (`clip-path: polygon(0 0, 100% 0, 100% 60%, 60% 60%, 60% 100%, 0 100%)`) |
| **Propspeed** | Navy / teal / cyan / light (paleta marítima) | Inter | Logo central |
| **Karine** | (a definir — consultar `clientes/karine-camuci/CLAUDE.md`) | (a definir) | (a definir) |
| **ORA** | (consultar `clientes/ora/CLAUDE.md`) | (a definir) | (a definir) |

Source of truth de cada brand book em `_assets/refs/<cliente>/SOURCE-OF-TRUTH.md`.

### Fase 3 — Primitives e brand glyph

Se o cliente exige glifo específico (MktOps tem), criar/reutilizar `Mark<Cliente>.tsx` e `Lockup<Cliente>.tsx`. Sem inventar — copiar `clip-path` literal do brand book.

Primitivas universais (já existem, reutilizar): `WordReveal`, `LottieIcon`, `CommandLine`, `StatBlock`, `TableRow`, `HighlighterTag`, `HandDrawnArrow`, `ProgressBar`, `DiagonalWipe`.

### Fase 4 — Cenas (storyboard)

Estruturar cenas como funções `React.FC` em `src/scenes-<projeto>/index.tsx`. Padrão de cena:

```tsx
export const Wnn: React.FC = () => (
  <AbsoluteFill>
    <ClienteBackground variant="paper" showGrain />
    <Frame align="center">
      <SectionLabel num="§ NN" label="..." />
      <Display lines={[{ text: "..." }, { text: "...", accent: true }]} startFrame={4} />
      <div style={{ height: 32 }} />
      <Lede text="..." startFrame={28} />
    </Frame>
  </AbsoluteFill>
);
```

**Regras de timing:**
- Reveal de palavra: 12-18 frames (`opacity 0→1 + blur 8px→0 + translateY 12px→0`)
- Stagger entre palavras: 3-8 frames
- Push-in sutil em cenas de tese: scale 1→1.04 em 60 frames
- Cena curta (tagline/CTA): 1-2s. Cena de tabela/stats: 3-5s. Cena de hero: 3-4s.
- Total alvo: 40s = 1200 frames @30fps

### Fase 5 — Compositor + Root

```tsx
// ReelClienteVersao.tsx
const TIMELINE: Block[] = [
  { from: sec(0.0), dur: sec(3.5), node: <W01 /> },
  // ...
];
export const ReelClienteVersao: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BRAND.bgBase }}>
    {TIMELINE.map((b, i) => (
      <Sequence key={i} from={b.from} durationInFrames={b.dur}>{b.node}</Sequence>
    ))}
  </AbsoluteFill>
);
```

Registrar em `src/Root.tsx`. Type-check obrigatório antes de render:

```bash
cd automacao/remotion-reels/gabriel-style && npx tsc --noEmit
```

Se erro → corrigir, não suprimir.

### Fase 6 — Render

```bash
cd automacao/remotion-reels/gabriel-style
npx remotion render src/index.tsx <CompositionId> out/<projeto>.mp4 --codec=h264 --crf=20 --concurrency=4
```

Default: h264 crf 20, 4 workers paralelos. ~3-4MB pra 40s @ 1080×1920. Render ~30-60s no M1.

Saída final em `out/`. Abrir com `open` pra revisão visual.

---

## DON'TS (anti-padrões)

1. **Não usar texto do brand book HTML como copy.** É placeholder.
2. **Não inventar cor fora da paleta canônica.** Brand book MktOps tem 4 cores. Ponto.
3. **Não usar gradiente em cliente cujo brand book proíbe** (MktOps proíbe explicitamente).
4. **Não misturar estética de cliente.** Reel MktOps não usa marca-texto ciano + memoji estilo Gabriel Gouveia. Cada cliente, seu vocabulário.
5. **Não fazer render sem typecheck.** `npx tsc --noEmit` é gate obrigatório.
6. **Não publicar com áudio extraído de outro reel.** Só pra timing reference; pra publicar, narração própria ou TTS licenciado.
7. **Não criar pasta nova de projeto sem motivo.** Reaproveitar `gabriel-style/` com novas Compositions. Pasta nova só quando o stack de deps muda.
8. **Não inventar fonte.** Stack vem do brand book. Se não tem na `@remotion/google-fonts`, baixar e linkar localmente.

---

## TEMPLATES DE PRIMITIVAS (resumo)

| Primitive | Quando usar |
|---|---|
| `MktMark` / `MktLockup` | Hero, capa, CTA — toda peça MktOps começa e termina com lockup |
| `MktBackground variant="paper"` | Cenas leves de texto editorial |
| `MktBackground variant="ink"` | Cenas de quote, contraste, comando, preço grande |
| `MktBackground variant="accent"` | Marca-mãe, tagline final |
| `WordReveal` | Texto que entra palavra-por-palavra com blur-in stagger |
| `CommandLine` | Demonstrar agente/comando do sistema (`market-strategy`, `/spy`) |
| `TableRow` | Comparações "aluga vs opera", cronologias, mecanismos |
| `StatBlock` | Grid de números (17 guias / 9 agentes / 60+ skills) |
| `LottieIcon name="loading"` | Feedback visual (loading, checkmark, heart, etc — 27 disponíveis) |
| `DiagonalWipe` | Transição entre paletas |
| `ProgressBar` | Sensação de processo rodando |
| `HighlighterTag` | Tags estilo marca-texto (cliente que admita — MktOps NÃO) |
| `HandDrawnArrow` | Anotações estilo Loom (cliente que admita — MktOps NÃO) |

---

## CHECKLIST PRÉ-ENTREGA

Antes de entregar o MP4:

- [ ] Brand book do cliente foi consultado em `_assets/refs/<cliente>/SOURCE-OF-TRUTH.md`
- [ ] Paleta usada bate 100% com o brand book (sem cor inventada)
- [ ] Tipografia bate 100% com o brand book
- [ ] Glifo/lockup respeita regras de pousagem (clear space, tamanho mínimo, sem rotação/distorção)
- [ ] Copy é do briefing do projeto, NÃO do brand book HTML
- [ ] Copy passou pela skill `copywriting-guardrails`
- [ ] `npx tsc --noEmit` passou
- [ ] Render gerou MP4 sem warnings
- [ ] Áudio (se existir) é licenciado/próprio
- [ ] Duração bate com a plataforma alvo (Reels ≤90s, Shorts ≤60s, TikTok ≤3min)

---

## EXEMPLO DE INVOCAÇÃO

**Hélio:** "faça um reel de 30s pro MktOps falando sobre 'parar de alugar marketing'"

**Eu:**
1. Verifico se palette/fonts/primitives MktOps existem → existem (do trabalho 2026-05-11)
2. Verifico SOURCE-OF-TRUTH.md → DM Sans, 4 cores, glifo geométrico, sem gradiente
3. Esboço storyboard (10-12 cenas × 2-3s)
4. Escrevo copy pro briefing — passo por `copywriting-guardrails`
5. Implemento cenas em `scenes-mktops-aluga/index.tsx`
6. Compositor `ReelMktOpsAluga.tsx`, registro em Root
7. `npx tsc --noEmit` → render → entrego `out/mktops-aluga.mp4`

---

## REFERÊNCIAS

- Brand Book MktOps v2.0 — `automacao/remotion-reels/_assets/refs/mktops-brand-v2/`
- Memória persistente — `feedback_brand-book-html-nao-eh-copy.md` e `reference_mktops-brand-v2-assets.md`
- Reels já produzidos (estudo comparativo):
  - `out/mktops-test.mp4` — Gabriel-style (off-brand, exemplo do que NÃO fazer pra MktOps)
  - `out/mktops-v2.mp4` — Editorial Dark V1 (Linear-ish, brand antigo)
  - `out/mktops-v3.mp4` — Brand Book v2.0 aplicado (copy é placeholder, não usar como peça)

---

**Última atualização:** 2026-05-11 — skill criada após pipeline MktOps Brand Book v2.0

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
