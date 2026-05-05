# Rivia Print — Upgrade Visual Full Overhaul

**Data:** 2026-05-05  
**Status:** Aprovado  
**Objetivo:** Tornar o site de impressão 3D mais impressionante já visto no setor — direção visual Light & Playful (estilo Stripe/Framer), com animações de nível agência criativa premium usando GSAP, Lenis e efeitos Inspira UI adaptados para vanilla JS.

---

## 1. Decisões de design

| Decisão | Escolha | Razão |
|---|---|---|
| Direção visual | B — Light & Playful | Mantém fundo branco atual; evolui com física leve e micro-animações |
| Efeito estrela do hero | Cards flutuantes + Aurora | Mais tátil, destaca os produtos, inédito no setor |
| Abordagem de implementação | Full Overhaul | Toda a página tem animação expressiva |

---

## 2. Bibliotecas e arquitetura

### CDNs (sem npm, sem bundler — GitHub Pages puro)

```html
<!-- No <head>, antes dos scripts locais -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/bundled/lenis.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<link rel="stylesheet" href="/assets/css/animations.css">
```

### Novos arquivos

```
assets/
  css/
    animations.css    ← keyframes, .cursor, border-beam, spotlight, noise texture
  js/
    animations.js     ← todo GSAP + Lenis; substitui initSmoothScroll e initReveal do main.js
```

### Remoções em `main.js`
- `initSmoothScroll()` — substituída por Lenis
- `initReveal()` — substituída por GSAP ScrollTrigger

---

## 3. Efeitos globais

### Cursor customizado
- Dois elementos `#cursor` (dot 10px) e `#cursor-glow` (ring 40px) posicionados `fixed`
- Dot segue o mouse direto via `mousemove`; ring tem lag via rAF loop (`lerp factor 0.12`)
- No hover de elementos interativos: dot expande para 16px e muda para roxo; ring expande para 56px
- `html, body { cursor: none }` — cursor nativo oculto

### Lenis smooth scroll
```js
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
// Integração Lenis v1 + GSAP: usar ticker do GSAP, não rAF manual
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
// Notificar ScrollTrigger a cada scroll do Lenis
lenis.on('scroll', ScrollTrigger.update);
```

---

## 4. Hero section

### 4.1 Aurora background
Três `<div class="blob">` absolutas, `border-radius: 50%`, `filter: blur(90px)`, cores:
- blob-1: `rgba(56,134,247,0.13)` — azul, top-left
- blob-2: `rgba(168,85,247,0.10)` — roxo, bottom-right
- blob-3: `rgba(34,197,94,0.08)` — verde, center-right

GSAP `gsap.to(blob, { x, y, scale, duration: 7–9.5, yoyo: true, repeat: -1, ease: "sine.inOut" })` com valores e durações diferentes por blob.

### 4.2 Noise texture
Pseudo-elemento `hero::after` com `background-image` SVG feTurbulence inline, `opacity: 0.5`. Adiciona profundidade sutil ao fundo branco sem peso visual.

### 4.3 Entrada da página (load timeline — roda uma vez)
Sequência GSAP com `delay: 0.2`:
1. `.section-label` — `opacity: 0→1`, `y: 12→0`, `duration: 0.5`
2. Cada linha do `<h1>` — clip-path reveal via `overflow: hidden` no `.hero-line` + `translateY(56px→0)` no `span` interno, `stagger: 0.18s`, `ease: "power4.out"`
3. `.hero-subtitle` — `opacity + y`, `duration: 0.55`
4. `.hero-ctas` — `opacity + y`, `duration: 0.5`
5. `.hcard` — `scale: 0.75→1`, `opacity: 0→1`, `stagger: 0.12`, `ease: "back.out(1.4)"`

### 4.4 Cards flutuantes (loop permanente, inicia após intro)
Os cards são renderizados por `products.js` como `.hero-card` dentro de `#heroProducts`. O `animations.js` deve aguardar o `DOMContentLoaded` e usar `querySelectorAll('.hero-card')` com index para aplicar parâmetros individuais:

```js
const cards = document.querySelectorAll('.hero-card');
const floatParams = [
  { y: -14, rotation: -2,   duration: 3.0, delay: 0   },
  { y:  12, rotation:  1.5, duration: 3.6, delay: 0.5 },
  { y: -10, rotation: -1.5, duration: 3.3, delay: 1.1 },
  { y:  14, rotation:  2,   duration: 3.9, delay: 0.3 },
];
cards.forEach((card, i) => {
  const p = floatParams[i] || floatParams[0];
  gsap.to(card, { ...p, yoyo: true, repeat: -1, ease: "sine.inOut" });
});
```

### 4.5 Tilt 3D nos cards (hover)
`mousemove` calcula posição relativa; `gsap.to(card, { rotateX, rotateY, scale: 1.05, transformPerspective: 700 })`.  
`mouseleave` retorna com `ease: "elastic.out(1,0.5)"`.

### 4.6 Spotlight nos cards (hover)
```css
.hcard::before {
  background: radial-gradient(180px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.5), transparent 80%);
  opacity: 0; transition: opacity 0.3s;
}
.hcard:hover::before { opacity: 1; }
```
JS atualiza `--mx` e `--my` via `card.style.setProperty` no `mousemove`.

### 4.7 Mouse parallax no hero
`mousemove` no `.hero-body`:
- Texto (esquerda): `x: offset * -18, y: offset * -12` — move contra o mouse
- Cards (direita): `x: offset * 22, y: offset * 16` — move com o mouse (mais)
- blob-1: se move ainda mais, reforçando profundidade  
`mouseleave` retorna tudo a zero.

### 4.8 Botões magnéticos
Cada botão CTA é envolvido por um `.btn-wrap` com `padding: 20px` extra (área de captura magnética invisível, `display: inline-block`). O `mousemove` é ouvido no wrapper:

`mousemove` no `.btn-wrap`:
```js
const x = (e.clientX - r.left - r.width/2) * 0.35;
const y = (e.clientY - r.top  - r.height/2) * 0.35;
gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
```
`mouseleave`: retorna com `ease: "elastic.out(1,0.4)"`.

### 4.9 Border beam no botão primário
CSS `@property --beam-angle` + `conic-gradient` no `::after`:
```css
.btn-primary::after {
  background: conic-gradient(from var(--beam-angle), transparent 70%, rgba(168,85,247,0.8) 85%, rgba(56,134,247,1) 90%, transparent);
  animation: beamRotate 2.5s linear infinite;
}
@keyframes beamRotate { to { --beam-angle: 360deg; } }
```

### 4.10 Gradiente animado no texto
```css
.text-brand {
  background: linear-gradient(90deg, #3886F7, #a855f7, #3886F7);
  background-size: 200%;
  animation: gradientShift 3.5s ease infinite;
}
```

---

## 5. Trust Strip

- Marquee infinito: dois `.trust-track` idênticos em `display: flex; width: max-content`
- GSAP anima `x` de `0` a `-trackWidth`, `modifiers` com `% trackWidth` para loop seamless
- Pause no hover; `duration: 22s`
- Counter animado: `gsap.to({ val: 0 }, { val: 500, onUpdate: ... })` no "+500 peças impressas", dispara com `onComplete` da intro timeline

---

## 6. Seção Sobre / Features

- Título e subtítulo: clip-path reveal com ScrollTrigger `start: "top 75%"`
- 4 feature cards: `opacity: 0→1`, `y: 40→0`, `stagger: 0.12s`, `ease: "power3.out"`, ScrollTrigger `start: "top 80%"`

---

## 7. Seção "4 Passos" — destaque da página

ScrollTrigger pin da seção inteira enquanto o usuário rola através dos 4 passos.

```js
ScrollTrigger.create({
  trigger: ".como",
  pin: true,
  start: "top top",
  end: "+=300%",
  scrub: 1,
});
```

Por passo:
- Número grande (`font-size: 180px`, `opacity: 0.06`) entra em fade como fundo
- Conteúdo do passo (`h3` + `p`) sobe com clip-path reveal
- Barra de progresso fina no topo da seção avança de 0→100% conforme o scroll

---

## 8. Catálogo — Produto cards

- Grid reveal: ScrollTrigger `batchMax: 3`, `scale: 0.95→1`, `opacity: 0→1`, `y: 20→0`
- Spotlight hover: mesmo padrão dos hero cards (`::before` + CSS vars `--mx`, `--my`)
- Tabs de categoria: fade suave na troca (via `products.js` — adicionar classe `is-transitioning` + GSAP `opacity` tween)

---

## 9. Galeria

- 6 items: ScrollTrigger stagger, pares entram da direita (`x: 30`), ímpares da esquerda (`x: -30`), `opacity: 0→1`
- Parallax nas imagens: `gsap.to(img, { y: -20 })` com `scrollTrigger: { scrub: 1.5 }` — imagem desloca ao rolar, criando profundidade

---

## 10. Seção Contato

3 cards entram com stagger diagonal: `y: 30, x: -10 → 0,0`, `stagger: 0.15s`, `ease: "back.out(1.3)"`, ScrollTrigger `start: "top 85%"`.

---

## 11. Footer

4 colunas entram com stagger: `y: 20→0`, `opacity: 0→1`, `stagger: 0.1s`, ScrollTrigger `start: "top 95%"`.

---

## 12. Performance e acessibilidade

- `prefers-reduced-motion`: wrapper `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)` — pula intro timeline, mostra tudo imediatamente, desativa loops de float
- Cursor customizado: ativado apenas em `pointer: fine` (desktop)
- `will-change: transform` apenas nos `.hcard` e blobs — evitar em elementos de texto
- ScrollTrigger `invalidateOnRefresh: true` para lidar com resize correto
- Border beam: `@property` tem fallback gracioso em browsers sem suporte (botão fica sem o efeito, não quebra)

---

## 13. Arquivos modificados

| Arquivo | Ação | Detalhes |
|---|---|---|
| `index.html` | Modificar | Adicionar CDN links, cursor divs, remover inline `smooth` do scrollTo |
| `assets/js/main.js` | Modificar | Remover `initSmoothScroll()` e `initReveal()`; manter restante |
| `assets/js/animations.js` | Criar | Lenis + todo GSAP |
| `assets/css/animations.css` | Criar | Keyframes, cursor, border-beam, spotlight, noise, trust marquee |
| `assets/js/products.js` | Modificar pequeno | Adicionar classe `is-transitioning` na troca de tabs |
