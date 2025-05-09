let cart = {}; // Tracks product quantities
let lastDetectedTime = {}; // Tracks last detection timestamp

function getPrediction() {
    fetch('http://192.168.1.113:5000/predict')
        .then(response => response.json())
        .then(data => {
            console.log("Prediction:", data);

            if (data.product) {
                let detected_name = data.product;
                let image = data.image;
                let price = parseFloat(data.price); // Ensure price is a number
                
                let currentTime = Date.now();
                let detectionDelay = 10000; // 10 seconds threshold

                if (!lastDetectedTime[detected_name] || 
                    (currentTime - lastDetectedTime[detected_name]) > detectionDelay) {
                    
                    // If product exists, increase quantity and total price
                    if (cart[detected_name]) {
                        cart[detected_name]["quantity"]++;
                        cart[detected_name]["price"] += price;
                    } else {
                        // Add new product
                        cart[detected_name] = {
                            "quantity": 1,
                            "price": price,
                            "image": image
                        };
                    }

                    
                    updateCart();
                }
                lastDetectedTime[detected_name] = currentTime; // Solve duplicate detection issue
            }
        })
        .catch(error => console.error("Error fetching prediction:", error));
}

// Fetch new prediction every 5 seconds
setInterval(getPrediction, 5000);

function updateCart() {
    let cart_item = document.querySelector('.cart');
    cart_item.innerHTML = `<h2>Your cart</h2>
    <div class="add-item-btn">Add item with Code</div>`;
    let no_of_product=0
    let total_price = 0
    for (let product in cart) {
        let li = document.createElement('div');
        li.className = `cart-item`;
        li.innerHTML = `
            <img src="${cart[product]["image"]}" alt="${product}" width="50">
            <div class="item-details">
                <div><strong>${product} (x${cart[product]["quantity"]})</strong></div>
            </div>
            <div class="price-box">
                <div class="new">₹${cart[product]["price"].toFixed(2)}</div>
                <div class="old">$5.99</div>
            </div>
            
            <img src="../static/resources/trash bin 1 black.svg" alt="remove item" class="remove-item" onclick="removeItem('${product}')">
        `;
        cart_item.appendChild(li);
        no_of_product+=cart[product]["quantity"]
        total_price +=cart[product]["price"]
    }
    document.querySelector('.old-amount').querySelector('.amount').innerHTML=`₹${total_price}`;
    document.getElementById("cartCount").innerText = `${no_of_product}`;
}

function removeItem(product) {
    if (cart[product]["quantity"] > 1) {
        let pricePerUnit = cart[product]["price"] / cart[product]["quantity"];
        cart[product]["quantity"]--;
        cart[product]["price"] -= pricePerUnit;
    } else {
        delete cart[product];
        delete lastDetectedTime[product]; // Reset detection time when removed
    }
    updateCart();
}