/* js/script.js - handles product data, cart, and interactivity */
const PRODUCTS = [
  /* 12 products */
  {id:1,title:"Wireless Headphones",price:59.99,category:"Electronics",desc:"Comfortable wireless headphones with noise reduction.",rating:4.4,images:["images/product1.jpg"]},
  {id:2,title:"Smartwatch Pro X",price:129.99,category:"Electronics",desc:"Fitness tracking, waterproof, 7-day battery life.",rating:4.6,images:["images/product2.jpg"]},
  {id:3,title:"Classic Denim Jacket",price:79.99,category:"Clothing",desc:"Stylish denim jacket for casual wear.",rating:4.2,images:["images/product3.jpg"]},
  {id:4,title:"Leather Wallet",price:24.99,category:"Accessories",desc:"Slim leather wallet with multiple compartments.",rating:4.1,images:["images/product4.jpg"]},
  {id:5,title:"Bluetooth Speaker",price:45.00,category:"Electronics",desc:"Portable speaker with rich bass.",rating:4.3,images:["images/product5.jpg"]},
  {id:6,title:"Sunglasses UV400",price:19.99,category:"Accessories",desc:"Protective and trendy sunglasses.",rating:4.0,images:["images/product6.jpg"]},
  {id:7,title:"Running Shoes",price:89.50,category:"Clothing",desc:"Lightweight shoes designed for running comfort.",rating:4.5,images:["images/product7.jpg"]},
  {id:8,title:"Silk Scarf",price:29.99,category:"Accessories",desc:"Soft silk scarf with pastel patterns.",rating:4.2,images:["images/product8.jpg"]},
  {id:9,title:"Gaming Mouse",price:39.99,category:"Electronics",desc:"Ergonomic mouse with programmable buttons.",rating:4.4,images:["images/product9.jpg"]},
  {id:10,title:"Casual T-Shirt",price:15.99,category:"Clothing",desc:"Breathable cotton T-Shirt.",rating:4.0,images:["images/product10.jpg"]},
  {id:11,title:"Backpack Mini",price:49.99,category:"Accessories",desc:"Compact backpack for everyday use.",rating:4.3,images:["images/product11.jpg"]},
  {id:12,title:"Wireless Charger",price:22.99,category:"Electronics",desc:"Fast wireless charger pad.",rating:4.1,images:["images/product12.jpg"]},
];

/* --- Cart helpers (localStorage) --- */
function getCart(){
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart){ localStorage.setItem("cart", JSON.stringify(cart)); }
function addToCart(id, qty=1){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty;
  else cart.push({id,qty});
  saveCart(cart);
  alert("Added to cart");
  updateCartCount();
}
function removeFromCart(id){ let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); updateCartCount(); renderCartPage && renderCartPage(); }
function updateQty(id,qty){ const cart = getCart(); const item = cart.find(i=>i.id===id); if(item){ item.qty = qty; if(item.qty<=0) removeFromCart(id); saveCart(cart); } renderCartPage && renderCartPage(); updateCartCount(); }

/* --- UI helpers --- */
function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const el = document.querySelector(".cart-count");
  if(el) el.textContent = count;
}

/* --- Render home featured products --- */
function renderFeatured(selector="#featured", limit=3){
  const root = document.querySelector(selector);
  if(!root) return;
  root.innerHTML = "";
  PRODUCTS.slice(0,limit).forEach(p=>{
    const div = document.createElement("div"); div.className="card";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.title}"/>
      <h3>${p.title}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <a class="btn" href="product.html?id=${p.id}">Shop Now</a>
    `;
    root.appendChild(div);
  });
}

/* --- Render shop grid with filters --- */
function renderProductsGrid(selector="#products", items=PRODUCTS){
  const root = document.querySelector(selector);
  if(!root) return;
  root.innerHTML = "";
  items.forEach(p=>{
    const div = document.createElement("div"); div.className="card";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.title}"/>
      <h3>${p.title}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div style="display:flex;gap:8px">
        <a class="btn" href="product.html?id=${p.id}">View</a>
        <button class="btn add" onclick="addToCart(${p.id},1)">Add</button>
      </div>
    `;
    root.appendChild(div);
  });
}

/* --- Filter and sort UI --- */
function applyFilters(){
  const cat = document.getElementById("filter-category").value;
  const sort = document.getElementById("sort-by").value;
  let results = PRODUCTS.slice();
  if(cat!=="All") results = results.filter(p=>p.category===cat);
  if(sort==="price-asc") results.sort((a,b)=>a.price-b.price);
  if(sort==="price-desc") results.sort((a,b)=>b.price-a.price);
  renderProductsGrid("#products", results);
}

/* --- Product page rendering --- */
function renderProductPage(){
  const q = new URLSearchParams(location.search);
  const id = Number(q.get("id") || 1);
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ document.body.innerHTML="<div class='container'><h2>Product not found</h2></div>"; return; }
  const gallery = document.querySelector(".gallery"); gallery.innerHTML=`<img src="${p.images[0]}" alt="${p.title}"/>`;
  const info = document.querySelector(".product-info");
  info.innerHTML = `
    <h2>${p.title}</h2>
    <div class="price">$${p.price.toFixed(2)}</div>
    <div>Rating: ${p.rating} ★</div>
    <p>${p.desc}</p>
    <div class="qty"><button onclick="changeQty(-1)">-</button><input id="qty" value="1" style="width:46px;text-align:center;border-radius:8px;padding:6px;border:1px solid #eee"/><button onclick="changeQty(1)">+</button></div>
    <button class="add-cart" onclick="addToCart(${p.id}, Number(document.getElementById('qty').value) || 1)">Add to Cart</button>
  `;
}
function changeQty(delta){ const el=document.getElementById("qty"); let v=Number(el.value)||1; v+=delta; if(v<1) v=1; el.value=v; }

/* --- Cart page rendering --- */
function renderCartPage(){
  const cart = getCart();
  const list = document.querySelector("#cart-list");
  const totalEl = document.querySelector("#cart-total");
  if(!list) return;
  list.innerHTML = "";
  let total=0;
  cart.forEach(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const row = document.createElement("div"); row.className="cart-item";
    row.innerHTML = `
      <img src="${p.images[0]}" style="width:84px;height:84px;border-radius:8px;object-fit:cover"/>
      <div style="flex:1">
        <div style="font-weight:700">${p.title}</div>
        <div>$${p.price.toFixed(2)}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="number" min="1" value="${ci.qty}" style="width:64px;padding:6px;border-radius:8px;border:1px solid #eee" onchange="updateQty(${ci.id}, Number(this.value))"/>
        <button onclick="removeFromCart(${ci.id})" style="background:transparent;border:none;cursor:pointer;color:#d14">Remove</button>
      </div>
    `;
    list.appendChild(row);
    total += p.price * ci.qty;
  });
  totalEl.textContent = "$" + total.toFixed(2);
}

/* --- Checkout: prefill from cart --- */
function renderCheckoutSummary(){
  const cart = getCart();
  const summary = document.querySelector("#checkout-summary");
  if(!summary) return;
  summary.innerHTML = "";
  let total=0;
  cart.forEach(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const el = document.createElement("div"); el.style.marginBottom="8px";
    el.innerHTML = `${ci.qty} x ${p.title} — $${(p.price*ci.qty).toFixed(2)}`;
    summary.appendChild(el);
    total += p.price * ci.qty;
  });
  const t = document.createElement("div"); t.style.fontWeight="700"; t.style.marginTop="8px"; t.textContent = "Total: $" + total.toFixed(2);
  summary.appendChild(t);
}

/* --- Place order (dummy) --- */
function placeOrder(e){
  e.preventDefault();
  // pretend to place order
  const name = document.getElementById("fullName").value || "Customer";
  alert("Thank you, "+name+". Your order has been placed (demo).");
  localStorage.removeItem("cart");
  updateCartCount();
  location.href = "index.html";
}

/* --- Init helper --- */
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();
  // home featured
  renderFeatured && renderFeatured("#featured",3);
  // shop specific
  renderProductsGrid && renderProductsGrid("#products",PRODUCTS);
  // event bindings
  const filterCat = document.getElementById("filter-category");
  if(filterCat){ filterCat.addEventListener("change", applyFilters); document.getElementById("sort-by").addEventListener("change", applyFilters); }
  // product page init
  if(document.querySelector(".product-info")) renderProductPage();
  // cart page init
  if(document.querySelector("#cart-list")) renderCartPage();
  // checkout init
  if(document.querySelector("#checkout-summary")) renderCheckoutSummary();
});
