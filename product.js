async function fetchProducts() {
  const res = await fetch('products.json');
  return await res.json();
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderProductDetail(product) {
  const el = document.getElementById('product-detail');
  if (!product) {
    el.innerHTML = '<p>Product not found.</p>';
    return;
  }
  el.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h1>${product.title}</h1>
    <div class="price">$${product.price.toFixed(2)}${product.oldPrice ? `<span class='old-price'>$${product.oldPrice.toFixed(2)}</span>` : ''}</div>
    <div class="rating">${'★'.repeat(Math.round(product.rating))} <span style="color:#888;font-size:0.95em">(${product.rating})</span></div>
    <div class="desc">${product.description}</div>
    <div class="pros-cons">
      <div class="pros"><strong>Pros:</strong><ul>${product.pros.map(p => `<li>${p}</li>`).join('')}</ul></div>
      <div class="cons"><strong>Cons:</strong><ul>${product.cons.map(c => `<li>${c}</li>`).join('')}</ul></div>
    </div>
    <table class="specs-table">
      <tbody>
        ${Object.entries(product.specs || {}).map(([k,v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
      </tbody>
    </table>
    <a class="buy-btn" href="${product.affiliateUrl}" target="_blank" rel="nofollow sponsored">Buy on Merchant</a>
    <div class="disclaimer">DuraiShop may earn a commission from qualifying purchases.</div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  const id = getProductIdFromUrl();
  const products = await fetchProducts();
  const product = products.find(p => p.id === id);
  renderProductDetail(product);
});
