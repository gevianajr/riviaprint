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
})();
