# Design — Vitrine Rivia Print

**Data:** 2026-05-04
**Autor:** Geraldo Viana Jr (gevianajr)
**Repo:** https://github.com/gevianajr/riviaprint
**Domínio:** riviaprint.com.br (em registro)

---

## 1. Objetivo e escopo

Criar uma vitrine institucional/comercial **single-page** para a Rivia Print — empresa de impressão 3D sob encomenda. O site **não vende online** (não há checkout, carrinho, login ou pagamento). Toda conversão acontece via canais externos: Instagram DM, WhatsApp e e-mail.

### Objetivos primários
1. Apresentar a marca de forma profissional e moderna
2. Exibir o portfólio de produtos organizado por categorias
3. Direcionar visitantes para os canais de venda (Instagram/WhatsApp) com fricção mínima
4. Servir como cartão de visita digital para divulgação no Instagram e materiais físicos

### Fora de escopo
- Carrinho, checkout, gateway de pagamento
- Cadastro/login de usuário, área do cliente
- Painel administrativo
- Blog, sistema de comentários
- Multi-idioma (apenas pt-BR)
- App mobile

---

## 2. Stack e arquitetura

### Stack
- **HTML5 + CSS3 + JavaScript vanilla** (sem framework, sem build step)
- **Google Fonts** para a tipografia (Inter)
- **Hospedagem:** GitHub Pages com domínio próprio
- **Versionamento:** Git no repositório `gevianajr/riviaprint`

### Justificativa
- Site estático, sem necessidade de servidor ou banco de dados
- Custo zero de hospedagem
- Performance máxima (carregamento sub-segundo)
- SEO excelente
- Manutenção trivial

### Estrutura de arquivos

```
riviaprint/
├── index.html              ← página única
├── 404.html                ← página de erro custom
├── CNAME                   ← "riviaprint.com.br"
├── robots.txt              ← SEO
├── sitemap.xml             ← SEO
├── README.md               ← instruções de manutenção
├── assets/
│   ├── css/
│   │   ├── reset.css       ← normalização cross-browser
│   │   ├── variables.css   ← design tokens
│   │   └── style.css       ← estilos principais
│   ├── js/
│   │   ├── main.js         ← interações UI
│   │   └── products.js     ← renderiza catálogo do JSON
│   ├── images/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   ├── og-image.jpg    ← preview WhatsApp/Facebook (1200x630)
│   │   ├── hero/
│   │   ├── products/
│   │   └── gallery/
│   └── icons/              ← SVGs (whatsapp, instagram, email, ícones de feature)
└── data/
    └── products.json       ← catálogo editável
```

### Modelo de dados — `products.json`

```json
{
  "categorias": [
    { "id": "articulados", "nome": "Articulados / Flexi", "cor": "yellow" },
    { "id": "copa", "nome": "Linha Copa do Mundo 2026", "cor": "green" },
    { "id": "personalizados", "nome": "Personalizados sob encomenda", "cor": "blue" },
    { "id": "decoracao", "nome": "Decoração / Utilidades", "cor": "red" },
    { "id": "popculture", "nome": "Colecionáveis / Pop Culture", "cor": "blue" },
    { "id": "chaveiros", "nome": "Chaveiros / Miniaturas", "cor": "yellow" }
  ],
  "produtos": [
    {
      "id": "polvo-amarelo",
      "nome": "Polvo Articulado Amarelo",
      "categoria": "articulados",
      "preco": "A consultar",
      "imagem": "assets/images/products/polvo-amarelo.jpg",
      "destaque": true,
      "descricao": "Polvo flexível impresso em 3D, ideal como fidget toy ou decoração."
    },
    {
      "id": "caixinha-copa-vermelha",
      "nome": "Caixinha Figurinhas Copa 2026 — Vermelha",
      "categoria": "copa",
      "preco": "R$ 35,00",
      "imagem": "assets/images/products/caixinha-copa-vermelha.jpg",
      "destaque": true,
      "descricao": "Caixinha 3D resistente para colecionar suas figurinhas da Copa do Mundo 2026."
    }
  ]
}
```

**Por que JSON separado:** adicionar produtos novos é trivial — editar o JSON e fazer `git push`. Sem mexer em HTML.

---

## 3. Estrutura da página (8 seções)

| # | Seção | Âncora | Função |
|---|---|---|---|
| 1 | **Header / Nav fixa** | — | Logo + links de navegação + CTA Instagram |
| 2 | **Hero** | `#home` | Título + subtítulo + 2 CTAs + grid de 4 produtos em destaque |
| 3 | **Sobre nós** | `#sobre` | História + 3-4 diferenciais com ícones |
| 4 | **Catálogo por categorias** | `#produtos` | Tabs/filtros com 6 categorias, grid de cards de produtos |
| 5 | **Como encomendar** | `#como` | Passo-a-passo visual em 4 etapas |
| 6 | **Galeria / Destaques** | `#galeria` | Grid 6-9 fotos + link para o Instagram |
| 7 | **Contato** | `#contato` | 3 cards: Instagram, WhatsApp, E-mail |
| 8 | **Footer** | — | Logo + redes + © 2026 + link política |

**Botão flutuante de WhatsApp** (canto inferior direito, fixo, visível a partir da seção Sobre).

### Comportamentos da nav
- Sticky no topo, ganha sombra ao rolar
- Em mobile: vira hambúrguer com overlay full-screen
- Links com scroll suave para as âncoras
- CTA "Encomende →" sempre visível (cor preto sólido)

---

## 4. Sistema de design (Design Tokens)

Todos os tokens vivem em `assets/css/variables.css`. Convenção de prefixos:
`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--transition-*`.

### Cores

```css
/* Base */
--color-bg:           #FFFFFF;
--color-bg-soft:      #FAFAFA;
--color-text:         #0A0A0A;
--color-text-muted:   #666666;
--color-border:       #F0F0F0;

/* Marca */
--color-brand:        #3886F7;
--color-brand-soft:   #F4F7FF;

/* Acentos por categoria (cards pastel) */
--color-yellow-soft:  #FFFBE5;   --color-yellow:  #FFD60A;
--color-red-soft:     #FEEBED;   --color-red:     #E63946;
--color-green-soft:   #E5F8F0;   --color-green:   #06D6A0;
--color-blue-soft:    #EAF1FF;
```

### Tipografia — Inter (Google Fonts)

```css
--font-family:  'Inter', system-ui, sans-serif;

--font-display: 700 clamp(36px, 6vw, 64px) / 1.05;
--font-h2:      700 clamp(28px, 4vw, 42px) / 1.15;
--font-h3:      600 20px / 1.3;
--font-body:    400 16px / 1.6;
--font-small:   500 13px / 1.5;

--letter-tight: -1.5px;
```

### Espaçamento e raios

```css
--space-xs: 8px;    --space-sm: 16px;  --space-md: 24px;
--space-lg: 48px;   --space-xl: 96px;

--radius-sm: 8px;   --radius-md: 16px;
--radius-lg: 24px;  --radius-pill: 999px;
```

### Sombras e transições

```css
--shadow-sm:  0 4px 20px rgba(0, 0, 0, 0.04);
--shadow-md:  0 8px 30px rgba(0, 0, 0, 0.08);
--transition: all 0.25s ease;
```

### Breakpoints

- Mobile: `< 640px`
- Tablet: `640px – 1024px`
- Desktop: `> 1024px`

**Abordagem mobile-first**: estilos base para mobile, media queries `min-width` para subir.

---

## 5. Conteúdo das seções

### 5.1 Hero
- **Badge**: "Impressão 3D sob medida" (pílula azul-claro com bolinha)
- **Título**: "Suas ideias, **impressas em 3D** com capricho." (azul na palavra "impressas em 3D")
- **Subtítulo**: "Da peça personalizada ao colecionável. Articulados, decorativos, presentes únicos — feitos com qualidade, cor e prazo que você confia."
- **CTAs**: `Ver catálogo` (preto sólido, scroll para `#produtos`) + `Falar no Instagram` (outline, abre `instagram.com/riviaprint`)
- **Lado direito**: grid 2x2 de produtos em destaque com cards pastel rotacionados levemente
- **Faixa de confiança** (logo abaixo do hero): "✓ Entrega em todo Brasil · ✓ +500 peças impressas · ✓ Personalização sob demanda · ✓ Materiais de qualidade"

### 5.2 Sobre nós
- **Título**: "Quem é a Rivia Print"
- **Parágrafo curto** (placeholder a ser preenchido pelo cliente, com sugestão): "Somos uma marca brasileira de impressão 3D que transforma ideias em peças reais. Da brincadeira ao presente especial, cada item é impresso com atenção aos detalhes, cor vibrante e acabamento caprichado."
- **4 diferenciais com ícones** (grid 2x2 mobile, 4 colunas desktop):
  - 🎯 **Qualidade premium** — materiais resistentes e acabamento impecável
  - ⚡ **Prazo combinado** — você sabe quando recebe, sempre
  - 🎨 **Personalizamos** — cor, tamanho, design adaptados ao que você quer
  - 🇧🇷 **Feito no Brasil** — produção nacional, com carinho

### 5.3 Catálogo por categorias
- **Título**: "Nosso catálogo"
- **Subtítulo**: "Toque em uma categoria para explorar"
- **Tabs horizontais** com nome das 6 categorias (scroll horizontal em mobile)
- **Tab ativa** ganha sublinhado azul + fonte mais escura
- **Grid responsivo de cards** (1 col mobile, 2 col tablet, 3 col desktop)
- **Card de produto**:
  - Imagem (aspect-ratio 1:1, fundo pastel da categoria)
  - Nome do produto
  - Preço ou "A consultar"
  - Botão "Quero esse" (pílula preta, abre WhatsApp com mensagem pré-preenchida)
- Renderizado dinamicamente por `products.js` lendo `data/products.json`

### 5.4 Como encomendar
- **Título**: "Como encomendar é simples"
- **4 passos em cards horizontais** (vira vertical em mobile):
  1. **Escolha** — Navegue pelo catálogo e veja o que mais gostou
  2. **Chame** — Manda mensagem no DM do Instagram ou WhatsApp
  3. **Combinamos** — Definimos cor, prazo e valor juntos
  4. **Receba** — Produzimos com carinho e enviamos pra você
- Cada passo tem número grande, ícone, título e descrição curta

### 5.5 Galeria
- **Título**: "Veja nossos trabalhos"
- **Grid 3x3** (3 colunas desktop, 2 tablet, 1 mobile) com 6-9 fotos selecionadas dos melhores produtos
- **Hover**: leve zoom + escurecimento + ícone de Instagram aparece
- **Botão final**: "Ver mais no @riviaprint" → abre Instagram

### 5.6 Contato
- **Título**: "Vamos conversar?"
- **3 cards grandes** lado-a-lado (empilham em mobile):
  - **Instagram** (gradiente Insta no ícone) → `instagram.com/riviaprint`
  - **WhatsApp** (verde no ícone) → `wa.me/5514982276178`
  - **E-mail** (azul no ícone) → `mailto:contato@riviaprint.com.br`
- Cada card mostra ícone grande, nome do canal, handle/número/email, e flecha "→"

### 5.7 Footer
- Coluna 1: Logo Rivia Print + tagline curta
- Coluna 2: Links rápidos (mesmas âncoras do menu)
- Coluna 3: Contato resumido
- Coluna 4: Redes sociais (ícones Instagram + WhatsApp)
- Linha inferior: "© 2026 Rivia Print · Feito com carinho · [Política de Privacidade]"

---

## 6. JavaScript — funcionalidades

### `main.js`
1. **Menu mobile** — toggle do hambúrguer com `aria-expanded`
2. **Scroll suave** — para todos os links âncora
3. **Header dinâmico** — adiciona classe `.scrolled` ao rolar > 20px (sombra)
4. **Reveal on scroll** — `IntersectionObserver` aplica classe `.visible` em `.reveal` (fade + slide-up)
5. **WhatsApp link builder** — função utilitária `buildWhatsAppLink(productName)` retorna URL com mensagem
6. **Respeitar `prefers-reduced-motion`** — desativa animações se o usuário pedir

### `products.js`
1. `fetch('data/products.json')` no carregamento da página
2. Renderiza tabs de categorias na seção #produtos
3. Renderiza grid de cards de produtos (todos visíveis inicialmente, ou filtrados pela tab ativa)
4. Renderiza grid de destaques no Hero (apenas `destaque: true`, máximo 4)
5. Click na tab → filtra cards (mostra/esconde via `display`)
6. Cada botão "Quero esse" recebe handler que chama `buildWhatsAppLink(produto.nome)`

**Tudo vanilla, sem libs. Bundle JS total < 20KB minificado.**

---

## 7. SEO

### Meta tags base
```html
<title>Rivia Print — Impressão 3D sob medida no Brasil</title>
<meta name="description" content="Vitrine da Rivia Print: impressão 3D de qualidade sob encomenda. Articulados, colecionáveis Copa 2026, personalizados e mais. Encomende pelo Instagram ou WhatsApp.">
<meta name="theme-color" content="#3886F7">
<link rel="canonical" href="https://riviaprint.com.br/">
```

### Open Graph + Twitter Card
- `og:title`, `og:description`, `og:image` (1200x630), `og:url`, `og:type=website`
- `twitter:card=summary_large_image`

### Schema.org JSON-LD (LocalBusiness)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Rivia Print",
  "url": "https://riviaprint.com.br",
  "image": "https://riviaprint.com.br/assets/images/og-image.jpg",
  "telephone": "+5514982276178",
  "email": "contato@riviaprint.com.br",
  "sameAs": ["https://www.instagram.com/riviaprint/"],
  "areaServed": "BR"
}
```

### Outros
- `sitemap.xml` listando a home com todas as âncoras
- `robots.txt` permitindo tudo, apontando para o sitemap
- `h1` único no hero, `h2` em cada seção, `h3` em subsections
- URLs amigáveis (apenas âncoras na home)

---

## 8. Performance

- **Imagens em WebP** com fallback JPG via `<picture>`
- **`loading="lazy"`** em imagens abaixo da dobra
- **`<picture>` responsivo** com `srcset` (servir 600w mobile / 1200w desktop)
- **Inter** carregada com `font-display: swap` + `<link rel="preload">`
- **CSS crítico do hero** inline no `<head>`
- **JavaScript no fim do `<body>`** com `defer`
- **Meta `viewport`** correto
- **Compressão Brotli/Gzip** automática do GitHub Pages

**Meta Lighthouse**: 95+ em Performance, A11y, SEO, Best Practices.

---

## 9. Acessibilidade (WCAG 2.1 AA)

- **Contraste mínimo 4.5:1** em todo texto (validado nas cores escolhidas)
- **`alt` descritivo** em toda imagem (vazio `alt=""` em imagens decorativas)
- **`aria-label`** em botões só com ícone (WhatsApp flutuante, redes sociais no footer)
- **Foco visível** com outline azul de 2px nos elementos interativos
- **Navegação completa por teclado** (Tab, Enter, Escape)
- **`prefers-reduced-motion: reduce`** desativa todas as animações
- **HTML semântico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Estrutura de headings hierárquica** sem pular níveis

---

## 10. Deploy e DNS

### Configuração GitHub Pages
1. Push do código para `main` no repo `gevianajr/riviaprint`
2. **Settings → Pages**: source = `main` branch, folder = `/` (root)
3. **Custom domain**: digitar `riviaprint.com.br` → cria automaticamente o arquivo `CNAME`
4. **Enforce HTTPS**: marcar (após emissão do certificado Let's Encrypt, ~10min)

### DNS (no painel do registrador, após o domínio ativar)
- **Registro A** (apex `riviaprint.com.br`) — quatro entradas:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **Registro CNAME** (subdomínio `www`) → `gevianajr.github.io`

Propagação: 30 minutos a algumas horas.

### Verificação pós-deploy
- Acessar `https://riviaprint.com.br` (deve servir o site)
- Acessar `https://www.riviaprint.com.br` (deve redirecionar para apex)
- Verificar cadeado HTTPS válido
- Testar todos os CTAs (Instagram, WhatsApp, E-mail)
- Compartilhar URL no WhatsApp e validar preview Open Graph

---

## 11. Critérios de aceitação

O projeto está pronto para go-live quando:

- [ ] Todas as 8 seções renderizam corretamente em desktop, tablet e mobile
- [ ] Catálogo carrega dinamicamente de `products.json` com pelo menos 1 produto por categoria
- [ ] Filtros de categoria funcionam sem recarregar a página
- [ ] Botões "Quero esse" abrem WhatsApp com mensagem correta pré-preenchida
- [ ] CTA principal abre Instagram em nova aba
- [ ] Botão flutuante de WhatsApp aparece e funciona
- [ ] Menu mobile abre, fecha e navega corretamente
- [ ] Imagens otimizadas em WebP com fallback
- [ ] Lighthouse: 95+ em Performance, A11y, SEO, Best Practices (mobile)
- [ ] Site acessível por teclado em sua totalidade
- [ ] Open Graph preview funciona ao compartilhar no WhatsApp
- [ ] Site publicado em `https://riviaprint.com.br` com HTTPS válido
- [ ] Sem erros no console do navegador
- [ ] Funciona em Chrome, Firefox, Safari e Edge (últimas 2 versões)

---

## 12. Pendências / dependências externas

Itens que precisam ser fornecidos pelo cliente para finalização:

1. **Texto definitivo da seção Sobre** (placeholder usado por enquanto)
2. **Lista completa de produtos** com fotos profissionais (mínimo 2 por categoria)
3. **Foto/banner para Open Graph** (1200x630, com logo + produtos)
4. **Confirmação dos diferenciais** (4 cards na seção Sobre)
5. **Seleção de 6-9 fotos** para a galeria
6. **Configuração do DNS** assim que o domínio estiver ativo (passo executável após registro completo)
7. **Política de privacidade** (página adicional opcional, pode entrar em versão futura)

---

## 13. Versionamento futuro (fora do escopo desta v1)

Ideias registradas para evolução futura — não fazem parte desta entrega:

- Página individual por produto (URLs únicas para SEO de produto)
- Sistema de busca no catálogo
- Página de blog/dicas de cuidado das peças
- Embed do feed real do Instagram (via API)
- Galeria com lightbox
- Multi-idioma (en, es)
- Analytics (GA4 ou Plausible)
