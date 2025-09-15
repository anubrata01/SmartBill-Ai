function check_out() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log(isLoggedIn);
    if (!isLoggedIn) {
        alert("⚠ Please login or sign up to continue to checkout.");
        openLogin();  // call your modal opening function
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = `${API_BASE_URL}/checkout`;
}


window.handlePayment = function (e) {
    e.preventDefault();

    const btn = document.querySelector(".continue-btn");
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Processing...";
    }

    fetch(`${API_BASE_URL}/create_order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Math.round(total_price * 100) })  // Razorpay takes amount in paise
    })
    .then(response => response.json())
    .then(order => {
        if (order.error) {
            console.error("Order Error:", order.error);
            alert("Failed to create order.");
            if (btn) {
                btn.disabled = false;
                btn.textContent = "CONTINUE";
            }
            return;
        }

        const options = {
            key: "rzp_test_JeAEyRAbOnEKKs",
            amount: order.amount,
            currency: order.currency,
            name: "Acme Corp",
            description: "Test Transaction",
            order_id: order.id,
            prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9000090000"
            },
            theme: { color: "#fb641b" },
            handler: function (response) {
                // Send verification to backend
                fetch(`${API_BASE_URL}/verify_payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id: order.id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature
                    })
                })
                .then(res => res.json())
                .then(result => {
                    alert(result.status || "Payment Successful!");
                    localStorage.removeItem("cart");
                    window.location.href = "/thank_you";
                })
                .catch(err => {
                    console.error("Verification Error:", err);
                    alert("Payment verification failed.");
                });
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        if (btn) {
            btn.disabled = false;
            btn.textContent = "CONTINUE";
        }
    })
    .catch(err => {
        console.error("Order Creation Error:", err);
        alert("Failed to initiate payment.");
        if (btn) {
            btn.disabled = false;
            btn.textContent = "CONTINUE";
        }
    });
};

