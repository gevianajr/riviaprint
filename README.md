# Rivia Print — Vitrine

Site institucional da Rivia Print, marca de impressão 3D sob encomenda.

🌐 **Produção:** https://riviaprint.com.br
📸 **Instagram:** [@riviaprint](https://www.instagram.com/riviaprint/)

## Stack

Site estático: HTML + CSS + JavaScript vanilla. Sem build step, sem dependências.

## Estrutura

- `index.html` — página única
- `assets/css/` — estilos (reset, variáveis, principal)
- `assets/js/` — scripts (main.js, products.js)
- `assets/images/` — fotos e logo
- `data/products.json` — catálogo (editar este arquivo para adicionar/remover produtos)

## Como editar o catálogo

1. Edite `data/products.json` adicionando/removendo entradas em `produtos[]`
2. Coloque a foto do produto em `assets/images/products/`
3. `git add . && git commit -m "feat: novo produto X" && git push`
4. GitHub Pages redeploya automaticamente em ~1min

## Como rodar localmente

```bash
python -m http.server 8000
# Abra http://localhost:8000
```

## Deploy

Automático via GitHub Pages no push para `main`.

---

© 2026 Rivia Print
