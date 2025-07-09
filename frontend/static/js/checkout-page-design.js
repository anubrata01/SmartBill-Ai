let cart = JSON.parse(localStorage.getItem("cart")) || {};
let total_price = 0;

// Expose to global for Razorpay
window.cart = cart;
window.total_price = total_price;

// Run on load
updateCart();

function removeItem(product) {
    if (cart[product]["quantity"] > 1) {
        let pricePerUnit = cart[product]["price"] / cart[product]["quantity"];
        cart[product]["quantity"]--;
        cart[product]["price"] -= pricePerUnit;
    } else {
        delete cart[product];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartContainer = document.querySelector('.order-summary');
    const priceBox = document.querySelector('.price-details');

    // Clear previous content
    cartContainer.innerHTML = `<h2>ORDER SUMMARY</h2>`;
    total_price = 0;
    let itemCount = 0;

    for (let product in cart) {
        const item = document.createElement('div');
        item.className = 'cart-item';

        item.innerHTML = `
            <img src="${cart[product].image}" alt="${product}">
            <div class="item-details">
                <div><strong>${product} x ${cart[product].quantity}</strong></div>
                <div style="font-size: 0.8rem; color: green;">✓ ${cart[product].coupon || ''}</div>
            </div>
            <div class="price-box">
                <div class="new">₹${cart[product].price.toFixed(2)}</div>
                <div class="old">₹${cart[product].original || ''}</div>
            </div>
            <img src="../static/resources/trash bin 1 black.svg" alt="remove item" class="remove-item" onclick="removeItem('${product}')">
        `;

        cartContainer.appendChild(item);
        total_price += cart[product].price;
        itemCount += cart[product].quantity;
    }

    // Update right-side price panel
    if (priceBox) {
        priceBox.innerHTML = `
            <h3>PRICE DETAILS</h3>
            <div class="price-line">
                <span>Price (${itemCount} items)</span>
                <span>₹${total_price.toFixed(2)}</span>
            </div>
            <div class="price-line">
                <span>Shipping Fee</span>
                <span>Free</span>
            </div>
            <div class="price-line total">
                <span>Total Payable</span>
                <span>₹${total_price.toFixed(2)}</span>
            </div>
            <div class="savings">
                Your Total Savings on this order: ₹${calculateSavings()}
            </div>
            <button type="submit" class="continue-btn">CONTINUE</button>
        `;
    }

    // Save updated total globally
    window.total_price = total_price;
}

const payBtn = document.querySelector('.continue-btn');
if (payBtn) {
    payBtn.addEventListener("click", window.handlePayment);
}

// Optional: Savings logic
function calculateSavings() {
    let savings = 0;
    for (let product in cart) {
        if (cart[product].original) {
            savings += (cart[product].original - cart[product].price);
        }
    }
    return savings.toFixed(2);
}
