async function fetchProducts() {
  const res = await fetch('products.json');
  return await res.json();
}

function createProductCard(product) {
  return `<div class="product-card">
    <img src="${product.images && product.images.length > 0 ? product.images[0] : ''}" alt="${product.title}">
    <div class="product-title">${product.title}</div>
    <div class="product-short">${product.shortDescription}</div>
    <div class="product-price">$${product.price.toFixed(2)}</div>
    <div class="product-rating">${'★'.repeat(Math.round(product.rating))} <span style="color:#888;font-size:0.95em">(${product.rating})</span></div>
    <a class="buy-btn" href="${product.affiliateUrl}" target="_blank" rel="nofollow sponsored">Buy on Merchant</a>
    <a href="product.html?id=${product.id}" style="margin-top:0.5rem;color:#2a7ae2;text-align:center;display:block;font-size:0.97em;">View Details</a>
  </div>`;
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(createProductCard).join('');
}

function handleSearch(products) {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim().toLowerCase();
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  renderProducts(products);
  handleSearch(products);
});
