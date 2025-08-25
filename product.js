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
  
  // Create the image slider HTML
  const imageSliderHtml = `
    <div class="product-image-gallery">
      <div class="main-image-container">
        <img id="main-product-image" src="${product.images[0]}" alt="${product.title}" data-zoom-image="${product.images[0]}">
      </div>
      <div class="image-thumbnails">
        ${product.images.map((img, index) => 
          `<img src="${img}" alt="${product.title} image ${index+1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">`
        ).join('')}
      </div>
    </div>
  `;
  
  el.innerHTML = `
    ${imageSliderHtml}
    <div class="product-info">
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
    </div>
  `;
}

// Image gallery functions
function changeImage(src, thumbnail) {
  // Update main image
  const mainImage = document.getElementById('main-product-image');
  mainImage.src = src;
  mainImage.setAttribute('data-zoom-image', src);
  
  // Update active thumbnail
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(thumb => thumb.classList.remove('active'));
  thumbnail.classList.add('active');
  
  // Reset zoom if it was active
  if (mainImage.classList.contains('zoomed')) {
    toggleZoom();
  }
}

function initZoom() {
  const mainImage = document.getElementById('main-product-image');
  mainImage.addEventListener('click', function() {
    toggleZoom(this);
  });
}

function toggleZoom(image) {
  const img = image || document.getElementById('main-product-image');
  const container = img.parentElement;
  
  if (img.classList.contains('zoomed')) {
    // Remove zoom
    img.classList.remove('zoomed');
    container.classList.remove('zooming');
    img.style.transform = 'translate(0, 0) scale(1)';
    
    // Remove move event
    img.removeEventListener('mousemove', moveZoomedImage);
  } else {
    // Add zoom
    img.classList.add('zoomed');
    container.classList.add('zooming');
    
    // Add move event
    img.addEventListener('mousemove', moveZoomedImage);
  }
}

function moveZoomedImage(e) {
  const img = e.target;
  const container = img.parentElement;
  const rect = container.getBoundingClientRect();
  
  // Calculate mouse position relative to image container
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate percentage position
  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;
  
  // Calculate transform values for the zoom effect
  // This moves the image in the opposite direction of the mouse
  const moveX = (50 - xPercent) / 2;
  const moveY = (50 - yPercent) / 2;
  
  // Apply transform
  img.style.transform = `translate(${moveX}%, ${moveY}%) scale(2.5)`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const id = getProductIdFromUrl();
  const products = await fetchProducts();
  const product = products.find(p => p.id === id);
  renderProductDetail(product);
  
  // Initialize zoom functionality after rendering
  setTimeout(initZoom, 100);
});
