# payments.py
import razorpay
import config

client = razorpay.Client(auth=(config.API_KEY, config.API_SECRET))

def create_order(amount):
    return client.order.create({
        "amount": amount,
        "currency": "INR",
        "receipt": "order_rcptid_11",
        "payment_capture": 1
    })

def verify_payment(data):
    params = {
        "razorpay_order_id": data["order_id"],
        "razorpay_payment_id": data["payment_id"],
        "razorpay_signature": data["signature"]
    }
    client.utility.verify_payment_signature(params)
