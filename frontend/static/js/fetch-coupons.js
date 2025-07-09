document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE_URL}/coupon`)
    .then(res => res.json())
    .then(coupons => {
      const container = document.querySelector(".coupon-card-wrapper"); // Keeping your structure

      coupons.forEach(coupon => {
        const card = document.createElement("div");
        card.classList.add("coupon-card");

        card.innerHTML = `
          <div class="exclusive-tag">${coupon.is_cart_exclusive ? "Cart exclusive" : ""}</div>
          <img src="${coupon.image_url}" class="product-img">
          <div class="aisle-tag">${coupon.aisle}</div>
          <div class="discount">${coupon.discount}</div>
          <div class="product-name">${coupon.title}</div>
          <div class="button">See eligible items</div>
          <div class="button clipCoupon" data-id="${coupon.id}">✂ Clip coupon</div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Failed to load coupons:", err));
});
