let cart = {};
let lastDetectedTime = {};
let isWaitingForWeight = false;
const detectionDelay = 10000;
const maxWeightRetries = 5;

async function startPredictionLoop() {
    while (true) {
        if (!isWaitingForWeight) {
            await getPrediction();
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Prevent CPU locking
    }
}

async function getPrediction() {
    try {
        const res = await fetch('http://192.168.4.2:5000/predict');
        const data = await res.json();

        console.log("Prediction:", data);
        if (!data.product) return;

        const { product, image, price, weight } = data;
        const name = product;
        const currentTime = Date.now();

        if (!lastDetectedTime[name] || (currentTime - lastDetectedTime[name] > detectionDelay)) {
            isWaitingForWeight = true;
            waitForWeight(name, parseFloat(price), image, parseFloat(weight), currentTime, 0);
        }
    } catch (error) {
        console.error("Prediction error:", error);
    }
}

function waitForWeight(name, price, image, expectedWeight, timestamp, retryCount) {
    if (retryCount > maxWeightRetries) {
        console.warn(`Max retries reached for ${name}. Cancelling.`);
        isWaitingForWeight = false;
        return;
    }

    fetch('http://192.168.4.2:5000/weight')
        .then(res => res.json())
        .then(data => {
            const actual = parseFloat(data.weight);
            console.log(`⚖️ Weight check for ${name}: ${actual}g`);

            if (Math.abs(expectedWeight - actual) <= 10) {
                if (cart[name]) {
                    cart[name].quantity++;
                    cart[name].price += price;
                } else {
                    cart[name] = { quantity: 1, price, image };
                }
                lastDetectedTime[name] = timestamp;
                updateCart();
                isWaitingForWeight = false;
            } else {
                setTimeout(() => {
                    waitForWeight(name, price, image, expectedWeight, timestamp, retryCount + 1);
                }, 1000);
            }
        })
        .catch(err => {
            console.error("Weight fetch error:", err);
            isWaitingForWeight = false; // Optionally retry here
        });
}

function updateCart() {
    const cartDiv = document.querySelector('.cart');
    cartDiv.innerHTML = `<h2>Your cart</h2>`;
    let total = 0, count = 0;

    for (let name in cart) {
        const { quantity, price, image } = cart[name];
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${image}" alt="${name}" width="50">
            <div class="item-details">
                <div><strong>${name} (x${quantity})</strong></div>
            </div>
            <div class="price-box">
                <div class="new">₹${price.toFixed(2)}</div>
            </div>
            <img src="../static/resources/trash bin 1 black.svg" alt="remove item" class="remove-item" onclick="removeItem('${name}')">
        `;
        cartDiv.appendChild(item);
        total += price;
        count += quantity;
    }

    document.querySelector('.old-amount .amount').innerHTML = `₹${total.toFixed(2)}`;
    document.getElementById("cartCount").innerText = count;
}

function removeItem(name) {
    if (!cart[name]) return;

    const item = cart[name];
    if (item.quantity > 1) {
        const unitPrice = item.price / item.quantity;
        item.quantity--;
        item.price -= unitPrice;
    } else {
        delete cart[name];
        delete lastDetectedTime[name];
    }

    updateCart();
}

// Start the loop
startPredictionLoop();
