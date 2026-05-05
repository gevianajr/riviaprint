# Rivia Print — Full Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar GSAP + Lenis + efeitos Inspira UI em todas as seções do site da Rivia Print — cursor customizado, aurora, cards flutuantes, tilt 3D, spotlight, border beam, botões magnéticos, parallax, marquee, pin dos 4 passos, e reveals por seção.

**Architecture:** `animations.js` (novo) gerencia todo GSAP + Lenis. `animations.css` (novo) tem todos os keyframes e estilos de animação. `main.js` perde `initSmoothScroll` e `initReveal`. `products.js` ganha dispatch de `riviaProductsReady` após renderizar os hero cards. Tudo via CDN, sem bundler.

**Tech Stack:** GSAP 3.12.5 + ScrollTrigger via cdnjs, Lenis v1 via jsDelivr, vanilla JS/CSS, GitHub Pages.

**Para testar localmente:** O site usa `fetch('data/products.json')` — precisa de servidor HTTP. Use VS Code Live Server (porta 5500) ou `python -m http.server 5500` na raiz do projeto.

---

## Task 1: Foundation — CDN + arquivos novos + main.js cleanup

**Files:**
- Modify: `index.html`
- Modify: `assets/js/main.js`
- Create: `assets/css/animations.css`
- Create: `assets/js/animations.js`

- [ ] **Passo 1: Criar `assets/css/animations.css` vazio**

```css
/* animations.css — gerado pelo upgrade visual Full Overhaul */

/* Neutraliza o sistema .reveal do CSS antigo — GSAP assume o controle */
.reveal,
.reveal.visible {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}
```

- [ ] **Passo 2: Criar `assets/js/animations.js` com boilerplate**

```js
(function () {
  'use strict';

  // Aguarda GSAP, ScrollTrigger e Lenis estarem disponíveis
  function waitForLibs(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
      cb();
    } else {
      requestAnimationFrame(() => waitForLibs(cb));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    waitForLibs(initAnimations);
  });

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    // tarefas inicializadas nas próximas tasks
  }
})();
```

- [ ] **Passo 3: Adicionar CDN links e `animations.css` no `index.html`**

No `<head>`, DEPOIS dos links de CSS existentes e ANTES do fechamento `</head>`:

```html
  <!-- CSS de animações -->
  <link rel="stylesheet" href="/assets/css/animations.css">

  <!-- CDN: Lenis v1 (smooth scroll) -->
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/bundled/lenis.min.js" defer></script>
  <!-- CDN: GSAP 3.12.5 + ScrollTrigger -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
```

Adicionar `animations.js` DEPOIS de `products.js` nos scripts no final do `<body>`:

```html
  <script src="/assets/js/main.js" defer></script>
  <script src="/assets/js/products.js" defer></script>
  <script src="/assets/js/animations.js" defer></script>
```

- [ ] **Passo 4: Remover `initSmoothScroll()` e `initReveal()` do `main.js`**

Em `assets/js/main.js`, remover a função `initSmoothScroll` inteira (linhas 39–53) e a função `initReveal` inteira (linhas 75–92). Remover também as chamadas `initSmoothScroll()` e `initReveal()` no bloco `DOMContentLoaded` no final.

- [ ] **Passo 5: Verificar**

Abrir `http://localhost:5500` no browser. O site deve renderizar normalmente, sem erros no console. Todas as seções visíveis (o `.reveal` CSS neutralizado garante isso). O scroll ainda funciona (scroll nativo, Lenis ainda não foi inicializado).

- [ ] **Passo 6: Commit**

```bash
git add index.html assets/js/main.js assets/css/animations.css assets/js/animations.js
git commit -m "feat(animations): foundation - CDN libs, animations.js/css, remove old reveal/scroll"
```

---

## Task 2: Lenis smooth scroll

**Files:**
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Inicializar Lenis e integrar com GSAP em `animations.js`**

Substituir o comentário `// tarefas inicializadas nas próximas tasks` por:

```js
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
  }

  function initLenis() {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

    // Integração Lenis v1 + GSAP: usar o ticker do GSAP
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Notificar ScrollTrigger a cada evento de scroll do Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Smooth scroll nos links âncora (substitui initSmoothScroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -(document.getElementById('header')?.offsetHeight || 72) });
      });
    });
  }
```

- [ ] **Passo 2: Verificar**

Abrir `http://localhost:5500`. Rolar a página com mouse wheel — o scroll deve ter inércia suave (momentum), visivelmente diferente do scroll nativo. Clicar nos links de navegação ("Sobre", "Produtos" etc.) deve fazer scroll suave até as seções.

- [ ] **Passo 3: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat(animations): Lenis smooth scroll com integração GSAP ticker"
```

---

## Task 3: Cursor customizado

**Files:**
- Modify: `index.html`
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar divs do cursor no `index.html`**

Logo após `<body>`, antes do `<!-- HEADER -->`:

```html
  <!-- Cursor customizado (desktop only) -->
  <div id="cursorDot" aria-hidden="true"></div>
  <div id="cursorGlow" aria-hidden="true"></div>
```

- [ ] **Passo 2: Adicionar CSS do cursor em `animations.css`**

```css
/* ---- CURSOR CUSTOMIZADO ---- */
@media (pointer: fine) {
  html, body { cursor: none; }
  a, button, [role="button"], .hcard, .galeria-item, .tab { cursor: none; }
}

#cursorDot {
  position: fixed;
  width: 10px;
  height: 10px;
  background: #3886F7;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
  will-change: left, top;
}

#cursorGlow {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(56, 134, 247, 0.35);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease;
  will-change: left, top;
}

body.cursor-hover #cursorDot {
  width: 14px;
  height: 14px;
  background: #a855f7;
}

body.cursor-hover #cursorGlow {
  width: 52px;
  height: 52px;
  border-color: rgba(168, 85, 247, 0.4);
}
```

- [ ] **Passo 3: Adicionar lógica do cursor em `animations.js`**

Adicionar chamada `initCursor()` dentro de `initAnimations()` e a função:

```js
  function initCursor() {
    // Ativar apenas em dispositivos com pointer preciso (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = document.getElementById('cursorDot');
    const glow = document.getElementById('cursorGlow');
    if (!dot || !glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX  = mouseX;
    let glowY  = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    // Glow segue com lag via rAF
    (function loopGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.left = glowX + 'px';
      glow.style.top  = glowY + 'px';
      requestAnimationFrame(loopGlow);
    })();

    // Hover state em elementos interativos
    const interactiveSelector = 'a, button, [role="button"], .tab, .galeria-item, .produto-card, .contato-card';
    document.querySelectorAll(interactiveSelector).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }
```

- [ ] **Passo 4: Verificar**

Abrir no browser. No desktop (com mouse), o cursor nativo desaparece e aparece o dot azul + ring seguindo com lag. Ao passar sobre links/botões, o dot fica maior e roxo.

- [ ] **Passo 5: Commit**

```bash
git add index.html assets/css/animations.css assets/js/animations.js
git commit -m "feat(animations): cursor customizado com dot + glow ring, hover state"
```

---

## Task 4: Hero HTML — blobs, .hero-line, .btn-wrap, .btn-beam

**Files:**
- Modify: `index.html`

Esta task é só HTML — sem JS/CSS novo. Prepara a estrutura que as tasks de animação usarão.

- [ ] **Passo 1: Adicionar blobs de aurora dentro da `<section id="home" class="hero">`**

Logo após `<section id="home" class="hero">` e antes de `<div class="container hero-grid">`:

```html
    <!-- Aurora background (animado por GSAP) -->
    <div class="hero-blob hero-blob-1" aria-hidden="true"></div>
    <div class="hero-blob hero-blob-2" aria-hidden="true"></div>
    <div class="hero-blob hero-blob-3" aria-hidden="true"></div>
```

- [ ] **Passo 2: Envolver cada linha do `<h1>` em `.hero-line > span`**

Substituir o `<h1>` atual por:

```html
          <h1>
            <span class="hero-line" aria-hidden="true"><span>Suas ideias,</span></span>
            <span class="hero-line" aria-hidden="true"><span class="text-brand">impressas em 3D</span></span>
            <span class="hero-line" aria-hidden="true"><span>com capricho.</span></span>
          </h1>
          <h1 class="hero-h1-sr" aria-label="Suas ideias, impressas em 3D com capricho."></h1>
```

> Nota: o `<h1>` com `aria-label` é a versão acessível para screen readers. O visível tem `aria-hidden` pois a animação de clip-path pode confundir leitores. Ajuste se preferir manter apenas um `<h1>`.

Na prática, a forma mais simples e acessível é manter o `<h1>` normal e fazer a animação funcionar com ele. Use esta versão simplificada:

```html
          <h1>
            <span class="hero-line"><span>Suas ideias,</span></span>
            <span class="hero-line"><span class="text-brand">impressas em 3D</span></span>
            <span class="hero-line"><span>com capricho.</span></span>
          </h1>
```

- [ ] **Passo 3: Envolver os botões CTA do hero em `.btn-wrap`**

Substituir o `<div class="hero-ctas">` atual por:

```html
          <div class="hero-ctas" id="heroCtas">
            <span class="btn-wrap">
              <a href="#produtos" class="btn btn-primary btn-beam">Ver catálogo</a>
            </span>
            <span class="btn-wrap">
              <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="btn btn-secondary">Falar no Instagram</a>
            </span>
          </div>
```

- [ ] **Passo 4: Verificar**

Abrir no browser. O hero deve parecer idêntico ao antes (sem animações ainda). Não deve haver elementos visíveis quebrados.

- [ ] **Passo 5: Commit**

```bash
git add index.html
git commit -m "feat(hero): estrutura HTML para animações — blobs, hero-line, btn-wrap"
```

---

## Task 5: Aurora blobs — CSS + GSAP

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar CSS dos blobs em `animations.css`**

```css
/* ---- AURORA BLOBS ---- */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}

.hero-blob-1 {
  width: 480px;
  height: 480px;
  background: rgba(56, 134, 247, 0.13);
  top: -140px;
  left: -80px;
}

.hero-blob-2 {
  width: 360px;
  height: 360px;
  background: rgba(168, 85, 247, 0.10);
  bottom: -80px;
  right: 60px;
}

.hero-blob-3 {
  width: 280px;
  height: 280px;
  background: rgba(34, 197, 94, 0.08);
  top: 60px;
  right: 260px;
}

/* Hero precisa de overflow:hidden para não vazar blobs */
.hero { overflow: hidden; }

/* Noise texture sutil */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.45;
}

/* hero-grid deve ficar acima dos blobs e noise */
.hero-grid { position: relative; z-index: 2; }
```

- [ ] **Passo 2: Adicionar animação dos blobs em `animations.js`**

Adicionar chamada `initAurora()` em `initAnimations()` e a função:

```js
  function initAurora() {
    const b1 = document.querySelector('.hero-blob-1');
    const b2 = document.querySelector('.hero-blob-2');
    const b3 = document.querySelector('.hero-blob-3');
    if (!b1 || !b2 || !b3) return;

    gsap.to(b1, { x: 55, y: -38, scale: 1.18, duration: 8,   yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(b2, { x: -38, y: 32, scale: 0.88, duration: 9.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(b3, { x: 28, y: 42,  scale: 1.12, duration: 7,   yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }
```

- [ ] **Passo 3: Verificar**

Abrir no browser. Os blobs coloridos devem estar visíveis no hero e respirar lentamente. A textura de ruído deve ser muito sutil (quase imperceptível). O conteúdo do hero deve ficar acima dos blobs.

- [ ] **Passo 4: Commit**

```bash
git add assets/css/animations.css assets/js/animations.js
git commit -m "feat(hero): aurora background com blobs GSAP + noise texture"
```

---

## Task 6: Hero load timeline — text reveal + cards entrance

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar CSS do `.hero-line` em `animations.css`**

```css
/* ---- HERO LINE CLIP-PATH REVEAL ---- */
.hero-line {
  display: block;
  overflow: hidden;
}

.hero-line span {
  display: block;
  /* Estado inicial definido por GSAP no initHeroTimeline */
}

/* Gradiente animado no texto da marca */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

.hero .text-brand {
  background: linear-gradient(90deg, #3886F7, #a855f7, #3886F7);
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3.5s ease infinite;
}

/* Ocultar seção-label e hero-subtitle até GSAP animar */
.hero .section-label,
.hero .hero-subtitle,
.hero .hero-ctas {
  opacity: 0;
}
```

- [ ] **Passo 2: Adicionar `initHeroTimeline` em `animations.js`**

Adicionar chamada `initHeroTimeline()` em `initAnimations()` e a função:

```js
  function initHeroTimeline() {
    // Estado inicial via GSAP
    gsap.set('.hero-line span', { y: 56 });
    gsap.set('.hero .section-label', { opacity: 0, y: 12 });
    gsap.set('.hero .hero-subtitle', { opacity: 0, y: 18 });
    gsap.set('.hero .hero-ctas',     { opacity: 0, y: 18 });
    // Hero cards são animados em Task 8 após riviaProductsReady

    const tl = gsap.timeline({ delay: 0.15, onComplete: initHeroFloat });

    tl.to('.hero .section-label',    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to('.hero-line',              { opacity: 1, duration: 0 }, '-=0.1')
      .to('.hero-line span', {
          y: 0,
          duration: 0.75,
          stagger: 0.18,
          ease: 'power4.out'
        }, '-=0.1')
      .to('.hero .hero-subtitle',    { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4')
      .to('.hero .hero-ctas',        { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.35');
  }

  // Placeholder — substituído na Task 8
  function initHeroFloat() {}
```

- [ ] **Passo 3: Verificar**

Recarregar `http://localhost:5500`. Ao abrir a página: label aparece primeiro, depois cada linha do h1 sobe de baixo (clip-path), depois o subtitle, depois os CTAs. O gradiente azul→roxo deve estar animando no "impressas em 3D".

- [ ] **Passo 4: Commit**

```bash
git add assets/css/animations.css assets/js/animations.js
git commit -m "feat(hero): load timeline — clip-path reveal das linhas do h1 + gradient text"
```

---

## Task 7: products.js — dispatch `riviaProductsReady`

**Files:**
- Modify: `assets/js/products.js`

- [ ] **Passo 1: Adicionar dispatch após `renderHeroProducts` em `products.js`**

Dentro da função `init()`, após a linha `renderHeroProducts(data.produtos, corPorCategoria);`, adicionar:

```js
      // Notifica animations.js que os hero cards foram renderizados
      document.dispatchEvent(new CustomEvent('riviaProductsReady'));
```

- [ ] **Passo 2: Verificar**

No console do browser, adicionar temporariamente:
```js
document.addEventListener('riviaProductsReady', () => console.log('products ready'));
```
Recarregar — deve aparecer "products ready" no console após o fetch concluir. Remover o log temporário depois de verificar.

- [ ] **Passo 3: Commit**

```bash
git add assets/js/products.js
git commit -m "feat(products): dispatch riviaProductsReady após renderizar hero cards"
```

---

## Task 8: Hero cards — float + tilt 3D + spotlight

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Atualizar CSS dos `.hero-card` em `animations.css`**

Os `.hero-card` têm `transform: rotate(Xdeg)` no `style.css`. GSAP vai sobrescrever essas rotações, então não precisamos remover do CSS — o GSAP tem controle total via `overwrite`. Adicionar o spotlight:

```css
/* ---- HERO CARDS — spotlight + tilt ---- */
.hero-card {
  position: relative;
  transform-style: preserve-3d;
  /* Remover a hover transform do style.css original (GSAP assume) */
  will-change: transform;
}

/* Override do hover do style.css — GSAP gerencia */
.hero-card:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Spotlight: círculo de luz que segue o cursor */
.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    200px at var(--card-mx, 50%) var(--card-my, 50%),
    rgba(255, 255, 255, 0.55),
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.hero-card:hover::before { opacity: 1; }
```

- [ ] **Passo 2: Substituir `initHeroFloat` vazio em `animations.js` e adicionar `initHeroCards`**

Substituir a linha `function initHeroFloat() {}` por:

```js
  function initHeroFloat() {
    initHeroCards();
  }

  function initHeroCards() {
    const cards = Array.from(document.querySelectorAll('#heroProducts .hero-card'));
    if (cards.length === 0) return;

    // Parâmetros de flutuação por card (máx 4 cards)
    const floatParams = [
      { y: -14, rotation: -2,   duration: 3.0, delay: 0   },
      { y:  12, rotation:  1.5, duration: 3.6, delay: 0.5 },
      { y: -10, rotation: -1.5, duration: 3.3, delay: 1.1 },
      { y:  14, rotation:  2,   duration: 3.9, delay: 0.3 },
    ];

    // Entrada dos cards com bounce
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)' }
    );

    // Float loop
    cards.forEach((card, i) => {
      const p = floatParams[i % floatParams.length];
      gsap.to(card, {
        y: p.y, rotation: p.rotation,
        duration: p.duration, delay: p.delay,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
    });

    // Tilt 3D + spotlight
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * 22, rotateX: -y * 22, scale: 1.05,
          duration: 0.25, ease: 'power2.out',
          transformPerspective: 700, overwrite: 'auto'
        });
        card.style.setProperty('--card-mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--card-my', (e.clientY - r.top)  + 'px');
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0, scale: 1,
          duration: 0.7, ease: 'elastic.out(1,0.5)', overwrite: 'auto'
        });
      });
    });
  }
```

- [ ] **Passo 3: Ouvir o evento `riviaProductsReady` em `animations.js`**

Adicionar chamada `initHeroCardsListener()` em `initAnimations()` e a função:

```js
  function initHeroCardsListener() {
    document.addEventListener('riviaProductsReady', function () {
      // Se a intro timeline já terminou (onComplete), chama direto
      // Se não, initHeroFloat já será chamado pelo onComplete
      const cards = document.querySelectorAll('#heroProducts .hero-card');
      if (cards.length > 0) initHeroCards();
    }, { once: true });
  }
```

> Nota: `initHeroCards` pode ser chamada duas vezes em edge case (timeline completa E evento dispara). Adicionar guard:

```js
  let heroCardsInitialized = false;
  function initHeroFloat() {
    if (heroCardsInitialized) return;
    heroCardsInitialized = true;
    initHeroCards();
  }
  function initHeroCardsListener() {
    document.addEventListener('riviaProductsReady', function () {
      if (heroCardsInitialized) return;
      heroCardsInitialized = true;
      initHeroCards();
    }, { once: true });
  }
```

- [ ] **Passo 4: Verificar**

Abrir no browser. Os 4 cards do hero devem:
1. Aparecer com bounce na entrada da página
2. Flutuar continuamente com alturas e rotações distintas
3. Ao passar o mouse: inclinar em 3D e mostrar o spotlight (círculo de luz)
4. Ao sair do mouse: retornar com efeito elástico

- [ ] **Passo 5: Commit**

```bash
git add assets/css/animations.css assets/js/animations.js
git commit -m "feat(hero): cards flutuantes + tilt 3D + spotlight no hover"
```

---

## Task 9: Mouse parallax + botões magnéticos

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar CSS dos `.btn-wrap` em `animations.css`**

```css
/* ---- BOTÕES MAGNÉTICOS ---- */
.btn-wrap {
  display: inline-block;
  padding: 18px;       /* área de captura magnética */
  margin: -18px;       /* compensa o padding para não afetar o layout */
  vertical-align: middle;
}
```

- [ ] **Passo 2: Adicionar `initMouseParallax` e `initMagneticButtons` em `animations.js`**

Adicionar chamadas em `initAnimations()` e as funções:

```js
  function initMouseParallax() {
    const heroBody = document.querySelector('.hero-grid');
    const heroLeft  = document.querySelector('.hero-content');
    const heroRight = document.querySelector('.hero-products');
    const blob1     = document.querySelector('.hero-blob-1');
    if (!heroBody || !heroLeft || !heroRight) return;

    heroBody.addEventListener('mousemove', (e) => {
      const r = heroBody.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;

      gsap.to(heroLeft,  { x: x * -16, y: y * -10, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(heroRight, { x: x *  20, y: y *  14, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
      if (blob1) gsap.to(blob1, { x: x * 45 + 55, y: y * 32 - 38, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
    });

    heroBody.addEventListener('mouseleave', () => {
      gsap.to([heroLeft, heroRight], { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
    });
  }

  function initMagneticButtons() {
    document.querySelectorAll('.btn-wrap').forEach(wrap => {
      const btn = wrap.querySelector('.btn');
      if (!btn) return;

      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.38;
        const y = (e.clientY - r.top  - r.height / 2) * 0.38;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });

      wrap.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      });
    });
  }
```

- [ ] **Passo 3: Verificar**

Mover o mouse pelo hero. O texto (esquerda) e os cards (direita) devem se mover em camadas opostas criando profundidade. Passar o mouse sobre os botões: eles devem "atrair" levemente para o cursor e voltar com efeito elástico ao sair.

- [ ] **Passo 4: Commit**

```bash
git add assets/css/animations.css assets/js/animations.js
git commit -m "feat(hero): mouse parallax por camadas + botões magnéticos"
```

---

## Task 10: Border beam + counter animado

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar CSS do border beam em `animations.css`**

```css
/* ---- BORDER BEAM (botão primário do hero) ---- */
@property --beam-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes beamRotate {
  to { --beam-angle: 360deg; }
}

.btn-beam {
  position: relative;
  overflow: visible;  /* para o beam aparecer fora da borda */
  isolation: isolate;
}

.btn-beam::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--beam-angle),
    transparent 70%,
    rgba(168, 85, 247, 0.85) 85%,
    rgba(56, 134, 247, 1) 90%,
    rgba(168, 85, 247, 0.85) 95%,
    transparent
  );
  animation: beamRotate 2.5s linear infinite;
  z-index: -1;
  border-radius: var(--radius-pill);
}
```

- [ ] **Passo 2: Adicionar counter animado e trust strip counter span no HTML**

Em `index.html`, no trust strip, substituir `<span>✓ +500 peças impressas</span>` por:

```html
<span>✓ <span id="trustCounter">+500</span> peças impressas</span>
```

- [ ] **Passo 3: Adicionar `initTrustCounter` em `animations.js`**

Adicionar chamada em `initAnimations()` e a função:

```js
  function initTrustCounter() {
    const el = document.getElementById('trustCounter');
    if (!el) return;

    let triggered = false;

    ScrollTrigger.create({
      trigger: '.trust-strip',
      start: 'top 95%',
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 500,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = '+' + Math.round(obj.val);
          }
        });
      }
    });
  }
```

- [ ] **Passo 4: Verificar**

1. No hero: o botão "Ver catálogo" deve ter uma luz girando na borda
2. Rolar até o trust strip: o "+500" deve contar de 0 até 500 na primeira vez que aparece na tela
3. `@property` não suportado em Firefox < 128 — o beam fica invisível mas o botão funciona normalmente

- [ ] **Passo 5: Commit**

```bash
git add index.html assets/css/animations.css assets/js/animations.js
git commit -m "feat(hero): border beam no btn-beam + counter animado no trust strip"
```

---

## Task 11: Trust strip marquee infinito

**Files:**
- Modify: `index.html`
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Substituir HTML do trust strip em `index.html`**

Substituir o `<div class="trust-strip">` completo por:

```html
      <!-- Trust strip — marquee infinito -->
      <div class="trust-strip" role="marquee" aria-label="Diferenciais da Rivia Print">
        <div class="trust-marquee-wrapper" id="trustMarqueeWrapper">
          <div class="trust-marquee-track">
            <span class="trust-item">✓ Entrega em todo Brasil</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ <span id="trustCounter">+500</span> peças impressas</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Personalização sob demanda</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Materiais de qualidade</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Prazo combinado</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Feito no Brasil com carinho</span>
            <span class="trust-sep" aria-hidden="true"></span>
          </div>
          <div class="trust-marquee-track" aria-hidden="true">
            <span class="trust-item">✓ Entrega em todo Brasil</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ +500 peças impressas</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Personalização sob demanda</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Materiais de qualidade</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Prazo combinado</span>
            <span class="trust-sep" aria-hidden="true"></span>
            <span class="trust-item">✓ Feito no Brasil com carinho</span>
            <span class="trust-sep" aria-hidden="true"></span>
          </div>
        </div>
      </div>
```

- [ ] **Passo 2: Adicionar CSS do marquee em `animations.css`**

```css
/* ---- TRUST STRIP MARQUEE ---- */
.trust-strip {
  overflow: hidden;
  /* override do style.css — mantém background e bordas, troca o inner */
}

/* Neutraliza o .trust-strip-inner do style.css */
.trust-strip-inner { display: none !important; }

.trust-marquee-wrapper {
  display: flex;
  width: max-content;
}

.trust-marquee-track {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 20px;
  flex-shrink: 0;
}

.trust-item {
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.trust-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-border);
  flex-shrink: 0;
}
```

- [ ] **Passo 3: Adicionar `initTrustMarquee` em `animations.js`**

```js
  function initTrustMarquee() {
    const wrapper = document.getElementById('trustMarqueeWrapper');
    if (!wrapper) return;

    const getTrackWidth = () => {
      const track = wrapper.querySelector('.trust-marquee-track');
      return track ? track.offsetWidth : 0;
    };

    const marquee = gsap.to(wrapper, {
      x: () => -getTrackWidth(),
      duration: 22,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % getTrackWidth())
      }
    });

    const strip = wrapper.closest('.trust-strip');
    if (strip) {
      strip.addEventListener('mouseenter', () => marquee.pause());
      strip.addEventListener('mouseleave', () => marquee.play());
    }
  }
```

Adicionar chamada `initTrustMarquee()` em `initAnimations()`. (`initTrustCounter` já foi adicionado na Task 10 — não duplicar.)

- [ ] **Passo 4: Verificar**

O trust strip deve rolar horizontalmente de forma contínua e seamless. Ao passar o mouse, pausa. Os itens devem aparecer em loop infinito.

- [ ] **Passo 5: Commit**

```bash
git add index.html assets/css/animations.css assets/js/animations.js
git commit -m "feat(trust-strip): marquee infinito com GSAP + pause no hover"
```

---

## Task 12: ScrollTrigger reveals — Sobre, Contato, Footer

**Files:**
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar `initSectionReveals` em `animations.js`**

```js
  function initSectionReveals() {
    // --- Como encomendar: header ---
    gsap.from('.como-header .section-label', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.como-header', start: 'top 80%' }
    });
    gsap.from('.como-header .section-title', {
      opacity: 0, y: 30, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.como-header', start: 'top 75%' }
    });

    // --- Sobre: título ---
    gsap.from('.sobre-header .section-label', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.sobre-header', start: 'top 80%' }
    });
    gsap.from('.sobre-header .section-title, .sobre-header .section-subtitle', {
      opacity: 0, y: 30, duration: 0.65, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.sobre-header', start: 'top 75%' }
    });

    // --- Sobre: feature cards ---
    gsap.from('.feature', {
      opacity: 0, y: 40, scale: 0.96,
      duration: 0.6, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.features', start: 'top 80%' }
    });

    // --- Catálogo: header ---
    gsap.from('.catalogo-header .section-label', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.catalogo-header', start: 'top 80%' }
    });
    gsap.from('.catalogo-header .section-title, .catalogo-header .section-subtitle', {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.catalogo-header', start: 'top 75%' }
    });

    // --- Contato: cards com stagger diagonal ---
    gsap.from('.contato-card', {
      opacity: 0, y: 30, x: -10,
      duration: 0.6, stagger: 0.15, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '.contato-grid', start: 'top 85%' }
    });

    // --- Footer: colunas ---
    gsap.from('.footer-brand, .footer-links, .footer-contato, .footer-redes', {
      opacity: 0, y: 20,
      duration: 0.5, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '.footer-inner', start: 'top 95%' }
    });
  }
```

Adicionar chamada `initSectionReveals()` em `initAnimations()`.

- [ ] **Passo 2: Verificar**

Rolar a página até cada seção. "Sobre" deve ter os 4 feature cards aparecendo em stagger. Os cards de contato devem entrar em diagonal. As colunas do footer devem aparecer em sequência.

- [ ] **Passo 3: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat(animations): ScrollTrigger reveals — Sobre, Contato, Footer"
```

---

## Task 13: "4 Passos" — seção pinada com steps sequenciais

**Files:**
- Modify: `index.html`
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Reestruturar HTML da seção `.como` em `index.html`**

Substituir o `<section id="como" class="como">` completo por:

```html
    <!-- COMO ENCOMENDAR -->
    <section id="como" class="como">
      <!-- Barra de progresso -->
      <div class="como-progress-bar" aria-hidden="true">
        <div class="como-progress-fill" id="comoProgressFill"></div>
      </div>

      <div class="container">
        <div class="como-header reveal">
          <span class="section-label">Encomendar é fácil</span>
          <h2 class="section-title">4 passos pra ter sua peça</h2>
        </div>

        <div class="passos-stage" id="passosStage">
          <!-- Número grande decorativo -->
          <div class="passo-bg-num" id="passoBgNum" aria-hidden="true">1</div>

          <ol class="passos-list">
            <li class="passo-item" data-passo="0">
              <span class="passo-num">1</span>
              <h3>Escolha</h3>
              <p>Navegue pelo catálogo e veja o que mais combina com você.</p>
            </li>
            <li class="passo-item" data-passo="1">
              <span class="passo-num">2</span>
              <h3>Chame</h3>
              <p>Manda mensagem no DM do Instagram ou no WhatsApp.</p>
            </li>
            <li class="passo-item" data-passo="2">
              <span class="passo-num">3</span>
              <h3>Combinamos</h3>
              <p>Definimos cor, prazo e valor juntos. Sem pressão.</p>
            </li>
            <li class="passo-item" data-passo="3">
              <span class="passo-num">4</span>
              <h3>Receba</h3>
              <p>Produzimos com carinho e enviamos pra você. Pronto!</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
```

- [ ] **Passo 2: Adicionar CSS da seção pinada em `animations.css`**

```css
/* ---- 4 PASSOS PINADO ---- */
.como-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-border);
  z-index: 10;
}

.como-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #3886F7, #a855f7);
  transition: width 0.05s linear;
}

.como { position: relative; overflow: hidden; }

.passos-stage {
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-lg);
}

.passo-bg-num {
  position: absolute;
  font-size: clamp(120px, 18vw, 200px);
  font-weight: 900;
  color: var(--color-brand);
  opacity: 0.05;
  letter-spacing: -8px;
  pointer-events: none;
  z-index: 0;
  user-select: none;
  line-height: 1;
}

.passos-list {
  list-style: none;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
}

.passo-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  opacity: 0;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

/* Primeiro passo visível por padrão antes do GSAP */
.passo-item[data-passo="0"] { opacity: 1; }

/* Mobile: desativar pin, mostrar como grid */
@media (max-width: 767px) {
  .passos-stage { min-height: auto; display: block; }
  .passos-list  { position: static; max-width: 100%; }
  .passo-item   {
    position: static;
    transform: none;
    opacity: 1;
    margin-bottom: var(--space-sm);
  }
}
```

- [ ] **Passo 3: Adicionar `initPassosPin` em `animations.js`**

```js
  function initPassosPin() {
    // Desativar pin em mobile
    if (window.matchMedia('(max-width: 767px)').matches) {
      gsap.from('.passo-item', {
        opacity: 0, y: 30,
        duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.passos-stage', start: 'top 80%' }
      });
      return;
    }

    const itens    = gsap.utils.toArray('.passo-item');
    const bgNum    = document.getElementById('passoBgNum');
    const progress = document.getElementById('comoProgressFill');

    // Estado inicial
    gsap.set(itens, { opacity: 0, y: 30 });
    gsap.set(itens[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#como',
        pin: true,
        start: 'top top',
        end: '+=250%',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progress) progress.style.width = (self.progress * 100) + '%';
          if (bgNum) {
            const step = Math.min(Math.floor(self.progress * itens.length), itens.length - 1);
            bgNum.textContent = step + 1;
          }
        }
      }
    });

    // Sequência: cada passo entra e sai, exceto o último que fica
    itens.forEach((item, i) => {
      if (i > 0) {
        tl.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 });
      }
      if (i < itens.length - 1) {
        tl.to(item, { opacity: 0, y: -30, duration: 0.3 }, '+=0.5');
      }
    });
  }
```

Adicionar chamada `initPassosPin()` em `initAnimations()`.

- [ ] **Passo 4: Verificar**

No desktop: rolar até "4 passos". A seção deve pinnar. Conforme o scroll avança, cada passo aparece e some (1→2→3→4). A barra de progresso avança. O número grande muda de 1 a 4 no fundo. No mobile: os 4 passos aparecem em stagger simples, sem pin.

- [ ] **Passo 5: Commit**

```bash
git add index.html assets/css/animations.css assets/js/animations.js
git commit -m "feat(como): seção 4 passos pinada com steps sequenciais + progress bar"
```

---

## Task 14: Catálogo — spotlight + grid reveal + tab fade

**Files:**
- Modify: `assets/css/animations.css`
- Modify: `assets/js/animations.js`
- Modify: `assets/js/products.js`

- [ ] **Passo 1: Adicionar CSS do spotlight nos `.produto-card` em `animations.css`**

```css
/* ---- CATÁLOGO: SPOTLIGHT + GRID REVEAL ---- */
.produto-card {
  position: relative;
  overflow: hidden;
}

/* Override do hover transform do style.css — GSAP e spotlight assumem */
.produto-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    200px at var(--card-mx, 50%) var(--card-my, 50%),
    rgba(56, 134, 247, 0.10),
    transparent 75%
  );
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 1;
}

.produto-card:hover::before { opacity: 1; }

/* Estado inicial para GSAP scroll reveal */
.produtos-grid .produto-card {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

/* Tab transition */
.catalogo-tabs.is-transitioning .tab { pointer-events: none; }
```

- [ ] **Passo 2: Adicionar spotlight JS e grid reveal em `animations.js`**

```js
  function initCatalogo() {
    // Spotlight nos cards
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.produto-card').forEach(card => {
        if (card.dataset.spotlightInit) return;
        card.dataset.spotlightInit = '1';

        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--card-mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--card-my', (e.clientY - r.top)  + 'px');
        });
      });

      // Grid reveal (dispara 1x quando cards aparecem)
      const cards = document.querySelectorAll('.produtos-grid .produto-card');
      if (cards.length > 0 && !document.querySelector('.produtos-grid').dataset.revealDone) {
        document.querySelector('.produtos-grid').dataset.revealDone = '1';
        gsap.to(cards, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.produtos-grid', start: 'top 85%', once: true }
        });
      }
    });

    const grid = document.getElementById('produtosGrid');
    if (grid) observer.observe(grid, { childList: true });
  }
```

Adicionar chamada `initCatalogo()` em `initAnimations()`.

- [ ] **Passo 3: Adicionar fade na troca de tabs em `products.js`**

Dentro da função `filterProducts`, envolver a lógica existente com um fade:

```js
  function filterProducts(categoriaId) {
    const grid = document.getElementById('produtosGrid');
    const cards = document.querySelectorAll('#produtosGrid .produto-card');

    // Fade out → filtra → fade in
    gsap.to(Array.from(cards).filter(c => !c.classList.contains('hidden')), {
      opacity: 0, y: 10, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        cards.forEach(card => {
          const matches = categoriaId === 'todos' || card.dataset.categoria === categoriaId;
          card.classList.toggle('hidden', !matches);
          card.style.opacity = '';
          card.style.transform = '';
        });
        const visible = document.querySelectorAll('#produtosGrid .produto-card:not(.hidden)');
        gsap.fromTo(visible,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
        );
      }
    });
  }
```

> Nota: este código usa `gsap` global. Como `products.js` é carregado com `defer` antes de `animations.js`, o `gsap` pode não estar disponível na primeira execução. Adicionar guard:

```js
  function filterProducts(categoriaId) {
    const cards = document.querySelectorAll('#produtosGrid .produto-card');

    if (typeof gsap === 'undefined') {
      // Fallback sem animação
      cards.forEach(card => {
        const matches = categoriaId === 'todos' || card.dataset.categoria === categoriaId;
        card.classList.toggle('hidden', !matches);
      });
      return;
    }

    gsap.to(Array.from(cards).filter(c => !c.classList.contains('hidden')), {
      opacity: 0, y: 8, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        cards.forEach(card => {
          const matches = categoriaId === 'todos' || card.dataset.categoria === categoriaId;
          card.classList.toggle('hidden', !matches);
          card.style.opacity = '';
          card.style.transform = '';
        });
        const visible = document.querySelectorAll('#produtosGrid .produto-card:not(.hidden)');
        gsap.fromTo(visible,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
        );
      }
    });
  }
```

- [ ] **Passo 4: Verificar**

Na seção catálogo: passar o mouse nos cards — círculo de luz azul sutil deve seguir o cursor. Trocar de tab — os cards devem fazer fade out/in. Rolar até o catálogo pela primeira vez — cards devem aparecer em stagger.

- [ ] **Passo 5: Commit**

```bash
git add assets/css/animations.css assets/js/animations.js assets/js/products.js
git commit -m "feat(catalogo): spotlight nos cards + grid reveal ScrollTrigger + tab fade"
```

---

## Task 15: Galeria — stagger direcional + parallax

**Files:**
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Adicionar `initGaleria` em `animations.js`**

```js
  function initGaleria() {
    const items = gsap.utils.toArray('.galeria-item');
    if (items.length === 0) return;

    // Stagger com direção alternada (ímpares da esquerda, pares da direita)
    items.forEach((item, i) => {
      const fromX = i % 2 === 0 ? -30 : 30;
      gsap.from(item, {
        opacity: 0, x: fromX, scale: 0.95,
        duration: 0.65, ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          once: true
        }
      });

      // Parallax leve na imagem dentro do item
      const img = item.querySelector('img');
      if (img) {
        gsap.to(img, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      }
    });

    // Header da galeria
    gsap.from('.galeria-header .section-label', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.galeria-header', start: 'top 80%' }
    });
    gsap.from('.galeria-header .section-title, .galeria-header .section-subtitle', {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.galeria-header', start: 'top 75%' }
    });
    gsap.from('.galeria-footer', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.galeria-footer', start: 'top 90%' }
    });
  }
```

Adicionar chamada `initGaleria()` em `initAnimations()`.

- [ ] **Passo 2: Verificar**

Rolar até a galeria. Os 6 itens devem entrar alternando da esquerda/direita. Ao continuar rolando, as imagens dentro de cada item devem ter um leve parallax vertical.

- [ ] **Passo 3: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat(galeria): stagger direcional alternado + parallax nas imagens"
```

---

## Task 16: Performance — prefers-reduced-motion + invalidateOnRefresh

**Files:**
- Modify: `assets/js/animations.js`

- [ ] **Passo 1: Envolver animações em prefers-reduced-motion check**

No topo de `initAnimations()`, adicionar o guard:

```js
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Acessibilidade: desativar animações se o usuário preferir
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Mostrar tudo imediatamente, sem animação
      gsap.set('.hero .section-label, .hero .hero-subtitle, .hero .hero-ctas, .hero-line span', {
        clearProps: 'all'
      });
      gsap.set('#heroProducts .hero-card', { opacity: 1, scale: 1 });
      // Inicializar apenas Lenis e cursor (não dependem de animação)
      initLenis();
      initCursor();
      initTrustMarquee();
      return;
    }

    initLenis();
    initCursor();
    initAurora();
    initHeroTimeline();
    initHeroCardsListener();
    initMouseParallax();
    initMagneticButtons();
    initTrustMarquee();
    initTrustCounter();
    initSectionReveals();
    initPassosPin();
    initCatalogo();
    initGaleria();
  }
```

- [ ] **Passo 2: Adicionar `invalidateOnRefresh` nos ScrollTriggers do pin**

Em `initPassosPin()`, na configuração do `scrollTrigger`, confirmar que `invalidateOnRefresh: true` está presente (já está no código da Task 13).

- [ ] **Passo 3: Verificar acessibilidade**

No Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Recarregar: todo o conteúdo deve aparecer instantaneamente, sem animações, mas o site deve ser 100% funcional.

- [ ] **Passo 4: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat(animations): prefers-reduced-motion support + accessibility cleanup"
```

---

## Checklist de verificação final

Depois de todas as tasks, testar a página completa:

- [ ] Console sem erros em `http://localhost:5500`
- [ ] Scroll suave (Lenis) em toda a página
- [ ] Cursor customizado aparece no desktop, cursor padrão em touch devices
- [ ] Hero: animação de entrada completa (label → h1 linhas → subtitle → CTAs → cards)
- [ ] Hero: blobs aurora respirando
- [ ] Hero: gradient animado em "impressas em 3D"
- [ ] Hero: cards flutuando após entrada
- [ ] Hero: tilt 3D + spotlight ao passar mouse nos cards
- [ ] Hero: parallax ao mover mouse pela seção
- [ ] Hero: botões atraem levemente o cursor
- [ ] Hero: border beam girando no "Ver catálogo"
- [ ] Trust strip: marquee infinito, pausa no hover, counter conta até +500
- [ ] Sobre: feature cards em stagger ao scroll
- [ ] "4 Passos": pin + steps sequenciais no desktop, stagger no mobile
- [ ] Catálogo: spotlight nos cards, fade na troca de tabs, grid reveal
- [ ] Galeria: entrada alternada esquerda/direita, parallax nas imagens
- [ ] Contato: stagger diagonal
- [ ] Footer: colunas em stagger
- [ ] `prefers-reduced-motion`: sem animações, conteúdo visível

- [ ] **Commit final**

```bash
git add -A
git commit -m "feat: Rivia Print Full Visual Overhaul — GSAP + Lenis + Inspira UI effects"
```
