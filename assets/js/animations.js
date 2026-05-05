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
    // tarefas inicializadas nas próximas tasks
  }
})();
