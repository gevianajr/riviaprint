# Vitrine Rivia Print — Plano de Implementação

> **Para executores:** Use a sub-skill `superpowers:subagent-driven-development` (recomendada) ou `superpowers:executing-plans` para implementar este plano tarefa-a-tarefa. Os passos usam checkbox (`- [ ]`) para tracking.

**Goal:** Construir a vitrine institucional single-page da Rivia Print em HTML/CSS/JS vanilla, fazer deploy no GitHub Pages com domínio `riviaprint.com.br`.

**Architecture:** Site estático sem build step. HTML semântico, CSS com design tokens via custom properties, JavaScript vanilla com dois módulos (`main.js` para UI, `products.js` para catálogo dinâmico via `data/products.json`). Deploy direto do branch `main` no GitHub Pages.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flex), JavaScript vanilla (ES6+, fetch, IntersectionObserver), Google Fonts (Inter), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-04-vitrine-rivia-print-design.md`

**Como validar cada tarefa:** Como o site é estático, "teste" significa abrir `index.html` no navegador (ou rodar `python -m http.server 8000` na raiz) e validar visualmente o que foi pedido. Console do navegador deve estar **sem erros** ao final de cada tarefa.

---

## Task 1: Foundation — arquivos base do projeto

**Files:**
- Create: `README.md`
- Create: `CNAME`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `404.html`

- [ ] **Step 1: Criar `README.md`**

```markdown
# Rivia Print — Vitrine

Site institucional da Rivia Print, marca de impressão 3D sob encomenda.

🌐 **Produção:** https://riviaprint.com.br
📸 **Instagram:** [@riviaprint](https://www.instagram.com/riviaprint/)

## Stack

Site estático: HTML + CSS + JavaScript vanilla. Sem build step, sem dependências.

## Estrutura

- `index.html` — página única
- `assets/css/` — estilos (reset, variáveis, principal)
- `assets/js/` — scripts (main.js, products.js)
- `assets/images/` — fotos e logo
- `data/products.json` — catálogo (editar este arquivo para adicionar/remover produtos)

## Como editar o catálogo

1. Edite `data/products.json` adicionando/removendo entradas em `produtos[]`
2. Coloque a foto do produto em `assets/images/products/`
3. `git add . && git commit -m "feat: novo produto X" && git push`
4. GitHub Pages redeploya automaticamente em ~1min

## Como rodar localmente

```bash
python -m http.server 8000
# Abra http://localhost:8000
```

## Deploy

Automático via GitHub Pages no push para `main`.

---

© 2026 Rivia Print
```

- [ ] **Step 2: Criar `CNAME`**

```
riviaprint.com.br
```

- [ ] **Step 3: Criar `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://riviaprint.com.br/sitemap.xml
```

- [ ] **Step 4: Criar `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://riviaprint.com.br/</loc>
    <lastmod>2026-05-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 5: Criar `404.html`** (página de erro custom, simples e na identidade visual)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página não encontrada — Rivia Print</title>
  <link rel="stylesheet" href="/assets/css/reset.css">
  <link rel="stylesheet" href="/assets/css/variables.css">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px">
  <div>
    <h1 style="font-size:96px;margin:0;color:var(--color-brand)">404</h1>
    <p style="font-size:20px;margin:16px 0 8px">Essa página fugiu da impressora 3D.</p>
    <p style="color:var(--color-text-muted);margin:0 0 32px">A página que você procurou não existe ou foi movida.</p>
    <a href="/" style="display:inline-block;background:var(--color-text);color:#fff;padding:14px 28px;border-radius:var(--radius-pill);text-decoration:none;font-weight:600">← Voltar pra home</a>
  </div>
</body>
</html>
```

- [ ] **Step 6: Validar e commitar**

```bash
ls -la
# Deve mostrar: README.md, CNAME, robots.txt, sitemap.xml, 404.html

git add README.md CNAME robots.txt sitemap.xml 404.html
git commit -m "feat: arquivos base do projeto (README, CNAME, robots, sitemap, 404)"
```

---

## Task 2: CSS Foundation — reset e design tokens

**Files:**
- Create: `assets/css/reset.css`
- Create: `assets/css/variables.css`

- [ ] **Step 1: Criar pasta `assets/css/`**

```bash
mkdir -p assets/css
```

- [ ] **Step 2: Criar `assets/css/reset.css`** (modern CSS reset baseado em Andy Bell)

```css
/* Modern CSS Reset */
*, *::before, *::after { box-sizing: border-box; }

* { margin: 0; padding: 0; }

html { -webkit-text-size-adjust: 100%; }

body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select { font: inherit; color: inherit; }

p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

ul, ol { list-style: none; }

a { color: inherit; text-decoration: none; }

button {
  background: none;
  border: none;
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Criar `assets/css/variables.css`** (design tokens)

```css
:root {
  /* === CORES === */
  --color-bg:           #FFFFFF;
  --color-bg-soft:      #FAFAFA;
  --color-text:         #0A0A0A;
  --color-text-muted:   #666666;
  --color-border:       #F0F0F0;

  --color-brand:        #3886F7;
  --color-brand-soft:   #F4F7FF;

  --color-yellow-soft:  #FFFBE5;
  --color-yellow:       #FFD60A;
  --color-red-soft:     #FEEBED;
  --color-red:          #E63946;
  --color-green-soft:   #E5F8F0;
  --color-green:        #06D6A0;
  --color-blue-soft:    #EAF1FF;

  /* === TIPOGRAFIA === */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;

  --letter-tight: -1.5px;
  --letter-normal: 0;

  /* === ESPAÇAMENTO === */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 96px;

  /* === RAIOS === */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  /* === SOMBRAS === */
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);

  /* === TRANSIÇÕES === */
  --transition: all 0.25s ease;
  --transition-slow: all 0.4s ease;

  /* === LAYOUT === */
  --container-max: 1200px;
  --header-height: 72px;
}
```

- [ ] **Step 4: Validar**

Abrir `assets/css/variables.css` em qualquer editor e conferir que está formatado. Não há ainda como validar visualmente — segue pra próxima.

- [ ] **Step 5: Commitar**

```bash
git add assets/css/
git commit -m "feat(css): adicionar reset moderno e design tokens (variables)"
```

---

## Task 3: CSS — estilos base, tipografia, utilitários

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Criar `assets/css/style.css` com base global, tipografia, container e classes utilitárias**

```css
/* ========== BASE ========== */
body {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
  overflow-x: hidden;
}

/* ========== TIPOGRAFIA ========== */
h1, h2, h3, h4 {
  font-family: var(--font-family);
  letter-spacing: var(--letter-tight);
  line-height: 1.15;
  font-weight: 700;
}

h1 { font-size: clamp(36px, 6vw, 64px); line-height: 1.05; }
h2 { font-size: clamp(28px, 4vw, 42px); }
h3 { font-size: 20px; line-height: 1.3; font-weight: 600; letter-spacing: -0.5px; }
h4 { font-size: 16px; font-weight: 600; letter-spacing: 0; }

p { color: var(--color-text-muted); line-height: 1.6; }

a { transition: var(--transition); }

/* ========== LAYOUT ========== */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--space-lg); }
}

section {
  padding: var(--space-xl) 0;
}

@media (max-width: 640px) {
  section { padding: var(--space-lg) 0; }
}

/* ========== UTILITÁRIOS ========== */
.text-center { text-align: center; }
.text-muted { color: var(--color-text-muted); }
.text-brand { color: var(--color-brand); }

.section-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-brand-soft);
  color: var(--color-brand);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.section-label::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-brand);
  border-radius: 50%;
}

.section-title {
  margin-bottom: var(--space-md);
}

.section-subtitle {
  font-size: 18px;
  color: var(--color-text-muted);
  max-width: 640px;
  margin-bottom: var(--space-lg);
}

/* ========== BOTÕES ========== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 14px 24px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  border: 1.5px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-text);
  color: #fff;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-text);
}
.btn-secondary:hover {
  background: var(--color-text);
  color: #fff;
}

.btn-brand {
  background: var(--color-brand);
  color: #fff;
}
.btn-brand:hover {
  background: #2974e0;
  transform: translateY(-2px);
}

/* ========== ANIMAÇÕES ========== */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ========== FOCUS ACESSÍVEL ========== */
:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Commitar**

```bash
git add assets/css/style.css
git commit -m "feat(css): estilos base, tipografia, container, botoes e utilitarios"
```

---

## Task 4: HTML skeleton + `<head>` completo (SEO, OG, JSON-LD, fontes)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Criar `index.html` com skeleton completo**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3886F7">

  <title>Rivia Print — Impressão 3D sob medida no Brasil</title>
  <meta name="description" content="Vitrine da Rivia Print: impressão 3D de qualidade sob encomenda. Articulados, colecionáveis Copa 2026, personalizados e mais. Encomende pelo Instagram ou WhatsApp.">

  <link rel="canonical" href="https://riviaprint.com.br/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://riviaprint.com.br/">
  <meta property="og:title" content="Rivia Print — Impressão 3D sob medida">
  <meta property="og:description" content="Vitrine da Rivia Print: impressão 3D de qualidade sob encomenda. Articulados, colecionáveis e personalizados.">
  <meta property="og:image" content="https://riviaprint.com.br/assets/images/og-image.jpg">
  <meta property="og:locale" content="pt_BR">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Rivia Print — Impressão 3D sob medida">
  <meta name="twitter:description" content="Vitrine da Rivia Print: impressão 3D de qualidade sob encomenda.">
  <meta name="twitter:image" content="https://riviaprint.com.br/assets/images/og-image.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/images/logo.svg">
  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">

  <!-- Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">

  <!-- CSS -->
  <link rel="stylesheet" href="/assets/css/reset.css">
  <link rel="stylesheet" href="/assets/css/variables.css">
  <link rel="stylesheet" href="/assets/css/style.css">

  <!-- JSON-LD: LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Rivia Print",
    "url": "https://riviaprint.com.br",
    "image": "https://riviaprint.com.br/assets/images/og-image.jpg",
    "telephone": "+5514982276178",
    "email": "contato@riviaprint.com.br",
    "sameAs": ["https://www.instagram.com/riviaprint/"],
    "areaServed": "BR",
    "description": "Impressão 3D sob encomenda no Brasil. Articulados, colecionáveis, personalizados."
  }
  </script>
</head>
<body>
  <!-- HEADER -->
  <!-- (próxima task) -->

  <!-- MAIN -->
  <main>
    <!-- Seções aqui -->
  </main>

  <!-- FOOTER -->
  <!-- (próxima task) -->

  <!-- WhatsApp flutuante -->
  <!-- (próxima task) -->

  <!-- SCRIPTS -->
  <script src="/assets/js/main.js" defer></script>
  <script src="/assets/js/products.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Validar abrindo no navegador**

```bash
python -m http.server 8000
# Abrir http://localhost:8000
```

Esperado: página em branco (corpo vazio), título correto na aba, **zero erros no console** (F12), fonte Inter carregando (Network tab).

- [ ] **Step 3: Commitar**

```bash
git add index.html
git commit -m "feat(html): index skeleton com SEO, OG tags, JSON-LD e carregamento de fontes"
```

---

## Task 5: Header e navegação (sticky + menu mobile)

**Files:**
- Modify: `index.html` (adicionar `<header>`)
- Modify: `assets/css/style.css` (adicionar estilos do header)

- [ ] **Step 1: Adicionar `<header>` em `index.html` (logo após `<body>`, antes de `<main>`)**

```html
  <!-- HEADER -->
  <header class="header" id="header">
    <div class="container header-inner">
      <a href="#home" class="logo" aria-label="Rivia Print - Início">
        <span class="logo-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#0A0A0A"/>
            <path d="M9 9 L17 14 L9 19 Z" fill="#3886F7"/>
          </svg>
        </span>
        <span class="logo-text">RIVIA<span class="logo-text-light">PRINT</span></span>
      </a>

      <nav class="nav" id="nav" aria-label="Navegação principal">
        <ul class="nav-list">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#galeria">Galeria</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>

      <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="btn btn-primary header-cta">
        Encomende →
      </a>

      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
```

- [ ] **Step 2: Adicionar estilos do header em `assets/css/style.css` (no final do arquivo)**

```css
/* ========== HEADER ========== */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: var(--transition);
}

.header.scrolled {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  gap: var(--space-md);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
}

.logo-text {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.5px;
}
.logo-text-light {
  color: var(--color-text-muted);
  font-weight: 400;
  margin-left: 4px;
}

.nav-list {
  display: flex;
  gap: 28px;
  font-size: 14px;
  font-weight: 500;
}
.nav-list a {
  color: var(--color-text-muted);
}
.nav-list a:hover {
  color: var(--color-text);
}

.header-cta {
  padding: 10px 20px;
  font-size: 13px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}
.menu-toggle span {
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: var(--transition);
}

/* Mobile */
@media (max-width: 768px) {
  .nav {
    position: fixed;
    inset: var(--header-height) 0 0 0;
    background: var(--color-bg);
    padding: var(--space-lg) var(--space-md);
    transform: translateX(100%);
    transition: var(--transition);
  }
  .nav.open {
    transform: translateX(0);
  }
  .nav-list {
    flex-direction: column;
    gap: var(--space-md);
    font-size: 24px;
  }
  .nav-list a {
    color: var(--color-text);
    font-weight: 600;
  }
  .menu-toggle {
    display: flex;
  }
  .menu-toggle.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .menu-toggle.open span:nth-child(2) { opacity: 0; }
  .menu-toggle.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  .header-cta {
    display: none;
  }
}
```

- [ ] **Step 3: Validar no navegador**

Abrir `http://localhost:8000`. Esperado:
- Header fixo no topo com logo à esquerda, links no centro, botão "Encomende" à direita
- Em mobile (DevTools, modo responsivo, < 768px): logo + hambúrguer; clicar no hambúrguer **ainda não funciona** (sem JS por enquanto)
- Console sem erros

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(header): nav sticky com logo, menu desktop e estrutura mobile"
```

---

## Task 6: Hero section

**Files:**
- Modify: `index.html` (adicionar `<section id="home">`)
- Modify: `assets/css/style.css` (estilos do hero)

- [ ] **Step 1: Adicionar Hero em `index.html` (dentro de `<main>`)**

```html
    <!-- HERO -->
    <section id="home" class="hero">
      <div class="container hero-grid">
        <div class="hero-content reveal">
          <span class="section-label">Impressão 3D sob medida</span>
          <h1>
            Suas ideias,<br>
            <span class="text-brand">impressas em 3D</span><br>
            com capricho.
          </h1>
          <p class="hero-subtitle">
            Da peça personalizada ao colecionável. Articulados, decorativos, presentes únicos — feitos com qualidade, cor e prazo que você confia.
          </p>
          <div class="hero-ctas">
            <a href="#produtos" class="btn btn-primary">Ver catálogo</a>
            <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="btn btn-secondary">Falar no Instagram</a>
          </div>
        </div>

        <div class="hero-products reveal" id="heroProducts">
          <!-- Renderizado por products.js a partir dos produtos com destaque:true -->
          <!-- Placeholder enquanto JS não roda: -->
          <div class="hero-card hero-card--yellow">🐙</div>
          <div class="hero-card hero-card--red">🐙</div>
          <div class="hero-card hero-card--green">🐙</div>
          <div class="hero-card hero-card--blue">⚽</div>
        </div>

        <!-- Bolinhas decorativas -->
        <span class="deco deco-1" aria-hidden="true"></span>
        <span class="deco deco-2" aria-hidden="true"></span>
        <span class="deco deco-3" aria-hidden="true"></span>
      </div>

      <!-- Faixa de confiança -->
      <div class="trust-strip">
        <div class="container trust-strip-inner">
          <span>✓ Entrega em todo Brasil</span>
          <span>✓ +500 peças impressas</span>
          <span>✓ Personalização sob demanda</span>
          <span>✓ Materiais de qualidade</span>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos do hero em `style.css` (no final)**

```css
/* ========== HERO ========== */
.hero {
  position: relative;
  padding-top: var(--space-lg);
  padding-bottom: 0;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  align-items: center;
  position: relative;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.1fr 1fr;
    gap: var(--space-xl);
  }
}

.hero-subtitle {
  font-size: clamp(16px, 1.5vw, 18px);
  margin: var(--space-md) 0 var(--space-lg);
  max-width: 480px;
}

.hero-ctas {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.hero-products {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  position: relative;
}

.hero-card {
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  overflow: hidden;
  transition: var(--transition);
}
.hero-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.hero-card--yellow { background: var(--color-yellow-soft); transform: rotate(-3deg); }
.hero-card--red    { background: var(--color-red-soft); transform: rotate(2deg); margin-top: 24px; }
.hero-card--green  { background: var(--color-green-soft); transform: rotate(4deg); margin-top: -12px; }
.hero-card--blue   { background: var(--color-blue-soft); transform: rotate(-2deg); }

.hero-card img { width: 100%; height: 100%; object-fit: contain; padding: 16px; }

/* Bolinhas decorativas */
.deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}
.deco-1 { top: 10%; right: 30%; width: 14px; height: 14px; background: var(--color-yellow); }
.deco-2 { bottom: 15%; left: 42%; width: 8px; height: 8px; background: var(--color-red); }
.deco-3 { top: 60%; left: 5%; width: 6px; height: 6px; background: var(--color-green); }

/* Trust strip */
.trust-strip {
  background: var(--color-bg-soft);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-sm) 0;
  margin-top: var(--space-lg);
}
.trust-strip-inner {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: var(--space-md);
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
}
@media (max-width: 640px) {
  .trust-strip-inner { justify-content: flex-start; }
}
```

- [ ] **Step 3: Validar no navegador**

Refresh `http://localhost:8000`. Esperado:
- Hero ocupa a tela com título grande à esquerda, grid 2x2 de cards coloridos à direita (em desktop)
- Em mobile: empilha (texto em cima, cards embaixo)
- Bolinhas decorativas aparecem
- Faixa de confiança no rodapé do hero
- Console sem erros

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(hero): secao hero com titulo, CTAs, grid de produtos e trust strip"
```

---

## Task 7: Sobre nós section

**Files:**
- Modify: `index.html` (adicionar `<section id="sobre">`)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar Sobre em `index.html` (após o Hero)**

```html
    <!-- SOBRE -->
    <section id="sobre" class="sobre">
      <div class="container">
        <div class="sobre-header reveal">
          <span class="section-label">Quem somos</span>
          <h2 class="section-title">Quem é a Rivia Print</h2>
          <p class="section-subtitle">
            Somos uma marca brasileira de impressão 3D que transforma ideias em peças reais. Da brincadeira ao presente especial, cada item é impresso com atenção aos detalhes, cor vibrante e acabamento caprichado.
          </p>
        </div>

        <div class="features">
          <div class="feature reveal">
            <div class="feature-icon">🎯</div>
            <h3>Qualidade premium</h3>
            <p>Materiais resistentes e acabamento impecável em cada peça.</p>
          </div>
          <div class="feature reveal">
            <div class="feature-icon">⚡</div>
            <h3>Prazo combinado</h3>
            <p>Você sabe quando recebe, sempre. Sem surpresa.</p>
          </div>
          <div class="feature reveal">
            <div class="feature-icon">🎨</div>
            <h3>Personalizamos</h3>
            <p>Cor, tamanho e design adaptados ao que você quer.</p>
          </div>
          <div class="feature reveal">
            <div class="feature-icon">🇧🇷</div>
            <h3>Feito no Brasil</h3>
            <p>Produção nacional, com carinho e atenção ao detalhe.</p>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos em `style.css`**

```css
/* ========== SOBRE ========== */
.sobre {
  background: var(--color-bg);
}

.sobre-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto var(--space-lg);
}
.sobre-header .section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .features { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .features { grid-template-columns: repeat(4, 1fr); }
}

.feature {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: var(--transition);
}
.feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: var(--space-sm);
}

.feature h3 {
  margin-bottom: var(--space-xs);
}

.feature p {
  font-size: 14px;
}
```

- [ ] **Step 3: Validar**

Refresh. Esperado: seção Sobre logo após Hero, com 4 cards de diferenciais em grid (4 colunas desktop, 2 tablet, 1 mobile). Hover eleva os cards. Console sem erros.

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(sobre): secao sobre com 4 diferenciais em grid"
```

---

## Task 8: Catálogo — estrutura HTML, tabs e grid de cards (CSS)

**Files:**
- Modify: `index.html` (adicionar `<section id="produtos">`)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar seção Catálogo em `index.html`**

```html
    <!-- CATÁLOGO -->
    <section id="produtos" class="catalogo">
      <div class="container">
        <div class="catalogo-header reveal">
          <span class="section-label">Nosso catálogo</span>
          <h2 class="section-title">Explore nossas linhas</h2>
          <p class="section-subtitle">Toque em uma categoria para filtrar.</p>
        </div>

        <!-- Tabs renderizadas por products.js -->
        <div class="catalogo-tabs" id="catalogoTabs" role="tablist" aria-label="Categorias de produtos">
          <!-- Ex.: <button class="tab active" data-categoria="todos" role="tab">Todos</button> -->
        </div>

        <!-- Grid de produtos renderizado por products.js -->
        <div class="produtos-grid" id="produtosGrid" aria-live="polite">
          <!-- Ex.: <article class="produto-card">...</article> -->
        </div>

        <!-- Estado de loading inicial -->
        <p class="catalogo-loading" id="catalogoLoading">Carregando produtos...</p>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos em `style.css`**

```css
/* ========== CATÁLOGO ========== */
.catalogo {
  background: var(--color-bg-soft);
}

.catalogo-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto var(--space-md);
}
.catalogo-header .section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

/* Tabs */
.catalogo-tabs {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--space-lg);
  padding: var(--space-xs);
}

@media (max-width: 768px) {
  .catalogo-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: var(--space-xs) var(--space-sm);
    margin-left: calc(var(--space-md) * -1);
    margin-right: calc(var(--space-md) * -1);
  }
}

.tab {
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}
.tab:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}
.tab.active {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
  font-weight: 600;
}

/* Grid de produtos */
.produtos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}
@media (min-width: 640px) {
  .produtos-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .produtos-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Card de produto */
.produto-card {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  border: 1px solid var(--color-border);
}
.produto-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}

.produto-card-img {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 64px;
}
.produto-card-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-md);
}

/* Cores de fundo do card por categoria */
.produto-card[data-cor="yellow"] .produto-card-img { background: var(--color-yellow-soft); }
.produto-card[data-cor="red"]    .produto-card-img { background: var(--color-red-soft); }
.produto-card[data-cor="green"]  .produto-card-img { background: var(--color-green-soft); }
.produto-card[data-cor="blue"]   .produto-card-img { background: var(--color-blue-soft); }

.produto-card-body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.produto-card-nome {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.produto-card-preco {
  color: var(--color-brand);
  font-size: 14px;
  font-weight: 600;
}

.produto-card-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  flex: 1;
}

.produto-card-cta {
  margin-top: var(--space-sm);
  padding: 10px 16px;
  font-size: 13px;
  align-self: flex-start;
}

.catalogo-loading {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-xl) 0;
}

.produto-card.hidden { display: none; }
```

- [ ] **Step 3: Validar**

Refresh. Esperado: seção "Nosso catálogo" aparece com fundo cinza claro. Tabs e grid estão vazios mas o título "Carregando produtos..." aparece. Console sem erros.

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(catalogo): estrutura HTML e CSS para tabs e grid de produtos"
```

---

## Task 9: `products.json` + `products.js` (renderização dinâmica do catálogo)

**Files:**
- Create: `data/products.json`
- Create: `assets/js/products.js`

- [ ] **Step 1: Criar pasta `data/` e arquivo `products.json`** (com pelo menos 1-2 produtos por categoria como seed)

```bash
mkdir -p data assets/js
```

```json
{
  "categorias": [
    { "id": "articulados",    "nome": "Articulados",      "cor": "yellow" },
    { "id": "copa",           "nome": "Linha Copa 2026",  "cor": "green" },
    { "id": "personalizados", "nome": "Personalizados",   "cor": "blue" },
    { "id": "decoracao",      "nome": "Decoração",        "cor": "red" },
    { "id": "popculture",     "nome": "Pop Culture",      "cor": "blue" },
    { "id": "chaveiros",      "nome": "Chaveiros",        "cor": "yellow" }
  ],
  "produtos": [
    {
      "id": "polvo-amarelo",
      "nome": "Polvo Articulado Amarelo",
      "categoria": "articulados",
      "preco": "A consultar",
      "imagem": "assets/images/products/polvo-amarelo.jpg",
      "emoji": "🐙",
      "destaque": true,
      "descricao": "Polvo flexível impresso em 3D, ideal como fidget toy ou decoração."
    },
    {
      "id": "polvo-vermelho",
      "nome": "Polvo Articulado Vermelho",
      "categoria": "articulados",
      "preco": "A consultar",
      "imagem": "assets/images/products/polvo-vermelho.jpg",
      "emoji": "🐙",
      "destaque": true,
      "descricao": "Versão vermelha glitter, com pontas pretas. Pura diversão."
    },
    {
      "id": "polvo-verde",
      "nome": "Polvo Articulado Verde",
      "categoria": "articulados",
      "preco": "A consultar",
      "imagem": "assets/images/products/polvo-verde.jpg",
      "emoji": "🐙",
      "destaque": true,
      "descricao": "Versão verde brilhante. Cabe na mão e na decoração."
    },
    {
      "id": "caixinha-copa-vermelha",
      "nome": "Caixinha Figurinhas Copa 2026 — Vermelha",
      "categoria": "copa",
      "preco": "R$ 35,00",
      "imagem": "assets/images/products/caixinha-copa-vermelha.jpg",
      "emoji": "⚽",
      "destaque": true,
      "descricao": "Caixinha 3D resistente para colecionar suas figurinhas da Copa do Mundo 2026."
    },
    {
      "id": "caixinha-copa-azul",
      "nome": "Caixinha Figurinhas Copa 2026 — Azul",
      "categoria": "copa",
      "preco": "R$ 35,00",
      "imagem": "assets/images/products/caixinha-copa-azul.jpg",
      "emoji": "⚽",
      "destaque": false,
      "descricao": "Versão azul. Várias cores disponíveis sob encomenda."
    },
    {
      "id": "personalizado-exemplo",
      "nome": "Peça Personalizada (sob encomenda)",
      "categoria": "personalizados",
      "preco": "Orçamento",
      "imagem": "assets/images/products/personalizado-exemplo.jpg",
      "emoji": "🎁",
      "destaque": false,
      "descricao": "Tem uma ideia? Mandamos um orçamento. Logos, presentes, peças únicas."
    },
    {
      "id": "vaso-decorativo",
      "nome": "Vaso Decorativo Geométrico",
      "categoria": "decoracao",
      "preco": "A consultar",
      "imagem": "assets/images/products/vaso-decorativo.jpg",
      "emoji": "🏺",
      "destaque": false,
      "descricao": "Vaso com padrão geométrico moderno. Várias cores."
    },
    {
      "id": "popculture-exemplo",
      "nome": "Figura Pop Culture (sob encomenda)",
      "categoria": "popculture",
      "preco": "Orçamento",
      "imagem": "assets/images/products/popculture-exemplo.jpg",
      "emoji": "🎲",
      "destaque": false,
      "descricao": "Animes, jogos, super-heróis. Solicite o personagem que você quer."
    },
    {
      "id": "chaveiro-exemplo",
      "nome": "Chaveiro Personalizado",
      "categoria": "chaveiros",
      "preco": "A partir de R$ 15,00",
      "imagem": "assets/images/products/chaveiro-exemplo.jpg",
      "emoji": "🔑",
      "destaque": false,
      "descricao": "Chaveiro com nome, logo ou símbolo do seu time. Várias cores."
    }
  ]
}
```

- [ ] **Step 2: Criar `assets/js/products.js`**

```javascript
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5514982276178';
  const DATA_URL = 'data/products.json';

  /**
   * Constrói URL do WhatsApp com mensagem pré-preenchida.
   * @param {string} produtoNome - Nome do produto (ou string vazia para mensagem genérica).
   * @returns {string} URL completa do WhatsApp.
   */
  function buildWhatsAppLink(produtoNome) {
    const baseMsg = produtoNome
      ? `Olá! Tenho interesse no produto: *${produtoNome}*`
      : 'Olá! Gostaria de fazer uma encomenda na Rivia Print.';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(baseMsg)}`;
  }

  /**
   * Renderiza tabs de categorias na seção #produtos.
   * @param {Array} categorias
   */
  function renderTabs(categorias) {
    const container = document.getElementById('catalogoTabs');
    if (!container) return;

    const tabs = [
      `<button class="tab active" data-categoria="todos" role="tab" aria-selected="true">Todos</button>`,
      ...categorias.map(c =>
        `<button class="tab" data-categoria="${c.id}" role="tab" aria-selected="false">${c.nome}</button>`
      )
    ];
    container.innerHTML = tabs.join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      const cat = btn.dataset.categoria;
      container.querySelectorAll('.tab').forEach(t => {
        const active = t === btn;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      filterProducts(cat);
    });
  }

  /**
   * Filtra cards do catálogo pela categoria.
   * @param {string} categoriaId - 'todos' mostra todos.
   */
  function filterProducts(categoriaId) {
    const cards = document.querySelectorAll('#produtosGrid .produto-card');
    cards.forEach(card => {
      const matches = categoriaId === 'todos' || card.dataset.categoria === categoriaId;
      card.classList.toggle('hidden', !matches);
    });
  }

  /**
   * Renderiza grid de produtos.
   * @param {Array} produtos
   * @param {Object} corPorCategoria - mapa { categoriaId: corHex }
   */
  function renderProducts(produtos, corPorCategoria) {
    const container = document.getElementById('produtosGrid');
    const loading = document.getElementById('catalogoLoading');
    if (!container) return;

    container.innerHTML = produtos.map(p => {
      const cor = corPorCategoria[p.categoria] || 'blue';
      const link = buildWhatsAppLink(p.nome);
      const imgSrc = p.imagem;
      const fallbackEmoji = p.emoji || '📦';
      return `
        <article class="produto-card" data-categoria="${p.categoria}" data-cor="${cor}">
          <div class="produto-card-img">
            <img src="${imgSrc}" alt="${p.nome}" loading="lazy"
                 onerror="this.style.display='none';this.parentElement.innerHTML='<span aria-hidden=\\'true\\'>${fallbackEmoji}</span>';">
          </div>
          <div class="produto-card-body">
            <h3 class="produto-card-nome">${p.nome}</h3>
            <span class="produto-card-preco">${p.preco}</span>
            <p class="produto-card-desc">${p.descricao}</p>
            <a href="${link}" target="_blank" rel="noopener" class="btn btn-primary produto-card-cta"
               aria-label="Encomendar ${p.nome} pelo WhatsApp">
              Quero esse →
            </a>
          </div>
        </article>
      `;
    }).join('');

    if (loading) loading.style.display = 'none';
  }

  /**
   * Renderiza grid de destaques no Hero (até 4 produtos).
   * @param {Array} produtos
   * @param {Object} corPorCategoria
   */
  function renderHeroProducts(produtos, corPorCategoria) {
    const container = document.getElementById('heroProducts');
    if (!container) return;

    const destaques = produtos.filter(p => p.destaque).slice(0, 4);
    if (destaques.length === 0) return;

    const variants = ['hero-card--yellow', 'hero-card--red', 'hero-card--green', 'hero-card--blue'];

    container.innerHTML = destaques.map((p, i) => {
      const fallbackEmoji = p.emoji || '📦';
      return `
        <div class="hero-card ${variants[i]}" title="${p.nome}">
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy"
               onerror="this.style.display='none';this.parentElement.innerHTML='${fallbackEmoji}';">
        </div>
      `;
    }).join('');
  }

  /**
   * Carrega products.json e renderiza tudo.
   */
  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const corPorCategoria = {};
      data.categorias.forEach(c => { corPorCategoria[c.id] = c.cor; });

      renderTabs(data.categorias);
      renderProducts(data.produtos, corPorCategoria);
      renderHeroProducts(data.produtos, corPorCategoria);
    } catch (err) {
      console.error('[products.js] Erro ao carregar produtos:', err);
      const loading = document.getElementById('catalogoLoading');
      if (loading) loading.textContent = 'Não foi possível carregar os produtos. Tente recarregar a página.';
    }
  }

  // Expor utilitário global (usado por outros componentes, ex: WhatsApp flutuante)
  window.RiviaPrint = window.RiviaPrint || {};
  window.RiviaPrint.buildWhatsAppLink = buildWhatsAppLink;

  document.addEventListener('DOMContentLoaded', init);
})();
```

- [ ] **Step 3: Validar**

Refresh `http://localhost:8000`. Esperado:
- Tabs aparecem: "Todos | Articulados | Linha Copa 2026 | Personalizados | Decoração | Pop Culture | Chaveiros"
- Grid mostra 9 produtos (com emoji no lugar das fotos, já que não temos imagens ainda)
- Clicar em uma tab filtra os cards
- Hero também mostra 4 destaques (com emoji)
- Botão "Quero esse" abre WhatsApp em nova aba com mensagem certa
- Console sem erros (ok ter warning se imagens 404 — vamos resolver com placeholders depois)

- [ ] **Step 4: Commitar**

```bash
git add data/products.json assets/js/products.js
git commit -m "feat(catalogo): products.json com 9 produtos seed e renderizacao dinamica via products.js"
```

---

## Task 10: Como encomendar (4 passos)

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar seção "Como encomendar" em `index.html` (após Catálogo)**

```html
    <!-- COMO ENCOMENDAR -->
    <section id="como" class="como">
      <div class="container">
        <div class="como-header reveal">
          <span class="section-label">Encomendar é fácil</span>
          <h2 class="section-title">4 passos pra ter sua peça</h2>
        </div>

        <ol class="passos">
          <li class="passo reveal">
            <span class="passo-num">1</span>
            <h3>Escolha</h3>
            <p>Navegue pelo catálogo e veja o que mais combina com você.</p>
          </li>
          <li class="passo reveal">
            <span class="passo-num">2</span>
            <h3>Chame</h3>
            <p>Manda mensagem no DM do Instagram ou no WhatsApp.</p>
          </li>
          <li class="passo reveal">
            <span class="passo-num">3</span>
            <h3>Combinamos</h3>
            <p>Definimos cor, prazo e valor juntos. Sem pressão.</p>
          </li>
          <li class="passo reveal">
            <span class="passo-num">4</span>
            <h3>Receba</h3>
            <p>Produzimos com carinho e enviamos pra você. Pronto!</p>
          </li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos**

```css
/* ========== COMO ENCOMENDAR ========== */
.como {
  background: var(--color-bg);
}
.como-header {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.passos {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  counter-reset: passo;
}

@media (min-width: 768px) {
  .passos { grid-template-columns: repeat(4, 1fr); }
}

.passo {
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  position: relative;
  border: 1px solid var(--color-border);
}

.passo-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-brand);
  color: #fff;
  border-radius: 50%;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: var(--space-sm);
}

.passo h3 {
  margin-bottom: var(--space-xs);
}

.passo p {
  font-size: 14px;
}
```

- [ ] **Step 3: Validar**

Refresh. Esperado: 4 cards numerados (1 a 4) em linha (desktop) ou empilhados (mobile). Bolinhas azuis com o número. Console limpo.

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(como-encomendar): secao com 4 passos do processo de pedido"
```

---

## Task 11: Galeria

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar seção Galeria em `index.html`**

```html
    <!-- GALERIA -->
    <section id="galeria" class="galeria">
      <div class="container">
        <div class="galeria-header reveal">
          <span class="section-label">Portfólio</span>
          <h2 class="section-title">Veja nossos trabalhos</h2>
          <p class="section-subtitle">Algumas das peças que entregamos com carinho.</p>
        </div>

        <div class="galeria-grid">
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/01.jpg" alt="Polvo articulado amarelo" loading="lazy"
                 onerror="this.style.background='var(--color-yellow-soft)';this.alt='';">
          </a>
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/02.jpg" alt="Caixinha da Copa colorida" loading="lazy"
                 onerror="this.style.background='var(--color-green-soft)';this.alt='';">
          </a>
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/03.jpg" alt="Polvo articulado vermelho" loading="lazy"
                 onerror="this.style.background='var(--color-red-soft)';this.alt='';">
          </a>
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/04.jpg" alt="Vaso geométrico" loading="lazy"
                 onerror="this.style.background='var(--color-blue-soft)';this.alt='';">
          </a>
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/05.jpg" alt="Polvo articulado verde" loading="lazy"
                 onerror="this.style.background='var(--color-green-soft)';this.alt='';">
          </a>
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="galeria-item reveal">
            <img src="assets/images/gallery/06.jpg" alt="Personalizado sob encomenda" loading="lazy"
                 onerror="this.style.background='var(--color-yellow-soft)';this.alt='';">
          </a>
        </div>

        <div class="galeria-footer reveal">
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="btn btn-secondary">
            Ver mais no @riviaprint →
          </a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos**

```css
/* ========== GALERIA ========== */
.galeria {
  background: var(--color-bg-soft);
}
.galeria-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto var(--space-lg);
}
.galeria-header .section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

.galeria-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}
@media (min-width: 640px) {
  .galeria-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .galeria-grid { grid-template-columns: repeat(3, 1fr); }
}

.galeria-item {
  display: block;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  transition: var(--transition);
}
.galeria-item:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}
.galeria-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
  background: var(--color-bg);
}
.galeria-item:hover img {
  filter: brightness(0.92);
}

.galeria-footer {
  text-align: center;
  margin-top: var(--space-lg);
}
```

- [ ] **Step 3: Validar**

Refresh. Esperado: grid 3x2 (desktop) com placeholders coloridos (já que não há imagens). Hover faz zoom leve. Botão "Ver mais no @riviaprint" abaixo. Console pode mostrar warnings de 404 nas imagens (esperado).

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(galeria): grid 3x3 com placeholders coloridos e link para Instagram"
```

---

## Task 12: Contato (3 cards)

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar seção Contato**

```html
    <!-- CONTATO -->
    <section id="contato" class="contato">
      <div class="container">
        <div class="contato-header reveal">
          <span class="section-label">Vamos conversar?</span>
          <h2 class="section-title">Escolha seu canal favorito</h2>
          <p class="section-subtitle">Respondemos rápido em todos eles.</p>
        </div>

        <div class="contato-grid">
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" class="contato-card contato-card--insta reveal">
            <div class="contato-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <h3>Instagram</h3>
            <p>@riviaprint</p>
            <span class="contato-arrow">→</span>
          </a>

          <a href="https://wa.me/5514982276178?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20encomenda%20na%20Rivia%20Print." target="_blank" rel="noopener" class="contato-card contato-card--wpp reveal">
            <div class="contato-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3>WhatsApp</h3>
            <p>(14) 98227-6178</p>
            <span class="contato-arrow">→</span>
          </a>

          <a href="mailto:contato@riviaprint.com.br" class="contato-card contato-card--email reveal">
            <div class="contato-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3>E-mail</h3>
            <p>contato@riviaprint.com.br</p>
            <span class="contato-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Adicionar estilos**

```css
/* ========== CONTATO ========== */
.contato {
  background: var(--color-bg);
}
.contato-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto var(--space-lg);
}
.contato-header .section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

.contato-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}
@media (min-width: 768px) {
  .contato-grid { grid-template-columns: repeat(3, 1fr); }
}

.contato-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  position: relative;
  text-decoration: none;
  color: var(--color-text);
}
.contato-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}
.contato-card p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 14px;
}
.contato-card h3 {
  margin: 0;
}

.contato-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
}

.contato-card--insta .contato-icon {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #fff;
}
.contato-card--wpp .contato-icon {
  background: #25D366;
  color: #fff;
}
.contato-card--email .contato-icon {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.contato-arrow {
  position: absolute;
  bottom: var(--space-md);
  right: var(--space-md);
  font-size: 24px;
  color: var(--color-text-muted);
  transition: var(--transition);
}
.contato-card:hover .contato-arrow {
  transform: translateX(4px);
  color: var(--color-text);
}
```

- [ ] **Step 3: Validar**

Refresh. Esperado: 3 cards lado-a-lado (desktop) com ícones coloridos (Instagram gradiente, WhatsApp verde, e-mail azul claro). Cliques abrem cada canal corretamente. Console limpo.

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(contato): 3 cards de canais (Instagram, WhatsApp, e-mail)"
```

---

## Task 13: Footer + WhatsApp flutuante

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Adicionar Footer e botão flutuante (logo após `</main>`)**

```html
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="#home" class="logo" aria-label="Rivia Print - Início">
          <span class="logo-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#0A0A0A"/>
              <path d="M9 9 L17 14 L9 19 Z" fill="#3886F7"/>
            </svg>
          </span>
          <span class="logo-text">RIVIA<span class="logo-text-light">PRINT</span></span>
        </a>
        <p>Impressão 3D sob encomenda no Brasil.</p>
      </div>

      <div class="footer-links">
        <h4>Navegação</h4>
        <ul>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#galeria">Galeria</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </div>

      <div class="footer-contato">
        <h4>Contato</h4>
        <ul>
          <li><a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://wa.me/5514982276178" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:contato@riviaprint.com.br">contato@riviaprint.com.br</a></li>
        </ul>
      </div>

      <div class="footer-redes">
        <h4>Redes</h4>
        <div class="footer-icons">
          <a href="https://www.instagram.com/riviaprint/" target="_blank" rel="noopener" aria-label="Instagram da Rivia Print">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://wa.me/5514982276178" target="_blank" rel="noopener" aria-label="WhatsApp da Rivia Print">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>© 2026 Rivia Print · Feito com carinho 🩵</p>
      </div>
    </div>
  </footer>

  <!-- WhatsApp flutuante -->
  <a href="https://wa.me/5514982276178?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20encomenda%20na%20Rivia%20Print." target="_blank" rel="noopener" class="wpp-float" id="wppFloat" aria-label="Falar no WhatsApp">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
```

- [ ] **Step 2: Adicionar estilos**

```css
/* ========== FOOTER ========== */
.footer {
  background: #0A0A0A;
  color: #fff;
  padding-top: var(--space-xl);
  margin-top: var(--space-lg);
}
.footer .logo,
.footer h4 { color: #fff; }
.footer .logo-text-light { color: #999; }

.footer-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
}
@media (min-width: 768px) {
  .footer-inner { grid-template-columns: 2fr 1fr 1.5fr 1fr; }
}

.footer-brand p {
  color: #999;
  margin-top: var(--space-sm);
  font-size: 14px;
  max-width: 280px;
}

.footer h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: var(--space-sm);
  color: #999;
  font-weight: 600;
}

.footer ul { display: flex; flex-direction: column; gap: var(--space-xs); }
.footer ul a {
  color: #ddd;
  font-size: 14px;
  transition: var(--transition);
}
.footer ul a:hover { color: var(--color-brand); }

.footer-icons { display: flex; gap: var(--space-sm); }
.footer-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  transition: var(--transition);
}
.footer-icons a:hover {
  background: var(--color-brand);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: var(--space-md) 0;
}
.footer-bottom p {
  text-align: center;
  font-size: 13px;
  color: #777;
  margin: 0;
}

/* ========== WHATSAPP FLUTUANTE ========== */
.wpp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: #25D366;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  z-index: 99;
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  transition: var(--transition);
}
.wpp-float.visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.wpp-float:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 32px rgba(37, 211, 102, 0.5);
}
```

- [ ] **Step 3: Validar**

Refresh. Esperado: footer preto com 4 colunas em desktop, copyright na linha de baixo. WhatsApp flutuante **não aparece ainda** (vai aparecer só com o JS da próxima task). Console limpo.

- [ ] **Step 4: Commitar**

```bash
git add index.html assets/css/style.css
git commit -m "feat(footer): footer dark com 4 colunas e botao WhatsApp flutuante (oculto por padrao)"
```

---

## Task 14: `main.js` — interações UI (menu mobile, scroll, header dynamic, reveal, WhatsApp float)

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Criar `assets/js/main.js`**

```javascript
(function () {
  'use strict';

  /* ============================================================
   * MENU MOBILE
   * ============================================================ */
  function initMenuMobile() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fechar menu ao clicar em um link
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================================
   * SCROLL SUAVE PARA ÂNCORAS
   * ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
   * HEADER COM SOMBRA AO ROLAR
   * ============================================================ */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
      lastScrollY = window.scrollY;
    };

    update();
    window.addEventListener('scroll', () => {
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ============================================================
   * REVEAL ON SCROLL (IntersectionObserver)
   * ============================================================ */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
   * WHATSAPP FLUTUANTE (aparece após sair do hero)
   * ============================================================ */
  function initWppFloat() {
    const wpp = document.getElementById('wppFloat');
    const sobre = document.getElementById('sobre');
    if (!wpp || !sobre) return;

    if (!('IntersectionObserver' in window)) {
      wpp.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        wpp.classList.toggle('visible', entry.isIntersecting || window.scrollY > entry.target.offsetTop);
      });
    }, { threshold: 0 });

    observer.observe(sobre);

    // Fallback: sempre visível depois de scroll significativo
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) wpp.classList.add('visible');
    }, { passive: true });
  }

  /* ============================================================
   * BOOT
   * ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initSmoothScroll();
    initHeaderScroll();
    initReveal();
    initWppFloat();
  });
})();
```

- [ ] **Step 2: Validar tudo no navegador**

Refresh `http://localhost:8000`. Testar:
1. **Menu mobile** (DevTools < 768px): clicar no hambúrguer abre/fecha. ESC fecha. Clicar num link fecha e navega.
2. **Scroll suave**: clicar em "Sobre" no nav rola suavemente para a seção.
3. **Header sombra**: rolar a página → header ganha borda+sombra após 20px de scroll.
4. **Reveal animations**: cada seção aparece com fade+slide quando entra na viewport.
5. **WhatsApp flutuante**: aparece após rolar até a seção Sobre.
6. Console **sem erros**.

- [ ] **Step 3: Commitar**

```bash
git add assets/js/main.js
git commit -m "feat(js): main.js com menu mobile, scroll suave, header dinamico, reveal e WhatsApp float"
```

---

## Task 15: Logo SVG, favicon e placeholder Open Graph

**Files:**
- Create: `assets/images/logo.svg`
- Create: `assets/images/favicon.ico` (vamos usar um SVG inline + reutilizar o logo.svg como favicon principal)
- Create: `assets/images/og-image.svg` (placeholder até o cliente entregar a versão raster final)

- [ ] **Step 1: Criar pastas**

```bash
mkdir -p assets/images/products assets/images/gallery assets/images/hero assets/icons
```

- [ ] **Step 2: Criar `assets/images/logo.svg`** (versão simplificada da logo Rivia Print, baseada no que já está inline no header)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="64" height="64">
  <rect width="28" height="28" rx="8" fill="#0A0A0A"/>
  <path d="M9 9 L17 14 L9 19 Z" fill="#3886F7"/>
</svg>
```

- [ ] **Step 3: Criar `assets/images/og-image.svg`** (placeholder 1200x630 para Open Graph — pode ser substituído por imagem raster real depois)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <rect x="60" y="60" width="160" height="160" rx="32" fill="#0A0A0A"/>
  <path d="M115 105 L175 145 L115 185 Z" fill="#3886F7"/>
  <text x="60" y="340" font-family="Inter, sans-serif" font-size="84" font-weight="800" fill="#0A0A0A" letter-spacing="-3">RIVIA PRINT</text>
  <text x="60" y="400" font-family="Inter, sans-serif" font-size="36" font-weight="500" fill="#3886F7">Impressão 3D sob medida</text>
  <text x="60" y="460" font-family="Inter, sans-serif" font-size="28" font-weight="400" fill="#666666">Articulados · Colecionáveis · Personalizados</text>
  <circle cx="950" cy="200" r="120" fill="#FFFBE5"/>
  <circle cx="1080" cy="380" r="80" fill="#FEEBED"/>
  <circle cx="900" cy="450" r="100" fill="#E5F8F0"/>
  <text x="60" y="570" font-family="Inter, sans-serif" font-size="24" font-weight="600" fill="#0A0A0A">riviaprint.com.br · @riviaprint</text>
</svg>
```

- [ ] **Step 4: Atualizar `index.html` para usar o `og-image.svg`** (ou manter `og-image.jpg` como TODO no spec)

Editar as duas linhas em `<head>`:

```html
<meta property="og:image" content="https://riviaprint.com.br/assets/images/og-image.svg">
<meta name="twitter:image" content="https://riviaprint.com.br/assets/images/og-image.svg">
```

> **Nota:** Twitter/Facebook preferem JPG/PNG. O SVG funciona como fallback inicial. Pendência aberta no spec (item 12.3) — substituir por raster 1200x630 quando o cliente entregar.

- [ ] **Step 5: Criar `assets/images/products/.gitkeep` e `assets/images/gallery/.gitkeep`** (manter pastas no Git)

```bash
touch assets/images/products/.gitkeep assets/images/gallery/.gitkeep
```

- [ ] **Step 6: Validar**

Refresh. Esperado:
- Favicon aparece na aba do navegador (logo Rivia)
- Console sem erros (warnings 404 de fotos de produtos OK por enquanto — fallback emoji aparece)

- [ ] **Step 7: Commitar**

```bash
git add assets/images/ index.html
git commit -m "feat(assets): logo.svg, og-image.svg placeholder e estrutura de pastas de imagens"
```

---

## Task 16: Auditoria mobile + acessibilidade

**Files:**
- Modify: ajustes pontuais conforme achar problemas

- [ ] **Step 1: Auditoria visual mobile (DevTools)**

Abrir DevTools → Toggle device toolbar → testar em:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1280px+)

**Verificar em cada breakpoint:**
- [ ] Texto não vaza horizontalmente (sem scroll lateral)
- [ ] Imagens não estouram o container
- [ ] Botões têm área de toque mínima 44x44px
- [ ] Tipografia legível (hero não corta)
- [ ] Tabs do catálogo rolam horizontalmente em mobile
- [ ] Menu mobile cobre 100% da tela quando aberto
- [ ] WhatsApp flutuante não cobre conteúdo importante

Se achar problema, abrir o seletor `.classe { ... }` correspondente em `style.css` e ajustar.

- [ ] **Step 2: Auditoria de acessibilidade — navegação por teclado**

Fechar mouse, usar **só** Tab/Shift+Tab/Enter/Escape:
- [ ] Tab percorre todos os links do header em ordem lógica
- [ ] Foco azul visível em cada elemento focado
- [ ] Enter ativa botões e links corretamente
- [ ] Escape fecha o menu mobile
- [ ] Não fica nenhum elemento "preso" sem saída

- [ ] **Step 3: Auditoria de a11y — Lighthouse**

DevTools → Lighthouse → marcar **Accessibility** + **Mobile** → Generate report.

**Meta**: nota ≥ 95 em Accessibility.

Corrigir problemas comuns que aparecem:
- Imagens sem alt → adicionar `alt=""` ou alt descritivo
- Contraste insuficiente → ajustar cores em `variables.css`
- Headings fora de ordem → reordenar
- Touch targets pequenos → aumentar padding

- [ ] **Step 4: Validar com VoiceOver / NVDA (opcional mas recomendado)**

Se tiver Mac: Cmd+F5 ativa VoiceOver. Navegar pela página com Ctrl+Option+arrows. A leitura deve fazer sentido (logo é "Rivia Print início", botões dizem o que fazem, etc.).

- [ ] **Step 5: Commitar ajustes (se houver)**

```bash
git add .
git commit -m "fix(a11y): ajustes de responsividade mobile e acessibilidade pos-auditoria"
```

---

## Task 17: Auditoria de performance + SEO (Lighthouse)

**Files:**
- Modify: ajustes conforme necessário

- [ ] **Step 1: Rodar Lighthouse completo**

DevTools → Lighthouse → marcar **Performance, Accessibility, Best Practices, SEO** → modo **Mobile** → Generate report.

**Metas:**
| Categoria | Meta mínima |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

- [ ] **Step 2: Otimizações comuns que podem ser necessárias**

**Se Performance < 95:**
- Imagens pesadas → converter pra WebP (use https://squoosh.app)
- Fonte bloqueando render → confirmar `font-display: swap` está aplicado
- CSS não-crítico → mover pro fim do `<body>` se possível

**Se SEO < 100:**
- Meta description faltando ou com tamanho errado (entre 120 e 160 chars)
- Lang faltando no `<html>` → confirmar `lang="pt-BR"`
- Links sem texto descritivo

**Se Best Practices < 95:**
- HTTPS não configurado (vai ser resolvido no deploy)
- Erros no console
- Imagens com aspect-ratio incorreto

- [ ] **Step 3: Validar console final**

Abrir DevTools → Console → recarregar página. Deve estar **100% limpo**, sem erros nem warnings (exceto warnings esperados de imagens 404 que serão substituídas).

- [ ] **Step 4: Validar HTML**

Copiar o conteúdo de `index.html` em https://validator.w3.org/#validate_by_input → corrigir erros listados.

- [ ] **Step 5: Commitar**

```bash
git add .
git commit -m "perf: otimizacoes pos-auditoria Lighthouse (Performance/SEO/Best Practices 95+)"
```

---

## Task 18: Cross-browser + smoke test final

**Files:**
- Modify: nenhum (apenas validação)

- [ ] **Step 1: Testar em navegadores**

Abrir `http://localhost:8000` em:
- [ ] Chrome (versão atual)
- [ ] Firefox (versão atual)
- [ ] Edge (versão atual)
- [ ] Safari (se possível, ou Safari iOS via DevTools)

**Verificar em cada um:**
- Layout idêntico (sem quebras)
- Animações suaves
- Filtros do catálogo funcionam
- WhatsApp flutuante aparece
- Menu mobile responde

- [ ] **Step 2: Smoke test funcional completo**

Checklist final antes do deploy:
- [ ] Site carrega em < 2s
- [ ] Logo no header é clicável e leva pra `#home`
- [ ] Todos os links do nav rolam pra seção certa
- [ ] CTA "Encomende" do header abre Instagram
- [ ] CTAs do hero funcionam (Ver catálogo + Falar no Instagram)
- [ ] Tabs do catálogo filtram corretamente
- [ ] Botão "Quero esse" em cada produto abre WhatsApp com mensagem certa
- [ ] Botão "Ver mais no @riviaprint" da galeria abre Instagram
- [ ] 3 cards de contato abrem cada canal
- [ ] WhatsApp flutuante abre WhatsApp com mensagem genérica
- [ ] Footer: links funcionam, ícones de redes funcionam
- [ ] Página 404: digitar URL inexistente (`http://localhost:8000/qualquer-coisa`) — `python -m http.server` não serve 404.html automaticamente, mas o GitHub Pages sim. Pode pular este teste local.

- [ ] **Step 3: Commitar (se houver fix)**

```bash
git add .
git commit -m "fix: ajustes pos-teste cross-browser"
```

---

## Task 19: Push para GitHub e configurar GitHub Pages

**Files:**
- Nenhum (configuração via web)

- [ ] **Step 1: Push de tudo pra `main`**

```bash
git push -u origin main
```

> Pode pedir credencial. Use seu token do GitHub se necessário.

- [ ] **Step 2: Habilitar GitHub Pages no repositório**

Acesse: `https://github.com/gevianajr/riviaprint/settings/pages`

Configurar:
- **Source**: Deploy from a branch
- **Branch**: `main` / `/ (root)`
- **Save**

Aguarde ~1-2 minutos. O GitHub vai mostrar a URL temporária `https://gevianajr.github.io/riviaprint/`.

- [ ] **Step 3: Adicionar custom domain**

Na mesma página de Settings → Pages:
- **Custom domain**: `riviaprint.com.br`
- **Save**

GitHub vai fazer um check de DNS — vai falhar **por enquanto**, porque os DNS atuais ainda apontam pra Hostinger. É esperado.

- [ ] **Step 4: Validar URL temporária**

Abrir `https://gevianajr.github.io/riviaprint/` no navegador.
Esperado: site funcionando 100% via HTTPS.

> Se as imagens dos produtos ainda forem placeholders (404), o emoji fallback aparece. Isso é OK — fotos reais serão adicionadas em momento posterior pelo cliente.

- [ ] **Step 5: Commitar (caso o GitHub tenha alterado o CNAME)**

```bash
git pull --rebase
# Se o GitHub adicionou CNAME, você já tem. Caso contrário, está OK.
git status
```

---

## Task 20: Configurar DNS no registrador (apontar pro GitHub Pages)

**Files:**
- Nenhum (configuração via painel da Hostinger ou outro registrador)

> ⚠️ Esta é a etapa que o cliente faz no painel do registrador. Documentação para reproduzir.

- [ ] **Step 1: Acessar painel DNS do `riviaprint.com.br`**

Login no registrador (Hostinger, no caso). Acessar Meus domínios → `riviaprint.com.br` → Gerenciar registros DNS.

- [ ] **Step 2: Remover registros antigos**

Remover:
- Registro `A` → `2.57.91.91`
- Registro `CNAME www` → `riviaprint.com.br`

- [ ] **Step 3: Adicionar 4 registros A**

Tipo `A`, Nome `@`, TTL `300` (ou padrão), Aponta para:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

- [ ] **Step 4: Adicionar registro CNAME para www**

Tipo `CNAME`, Nome `www`, TTL `300`, Aponta para `gevianajr.github.io`

- [ ] **Step 5: Aguardar propagação (10min a algumas horas)**

Verificar com:
```bash
nslookup riviaprint.com.br
# Deve listar os 4 IPs do GitHub: 185.199.108.x ...
```

Ou usar https://dnschecker.org/ → digitar `riviaprint.com.br` → Tipo A → Search.

- [ ] **Step 6: Voltar no GitHub Pages e habilitar HTTPS**

Acesse `https://github.com/gevianajr/riviaprint/settings/pages`:
- O check de DNS agora deve passar ✅
- Marcar **Enforce HTTPS** (botão fica disponível após emissão do certificado Let's Encrypt, ~10min)

- [ ] **Step 7: Validar produção**

Abrir:
- [ ] `https://riviaprint.com.br` → site carrega ✅
- [ ] `https://www.riviaprint.com.br` → redireciona para apex ✅
- [ ] Cadeado HTTPS válido ✅
- [ ] Compartilhar URL no WhatsApp → preview do Open Graph aparece ✅

🎉 **Site no ar!**

---

## Critérios de aceitação finais

Tudo abaixo deve estar marcado para considerar a entrega completa:

- [ ] Todas as 8 seções renderizam em desktop, tablet e mobile
- [ ] Catálogo carrega de `data/products.json` com pelo menos 1 produto por categoria
- [ ] Filtros de categoria funcionam sem reload
- [ ] Botões "Quero esse" abrem WhatsApp com mensagem correta
- [ ] CTA principal abre Instagram em nova aba
- [ ] WhatsApp flutuante aparece após hero e funciona
- [ ] Menu mobile abre/fecha/navega
- [ ] Lighthouse: 95+ em Performance, A11y, SEO, Best Practices (mobile)
- [ ] Site totalmente navegável por teclado
- [ ] Open Graph preview funciona ao compartilhar
- [ ] Site publicado em `https://riviaprint.com.br` com HTTPS
- [ ] Sem erros no console
- [ ] Funciona em Chrome, Firefox, Safari, Edge

## Pendências externas (responsabilidade do cliente)

Coisas que **não** travam o deploy mas devem ser substituídas depois:

1. Fotos profissionais dos produtos (vão em `assets/images/products/`)
2. Fotos da galeria (vão em `assets/images/gallery/`)
3. Imagem raster Open Graph (1200x630 PNG/JPG, substitui o `og-image.svg`)
4. Texto definitivo da seção Sobre (placeholder atualmente)
5. Confirmação dos 4 diferenciais (textos podem ser ajustados)

---

## Self-review (executada pelo autor do plano)

✅ **Cobertura do spec**: cada uma das 8 seções tem task dedicada (Header=5, Hero=6, Sobre=7, Catálogo=8+9, Como=10, Galeria=11, Contato=12, Footer=13).
✅ **Sem placeholders**: cada step tem código completo, sem "TBD".
✅ **Consistência de tipos**: classes CSS, IDs HTML e nomes de funções JS conferem entre tasks (ex: `#produtosGrid`, `produto-card`, `buildWhatsAppLink`).
✅ **Escopo focado**: um único deliverable (vitrine única no GitHub Pages).
✅ **Sem ambiguidade**: cada step diz exatamente qual arquivo, qual conteúdo, qual comando.
