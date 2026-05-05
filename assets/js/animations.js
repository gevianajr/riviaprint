(function () {
  'use strict';

  // Aguarda GSAP, ScrollTrigger e Lenis estarem disponíveis
  var waitStart = Date.now();
  function waitForLibs(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
      cb();
    } else if (Date.now() - waitStart > 8000) {
      var missing = [];
      if (typeof gsap === 'undefined') missing.push('gsap');
      if (typeof ScrollTrigger === 'undefined') missing.push('ScrollTrigger');
      if (typeof Lenis === 'undefined') missing.push('Lenis');
      console.error('[animations] CDN timeout after 8s. Missing: ' + missing.join(', '));
      return;
    } else {
      requestAnimationFrame(function () { waitForLibs(cb); });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    waitForLibs(initAnimations);
  });

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    initCursor();
    initAurora();
    initHeroTimeline();
    initHeroCardsListener();
    initMouseParallax();
    initMagneticButtons();
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

  function initAurora() {
    const b1 = document.querySelector('.hero-blob-1');
    const b2 = document.querySelector('.hero-blob-2');
    const b3 = document.querySelector('.hero-blob-3');
    if (!b1 || !b2 || !b3) return;

    gsap.to(b1, { x: 55, y: -38, scale: 1.18, duration: 8,   yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(b2, { x: -38, y: 32, scale: 0.88, duration: 9.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(b3, { x: 28, y: 42,  scale: 1.12, duration: 7,   yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

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

  let heroCardsInitialized = false;

  function initHeroFloat() {
    if (heroCardsInitialized) return;
    heroCardsInitialized = true;
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

  function initHeroCardsListener() {
    document.addEventListener('riviaProductsReady', function () {
      if (heroCardsInitialized) return;
      heroCardsInitialized = true;
      initHeroCards();
    }, { once: true });
  }

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
})();
