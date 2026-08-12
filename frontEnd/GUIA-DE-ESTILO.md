# Guia de Estilo — MotionVerse

Documento de referência para quem for montar as outras telas do jogo (perfis dos alunos, ranking, etc). O objetivo é manter a mesma identidade visual (pixel art cozy, cores da Senac) em todo o site.

---

## 1. Paleta de cores

Todas as cores estão centralizadas em variáveis CSS no `:root`. **Nunca usar cor "hardcoded"** — sempre referenciar a variável.

```css
--bg: #071522;              /* fundo geral (azul quase preto) */
--senac-blue: #004A8D;      /* azul institucional Senac */
--senac-blue-deep: #00284a; /* azul escuro, usado em bordas internas */
--panel: rgba(0,32,58,0.88);    /* fundo de painéis (translúcido) */
--panel-solid: #0b2036;         /* fundo de painéis sólidos (menu mobile, modal) */
--panel-2: rgba(0,42,74,0.9);   /* fundo de área de modelo 3D */
--senac-orange: #F7941D;        /* laranja institucional — cor de destaque/ação */
--senac-orange-light: #FDC180;  /* laranja claro — hover, detalhes, texto de destaque */
--pixel-shadow: #00101c;        /* "sombra pixelada" usada em bordas e box-shadow */
--text: #eef3f8;                /* texto principal (quase branco) */
--text-dim: #9fb8d1;            /* texto secundário/descrição */
```

**Regra de uso:**
- Laranja (`senac-orange`) = ação, destaque, elementos interativos ativos.
- Azul (`senac-blue` / `senac-blue-deep`) = estrutura, bordas internas, elementos neutros.
- `text-dim` para parágrafos de apoio, `text` para títulos e conteúdo principal.

---

## 2. Tipografia

Duas fontes, do Google Fonts, carregadas no `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
--font-pixel: 'Press Start 2P', monospace;   /* títulos, botões, labels, UI */
--font-body: 'Pixelify Sans', monospace;     /* parágrafos, texto corrido */
```

**Regra de uso:**
- `font-pixel` → `h1`, `h2`, `h3`, botões, labels de seção, badges, nav. Sempre em tamanhos pequenos (0.55rem–2.8rem) porque é uma fonte bem larga/alta.
- `font-body` → parágrafos, descrições, texto de conteúdo. Tamanho base do body: `18px`.
- Títulos usam `text-shadow: 2px 3px 0 var(--pixel-shadow)` para dar efeito de profundidade pixelada.

---

## 3. Estilo geral / "pixel art"

- `image-rendering: pixelated` em `img` e `model-viewer` — mantém o efeito 8-bit em qualquer imagem/modelo 3D.
- Bordas grossas (`3px` a `4px`) sólidas, nunca `border-radius` (o estilo é quadrado/pixelado, sem cantos arredondados).
- Sombras "duras" (sem blur), tipo `box-shadow: 5px 5px 0 var(--pixel-shadow)` — simula sombra de sprite, não sombra realista.
- Transições curtas e diretas (`.1s`–`.4s`), sem easing suave — dá uma sensação mais "retrô".

---

## 4. Componentes reutilizáveis

### 4.1 Botão pixelado (`.pixel-btn`)
Base:
```css
.pixel-btn {
  font-family: var(--font-pixel);
  font-size: 0.62rem;
  padding: 10px 16px;
  border: 3px solid var(--pixel-shadow);
  box-shadow: 4px 4px 0 var(--pixel-shadow);
  transition: transform .1s, box-shadow .1s;
}
.pixel-btn:active { transform: translate(4px, 4px); box-shadow: none; }
```
Variantes:
- `.pixel-btn-orange` → ação primária (fundo laranja, texto escuro).
- `.pixel-btn-blue` → ação secundária (fundo azul, texto claro). Ex: botão "Ranking".
- `.pixel-btn-ghost` → ação terciária/neutra (fundo painel escuro, borda laranja).

**Use sempre uma dessas três classes.** Não criar botão novo do zero — se precisar de uma variante nova, seguir o mesmo padrão de borda+sombra+active-state.

### 4.2 Painel (`.pixel-panel`)
Container padrão para cards, blocos de conteúdo, modal:
```css
.pixel-panel {
  background: var(--panel);
  border: 3px solid var(--senac-orange);
  box-shadow: 5px 5px 0 var(--pixel-shadow), inset 0 0 0 3px var(--senac-blue-deep);
}
```
Usado em: cards de mecânica (`.mechanic-card`), frame do trailer, palco do personagem (`.fighter-stage`).

### 4.3 Cards de conteúdo (ex: `.mechanic-card`)
Estrutura: label pequeno (`.mechanic-step`, font-pixel) → ícone SVG (stroke com `currentColor`, cor `senac-orange`) → título `h3` (font-pixel) → parágrafo (font-body, `text-dim`).

### 4.4 Seleção de personagem / roster
- Grid `auto-fill, minmax(84px, 1fr)`.
- Item ativo tem borda laranja + seta animada (`::before` com `\25BC`) balançando via `@keyframes cursorbounce`.
- Cada item carrega um `model-viewer` (thumbnail 3D) com fallback de iniciais enquanto o modelo não carrega (`.thumb-fallback`).
- Miniatura "mestre" (professor) tem selo extra: `.roster-master` (quadrado laranja no canto).

### 4.5 Fallback de modelo 3D
Todo `model-viewer` deve ter um `.avatar-fallback` junto (ring animado + iniciais + texto pequeno), que só aparece se o modelo `error` ou ainda não carregou (classes `model-ready` / `model-error` adicionadas via JS nos eventos `load`/`error` do elemento).

---

## 5. Layout, grid e responsividade

- Seções (`section`) têm padding padrão `110px 6%` (`80px 6%` no mobile).
- Grids usam `repeat(auto-fit/auto-fill, minmax(...))` — evitar `grid-template-columns` fixo em número de colunas.
- Breakpoint único: **`max-width: 860px`** para mobile (menu hambúrguer, grids em coluna única, stage do personagem empilhado).
- Menu mobile: nav-links vira painel lateral fixo (`inset: 0 0 0 26%`), abre/fecha via classe `.open` controlada pelo JS.

---

## 6. Animações padrão

Reaproveitar estas keyframes já existentes em vez de criar novas parecidas:

| Efeito | Keyframe | Uso |
|---|---|---|
| Flutuar suavemente | `hero-float` (steps(6)) | Modelo 3D do herói |
| Piscar | `blink` (steps(2)) | Dot de status ("ao vivo", tag REC) |
| Girar em passos (estilo sprite) | `spin` (steps(8)) | Loading ring do fallback |
| Círculo de runas girando | `rune-spin` (steps(60)) | Decoração atrás do herói |
| Seta indicando seleção | `cursorbounce` (steps(4)) | Item ativo no roster |
| Entrada de seção ao rolar | classes `.reveal` / `.reveal-zoom` + `IntersectionObserver` | Qualquer bloco que deva aparecer ao entrar na viewport |

Todas as animações usam `steps()` em vez de `ease`/`linear` puro sempre que possível, pra manter a sensação de frame-a-frame pixelado.

Respeitar sempre o bloco `@media (prefers-reduced-motion: reduce)` já existente no fim do CSS — qualquer animação nova deve ser coberta por ele (o bloco já zera duração de `animation`/`transition` globalmente, então normalmente não precisa de código extra).

---

## 7. Padrão de JavaScript

- Um único listener `DOMContentLoaded` no topo do arquivo.
- Toggle de classes (`classList.toggle`) em vez de manipular estilo inline.
- Uso de `IntersectionObserver` para: (a) nav ativo conforme scroll, (b) animações de entrada `.reveal`/`.reveal-zoom`.
- Fallback de carregamento de vídeo/modelo 3D sempre tratado com `addEventListener('error', ...)` + timeout de segurança.
- Dataset (`data-*` attributes) para guardar informações de cada item de roster (nome, papel, modelo, página, badge) em vez de hardcoded em JS.

---

## 8. Convenção de nomenclatura CSS

- Componentes: `.pixel-btn`, `.pixel-panel`, `.roster-item`, `.fighter-*`, `.mechanic-*` — prefixo por componente, sem BEM rígido, mas sempre kebab-case.
- Estados: `.is-active`, `.open`, `.scrolled`, `.model-ready`, `.model-error` — sempre com prefixo semântico (`is-`, ou nome direto do estado).
- Nunca estilizar por ID no CSS (os IDs no HTML são só para JS/acessibilidade).

---

## 9. Checklist ao criar uma nova tela

1. Importar as mesmas fontes (`Press Start 2P` + `Pixelify Sans`) e o mesmo `style.css` (ou um CSS que reaproveite as variáveis de `:root`).
2. Usar `--senac-orange`/`--senac-blue` como únicas cores de destaque — não inventar cor nova.
3. Botões sempre com uma das 3 classes `.pixel-btn-*`.
4. Qualquer bloco de conteúdo dentro de `.pixel-panel`.
5. Modelos 3D (`model-viewer`) sempre com fallback `.avatar-fallback` correspondente.
6. Testar em mobile (breakpoint 860px) e com `prefers-reduced-motion`.
7. Títulos em `font-pixel`, texto corrido em `font-body`.
