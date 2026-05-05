(function () {
  'use strict';

  // Aguarda GSAP, ScrollTrigger e Lenis estarem disponíveis
  var waitStart = Date.now();
  function waitForLibs(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
      cb();
    } else if (Date.now() - waitStart > 8000) {
      console.error('[animations] CDN timeout — libs not loaded after 8s', {
        gsap: typeof gsap, ScrollTrigger: typeof ScrollTrigger, Lenis: typeof Lenis
      });
    } else {
      requestAnimationFrame(function() { waitForLibs(cb); });
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
