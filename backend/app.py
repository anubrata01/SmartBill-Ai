from flask import Flask, jsonify, render_template, request,render_template_string,send_from_directory,send_file
from models.predict import get_detected_product
from database.database import fetch_product_details
from payments.payments import create_order, verify_payment
import os

app = Flask(__name__,template_folder='../frontend/templates',
            static_folder='../frontend/static')
@app.route('/')
def index():
    return render_template("home.html")
@app.route('/login')
def login():
    return render_template("login.html")
@app.route('/signup')
def signUp():
    return render_template("sign_up.html")
@app.route('/otp')
def otp():
    return render_template("otp.html")
@app.route('/cart')
def cart():
    return render_template("cart.html")
@app.route('/test')
def test():
    return render_template("test.html")
@app.route('/predict')
def predict():
    product_name, detected_products = get_detected_product()
    if not product_name:
        return jsonify({"error": "No product detected"}), 404

    product_info = fetch_product_details(product_name)
    if not product_info:
        return jsonify({"error": "Product not found in database"}), 404

    # Add confidence info
    product_info["conf"] = max([p["confidence"] for p in detected_products if p["name"] == product_name], default=0)
    return jsonify(product_info)

@app.route("/create_order", methods=["POST"])
def create_order_api():
    data = request.get_json() or {}
    order_amount = data.get("amount", 50000)
    return jsonify(create_order(order_amount))

@app.route("/verify_payment", methods=["POST"])
def verify_payment_api():
    data = request.get_json()
    try:
        verify_payment(data)
        return jsonify({"status": "Payment Verified"}), 200
    except:
        return jsonify({"status": "Payment Verification Failed"}), 400
@app.route('/checkout')
def checkout():
    return render_template('checkout.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)