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
})();
