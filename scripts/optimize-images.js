/**
 * Otimiza as imagens do projeto:
 *  - Polvos: 1254x1254 PNG (1.3MB) → 800x800 WebP (~80KB)
 *  - Caixinhas trio: 270KB → WebP (~70KB)
 *  - Caixinhas 6 cores: 1536x1024 PNG (2.1MB) → 1200w WebP (~200KB)
 *  - Flyer Copa: 1024x1536 PNG (2.4MB) → 800w WebP (~150KB)
 *  - Logo watercolor (OG image): 941x1672 PNG (1.7MB) → 1200x630 WebP center-cropped (~200KB)
 *  - Logo cropado (transparente): extrai a região do R+RIVIA PRINT da watercolor
 *
 * Mantem PNGs originais como fallback.
 * Roda: `node scripts/optimize-images.js`
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRODUCTS = path.join(ROOT, 'assets/images/products');
const HERO = path.join(ROOT, 'assets/images/hero');

async function process(input, output, opts) {
  const start = Date.now();
  await opts.pipeline(sharp(input)).toFile(output);
  const inSize = (fs.statSync(input).size / 1024).toFixed(0);
  const outSize = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`✓ ${path.basename(input)} (${inSize}KB) → ${path.basename(output)} (${outSize}KB) [${Date.now()-start}ms]`);
}

async function main() {
  // Polvos: cards quadrados, 800x800 é mais que suficiente
  for (const cor of ['amarelo','vermelho','verde','azul']) {
    await process(
      path.join(PRODUCTS, `polvo-${cor}.png`),
      path.join(PRODUCTS, `polvo-${cor}.webp`),
      { pipeline: p => p.resize(800, 800, { fit: 'inside' }).webp({ quality: 82 }) }
    );
  }

  // Caixinhas Copa - 6 cores em grid (mais largo que alto)
  await process(
    path.join(PRODUCTS, 'caixinhas-copa-6cores.png'),
    path.join(PRODUCTS, 'caixinhas-copa-6cores.webp'),
    { pipeline: p => p.resize(1200, null, { fit: 'inside' }).webp({ quality: 82 }) }
  );

  // Caixinhas Copa - trio
  await process(
    path.join(PRODUCTS, 'caixinhas-copa-trio.jpg'),
    path.join(PRODUCTS, 'caixinhas-copa-trio.webp'),
    { pipeline: p => p.resize(1000, null, { fit: 'inside' }).webp({ quality: 82 }) }
  );

  // Flyer marketing Copa
  await process(
    path.join(HERO, 'flyer-copa.png'),
    path.join(HERO, 'flyer-copa.webp'),
    { pipeline: p => p.resize(800, null, { fit: 'inside' }).webp({ quality: 82 }) }
  );

  // OG image: 1200x630 (formato canônico Open Graph)
  // Logo watercolor é portrait 941x1672. Vamos:
  //  - escalar pra altura 1200, mantendo aspect = 676x1200
  //  - center crop pra 1200x630? Não, é portrait. Melhor: usar a imagem rotacionada/redesenhada.
  // Por simplicidade: redimensionar pra caber em 1200x630, completar com background branco (mesmo branco da watercolor).
  await process(
    path.join(HERO, 'logo-rivia-watercolor.png'),
    path.join(HERO, 'og-image.webp'),
    { pipeline: p => p.resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }).webp({ quality: 88 })
    }
  );

  // Versão maior também pra hero asset
  await process(
    path.join(HERO, 'logo-rivia-watercolor.png'),
    path.join(HERO, 'logo-rivia-watercolor.webp'),
    { pipeline: p => p.resize(800, null, { fit: 'inside' }).webp({ quality: 85 }) }
  );

  // Logo cropado: o R+RIVIA PRINT está aproximadamente no centro inferior
  // da imagem 941x1672. Estimativa visual:
  //  - O logo ocupa as áreas X: 250-690 (~440px largura) e Y: 600-1180 (~580px altura)
  //  - Center: aprox X=470, Y=890
  // Vou extrair essa região e gerar uma versão limpa em transparente
  const logoMeta = await sharp(path.join(HERO, 'logo-rivia-watercolor.png')).metadata();
  const cropX = Math.round(logoMeta.width * 0.27);   // ~250
  const cropY = Math.round(logoMeta.height * 0.36);  // ~600
  const cropW = Math.round(logoMeta.width * 0.46);   // ~440
  const cropH = Math.round(logoMeta.height * 0.34);  // ~580

  await sharp(path.join(HERO, 'logo-rivia-watercolor.png'))
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .resize(600, null, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(HERO, 'logo-cropped.webp'));
  console.log('✓ Logo cropado extraido em hero/logo-cropped.webp');

  console.log('\n=== Tamanhos finais ===');
  for (const dir of [PRODUCTS, HERO]) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
    for (const f of files) {
      const size = (fs.statSync(path.join(dir, f)).size / 1024).toFixed(0);
      console.log(`  ${f} = ${size}KB`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
