function check_out() {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/checkout";
}

window.handlePayment = function (e) {
    e.preventDefault();

    fetch('/create_order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ amount: total_price })
    })
    .then(response => response.json())
    .then(order => {
        if (order.error) {
            console.error("Order Error:", order.error);
            return alert("Failed to create order.");
        }

        var options = {
            "key": "rzp_test_JeAEyRAbOnEKKs",
            "amount": order.amount,
            "currency": order.currency,
            "name": "Acme Corp",
            "description": "Test Transaction",
            "order_id": order.id,
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
            "theme": { "color": "#3399cc" },
            "handler": function (response) {
                fetch('/verify_payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: order.id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature
                    })
                })
                .then(res => res.json())
                .then(result => alert(result.status))
                .catch(err => console.error("Verification Error:", err));
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    })
    .catch(err => console.error("Order Creation Error:", err));
};
