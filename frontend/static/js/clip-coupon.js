let clippedCoupons = {};  // Stores coupon discounts per product title

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", function (e) {
    if (e.target.classList.contains("clipCoupon")) {
      const card = e.target.closest(".coupon-card");
      const productName = card.querySelector(".product-name").innerText.trim();
      const discountText = card.querySelector(".discount").innerText.trim();

      const discountValue = parseFloat(discountText.replace(/[^\d.]/g, ''));
      
      if (!clippedCoupons[productName]) {
        clippedCoupons[productName] = discountValue;
        e.target.innerText = "✅ Coupon clipped";

        updateCart(); // Trigger cart recalculation with coupon applied
      }
    }
  });
});

function updateCart() {
  const cartDiv = document.querySelector('.cart');
  cartDiv.innerHTML = `<h2>Your cart</h2>`;
  let total = 0, count = 0, savings = 0;

  for (let name in cart) {
    const { quantity, price, image } = cart[name];
    const item = document.createElement('div');
    const baseName = name.split(" - ")[0]; // Extract product name without variant
    let discountedPrice = price;

    // Apply coupon if available
    if (clippedCoupons[baseName]) {
      const discount = clippedCoupons[baseName] * quantity;
      discountedPrice -= discount;
      savings += discount;
      total -= discount;
    }

    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${image}" alt="${name}" width="50">
      <div class="item-details">
          <div><strong>${name} (x${quantity})</strong></div>
          ${clippedCoupons[baseName] ? `<div style="font-size: 0.8rem; color: green;">✓ ₹${clippedCoupons[baseName].toFixed(2)} coupon clipped</div>` : ""}
      </div>
      <div class="price-box">
          <div class="new">₹${discountedPrice.toFixed(2)}</div>
      </div>
      <img src="../static/resources/trash bin 1 black.svg" alt="remove item" class="remove-item" onclick="removeItem('${name}')">
    `;

    cartDiv.appendChild(item);
    total += price;
    count += quantity;
  }

  // Subtotal (before coupon)
  document.querySelector('.old-amount .amount').innerHTML = `₹${total.toFixed(2)}`;

  // Savings
  document.querySelector('.new-amount .amount').innerHTML = `₹${savings.toFixed(2)}`;

  // Cart count
  document.getElementById("cartCount").innerText = count;
}
