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
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================================
   * HEADER COM SOMBRA AO ROLAR
   * ============================================================ */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };

    update();
    window.addEventListener('scroll', () => {
      requestAnimationFrame(update);
    }, { passive: true });
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
   * LIGHTBOX (galeria — clicar amplia em vez de ir pro Instagram)
   * ============================================================ */
  function initLightbox() {
    const items = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    if (!items.length || !lightbox || !lightboxImg || !closeBtn) return;

    let lastFocused = null;

    const open = (src, alt, trigger) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lastFocused = trigger;
      // foco na X pra navegar com teclado
      setTimeout(() => closeBtn.focus(), 0);
    };

    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      // limpa src depois da animação pra liberar memória
      setTimeout(() => { if (!lightbox.classList.contains('open')) lightboxImg.src = ''; }, 300);
      if (lastFocused) lastFocused.focus();
    };

    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;
        open(img.currentSrc || img.src, img.alt, item);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      // clique fora da imagem fecha
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  /* ============================================================
   * BOOT
   * ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initHeaderScroll();
    initWppFloat();
    initLightbox();
  });
})();
