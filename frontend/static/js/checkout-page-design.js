let cart = JSON.parse(localStorage.getItem("cart")) || {};
let total_price = 0;

// Update cart on initial load
updateCart();

// Expose to global for access in other files
window.cart = cart;
window.total_price = total_price;

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
    let cart_item = document.querySelector('.cart');
    cart_item.innerHTML = `<h2>Your cart</h2>`;
    total_price = 0;
    let no_of_product = 0;

    for (let product in cart) {
        let li = document.createElement('div');
        li.className = `cart-item`;
        li.innerHTML = `
            <img src="${cart[product]["image"]}" alt="${product}" width="50">
            <div class="item-details">
                <div><strong>${product} x ${cart[product].quantity}</strong></div>
            </div>
            <div class="price-box">
                <div class="new">₹${cart[product].price.toFixed(2)}</div>
                <div class="old">$5.99</div>
            </div>
            <img src="../static/resources/trash bin 1 black.svg" alt="remove item" class="remove-item" onclick="removeItem('${product}')">
        `;
        cart_item.appendChild(li);
        no_of_product += cart[product]["quantity"];
        total_price += cart[product]["price"];
    }

    // Add payment button
    cart_item.innerHTML += `<div class="payment" id="payment">Pay</div>`;

    // 🔑 Attach click handler after it's created
    document.querySelector('#payment').onclick = window.handlePayment;

    // Update global variable
    window.total_price = total_price;
}
