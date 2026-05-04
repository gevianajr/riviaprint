/**
 * Gera a Open Graph image (1200x630) usada no preview de WhatsApp/Insta/Facebook.
 * - Background branco minimalista com bolinhas decorativas
 * - Logo Rivia Print à esquerda
 * - Tagline "Impressão 3D sob medida"
 * - Grid 2x2 com 4 produtos em destaque à direita
 * - URL e Instagram no rodapé
 *
 * Output: og-image.jpg (compatibilidade WhatsApp/Facebook) + og-image.png (fallback)
 * WebP nao funciona em alguns scrapers de social media.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const HERO = path.join(ROOT, 'assets/images/hero');
const PRODUCTS = path.join(ROOT, 'assets/images/products');

async function main() {
  // === Camada 1: Background SVG ===
  // (Inter pode nao estar disponivel no rasterizador, uso system fallback)
  const bgSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FAFAFA"/>
    </linearGradient>
    <radialGradient id="brandGlow" cx="0%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#3886F7" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#3886F7" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#brandGlow)"/>

  <!-- Bolinhas decorativas (mesmo estilo do hero do site) -->
  <circle cx="60" cy="540" r="14" fill="#FFD60A"/>
  <circle cx="650" cy="80" r="10" fill="#E63946"/>
  <circle cx="100" cy="80" r="6" fill="#06D6A0"/>

  <!-- Tagline pill -->
  <rect x="60" y="120" width="320" height="48" rx="24" fill="#F4F7FF"/>
  <circle cx="84" cy="144" r="6" fill="#3886F7"/>
  <text x="104" y="151" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="18" fill="#3886F7">IMPRESSÃO 3D SOB MEDIDA</text>

  <!-- Titulo -->
  <text x="60" y="248" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="68" fill="#0A0A0A" letter-spacing="-2.5">Suas ideias,</text>
  <text x="60" y="324" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="68" fill="#3886F7" letter-spacing="-2.5">impressas em 3D</text>
  <text x="60" y="400" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="68" fill="#0A0A0A" letter-spacing="-2.5">com capricho.</text>

  <!-- Subtitulo -->
  <text x="60" y="448" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="22" fill="#666666">Articulados · Colecionáveis · Personalizados</text>

  <!-- Footer line -->
  <line x1="60" y1="510" x2="780" y2="510" stroke="#F0F0F0" stroke-width="2"/>

  <!-- Footer info -->
  <text x="60" y="560" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="26" fill="#0A0A0A">riviaprint.com.br</text>
  <text x="60" y="595" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="20" fill="#666666">@riviaprint  ·  WhatsApp (14) 98227-6178</text>

  <!-- Card backgrounds para os 4 produtos (lado direito) -->
  <rect x="800" y="60"  width="170" height="170" rx="22" fill="#FFFBE5"/>
  <rect x="990" y="100" width="170" height="170" rx="22" fill="#FEEBED"/>
  <rect x="800" y="280" width="170" height="170" rx="22" fill="#E5F8F0"/>
  <rect x="990" y="320" width="170" height="170" rx="22" fill="#EAF1FF"/>
</svg>`);

  // === Carregar produtos como buffers (resize pra encaixar nos cards) ===
  const productCardSize = 150; // 170 - 20 padding
  async function loadProduct(file) {
    return await sharp(path.join(PRODUCTS, file))
      .resize(productCardSize, productCardSize, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const polvo = await loadProduct('polvo-amarelo.webp');
  const caixinha = await loadProduct('caixinhas-copa-6cores.webp');
  const vaso = await loadProduct('vaso-decorativo.webp');
  const funko = await loadProduct('popculture-funko.webp');

  // Logo (resize para altura 100)
  const logo = await sharp(path.join(ROOT, 'assets/images/logo.png'))
    .resize(null, 100, { fit: 'inside' })
    .png()
    .toBuffer();

  // === Compositing ===
  // Cards estao em (800,60), (990,100), (800,280), (990,320) com 170x170
  // Centralizar produto 150x150 dentro de cada card 170x170 = offset +10
  const composites = [
    { input: logo, top: 50, left: 60 },
    { input: polvo, top: 70, left: 810 },
    { input: caixinha, top: 110, left: 1000 },
    { input: vaso, top: 290, left: 810 },
    { input: funko, top: 330, left: 1000 },
  ];

  // === Output JPG (compativel com WhatsApp/Facebook) ===
  await sharp(bgSvg)
    .composite(composites)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(HERO, 'og-image.jpg'));

  // === Output PNG (fallback) ===
  await sharp(bgSvg)
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(HERO, 'og-image.png'));

  // === WebP (mantida pra performance interna do site) ===
  await sharp(bgSvg)
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(path.join(HERO, 'og-image.webp'));

  // Verifica os tamanhos
  for (const f of ['og-image.jpg', 'og-image.png', 'og-image.webp']) {
    const size = (fs.statSync(path.join(HERO, f)).size / 1024).toFixed(1);
    console.log(`  ${f} = ${size}KB`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
