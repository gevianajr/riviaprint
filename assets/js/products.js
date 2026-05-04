(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5514982276178';
  const DATA_URL = 'data/products.json';

  /**
   * Escapa caracteres HTML para prevenir XSS ao injetar dados em innerHTML.
   * Defensivo: products.json é controlado pelo time, mas evita surpresas.
   * @param {string} text
   * @returns {string} Texto seguro pra usar em innerHTML
   */
  function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Constrói URL do WhatsApp com mensagem pré-preenchida.
   * @param {string} produtoNome - Nome do produto (ou string vazia para mensagem genérica).
   * @returns {string} URL completa do WhatsApp.
   */
  function buildWhatsAppLink(produtoNome) {
    // WhatsApp renderiza *texto* como negrito — por isso envolvemos o nome do produto.
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
        <article class="produto-card" data-categoria="${escapeHtml(p.categoria)}" data-cor="${escapeHtml(cor)}">
          <div class="produto-card-img">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.nome)}" loading="lazy"
                 onerror="this.style.display='none';this.parentElement.innerHTML='<span aria-hidden=\\'true\\'>${escapeHtml(fallbackEmoji)}</span>';">
          </div>
          <div class="produto-card-body">
            <h3 class="produto-card-nome">${escapeHtml(p.nome)}</h3>
            <span class="produto-card-preco">${escapeHtml(p.preco)}</span>
            <p class="produto-card-desc">${escapeHtml(p.descricao)}</p>
            <a href="${link}" target="_blank" rel="noopener" class="btn btn-primary produto-card-cta"
               aria-label="Encomendar ${escapeHtml(p.nome)} pelo WhatsApp">
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
        <div class="hero-card ${variants[i]}" title="${escapeHtml(p.nome)}">
          <img src="${escapeHtml(p.imagem)}" alt="${escapeHtml(p.nome)}" loading="lazy"
               onerror="this.style.display='none';this.parentElement.innerHTML='<span aria-hidden=\\'true\\'>${escapeHtml(fallbackEmoji)}</span>';">
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