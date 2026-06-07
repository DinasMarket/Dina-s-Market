function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product, price) {
  const cart = getCart();
  const safePrice = Number(price);

  if (!product || isNaN(safePrice)) return;

  const existingItem = cart.find(item => item.product === product);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product: product,
      price: safePrice,
      quantity: 1
    });
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(index) {
  const cart = getCart();

  if (index < 0 || index >= cart.length) return;

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function renderCart() {
  const cart = getCart();

  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartItems = document.getElementById("cart-items");
  const orderText = document.getElementById("order-text");
  const orderTotalHidden = document.getElementById("order-total-hidden");

  if (!cartCount || !cartTotal || !cartItems) return;

  cartItems.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;
  let orderLines = [];

  cart.forEach((item, index) => {
    const itemPrice = Number(item.price);
    const itemQty = Number(item.quantity);
    const itemTotal = itemPrice * itemQty;

    totalItems += itemQty;
    totalPrice += itemTotal;

    orderLines.push(`${item.product} x${itemQty} - ${itemTotal.toFixed(2)}€`);

    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.product}</strong><br>
        ${itemQty} x ${itemPrice.toFixed(2)}€ = ${itemTotal.toFixed(2)}€
      </div>
      <button type="button" class="remove-btn" onclick="removeFromCart(${index})">−</button>
    `;

    cartItems.appendChild(row);
  });

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice.toFixed(2) + "€";

  if (orderText) {
    orderText.value = orderLines.join("\n");
  }

  if (orderTotalHidden) {
    orderTotalHidden.value = totalPrice.toFixed(2) + "€";
  }
}

function updateWeightPrice(select) {
  const row = select.closest(".product-row");
  if (!row) return;

  const priceLabel = row.querySelector(".price-label");
  if (!priceLabel) return;

  const pricePerKilo = Number(row.dataset.price);
  const kilos = Number(select.value);

  if (isNaN(pricePerKilo) || isNaN(kilos)) return;

  const finalPrice = pricePerKilo * kilos;
  priceLabel.textContent = finalPrice.toFixed(2) + "€";
}

function addWeightedProduct(button) {
  const row = button.closest(".product-row");
  if (!row) return;

  const nameEl = row.querySelector(".product-name");
  const select = row.querySelector(".weight-select");

  if (!nameEl || !select) return;

  const name = nameEl.textContent.trim();
  const pricePerKilo = Number(row.dataset.price);
  const kilos = Number(select.value);

  if (isNaN(pricePerKilo) || isNaN(kilos)) return;

  const finalPrice = pricePerKilo * kilos;
  addToCart(`${name} (${kilos} κιλά)`, finalPrice);
}

document.addEventListener("DOMContentLoaded", function () {
  renderCart();

  const orderForm = document.getElementById("order-form");

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      const cart = getCart();

      if (cart.length === 0) {
        e.preventDefault();
        alert("Το καλάθι είναι άδειο.");
        return;
      }

      renderCart();
    });
  }
});