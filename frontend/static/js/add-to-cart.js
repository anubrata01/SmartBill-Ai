let cart = {};
window.cart = cart;
let lastDetectedTime = {};
let isWaitingForWeight = false;
const detectionDelay = 2000;
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
        const res = await fetch(`${API_BASE_URL}/predict`);
        const variants = await res.json();

        if (!Array.isArray(variants) || variants.length === 0 || !variants[0].product) return;

        const baseName = variants[0].product;
        const currentTime = Date.now();
        // || (currentTime - lastDetectedTime[baseName] > detectionDelay)
        if (!lastDetectedTime[baseName] ) {
            isWaitingForWeight = true;

            fetch(`${API_BASE_URL}/weight`)
                .then(res => res.json())
                .then(data => {
                    const actualWeight = parseFloat(data.weight);
                    console.log(`⚖️ Actual weight: ${actualWeight}g`);

                    const matchedVariant = variants.find(v => Math.abs(parseFloat(v.weight) - actualWeight) <= 10);

                    if (matchedVariant) {
                        const { product, price, image, weight, variant } = matchedVariant;
                        const uniqueName = `${product} - ${variant}`; // 👈 Make cart key unique
                        waitForWeight(uniqueName, parseFloat(price), image, parseFloat(weight), currentTime, 0);
                    } else {
                        console.warn("❌ No matching variant for actual weight.");
                        isWaitingForWeight = false;
                    }
                })
                .catch(err => {
                    console.error("Weight fetch error:", err);
                    isWaitingForWeight = false;
                });
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

    fetch(`${API_BASE_URL}/weight`)
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
                }, 3000);
            }
        })
        .catch(err => {
            console.error("Weight fetch error:", err);
            isWaitingForWeight = false;
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

startPredictionLoop();
