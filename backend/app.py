from flask import Flask, jsonify, render_template, request,render_template_string,send_from_directory,send_file
from models.predict import get_detected_product
from models.weight import get_weight
from database.database import fetch_product_details,fetch_all_coupons
from payments.payments import create_order, verify_payment
from database.database import fetch_user,create_user
from OTP.otp_service import generate_otp, store_otp, send_otp, verify_otp
import os

app = Flask(__name__,template_folder='../frontend/templates',
            static_folder='../frontend/static')

@app.route('/')
def index():
    return render_template("home.html")
@app.route('/check_user_existence', methods=['POST'])
def check_user_existence():
    phone_number = request.form.get('phone_number')
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    # Check if the user exists in the database
    exists = fetch_user(phone_number)    
    return jsonify({"exists": exists})

@app.route('/signup_user', methods=['POST'])
def signup_user():
    name = request.form.get('name')
    phone_number = request.form.get('phone_number')

    if not name or not phone_number:
        return jsonify({"error": "Name and phone number are required"}), 400

    # Check if the user already exists
    if fetch_user(phone_number):
        return jsonify({"message": f"Welcome {name}"}), 200

    # Create a new user in the database
    create_user(name, phone_number)

    return jsonify({"message": f"Welcome {name}"}), 200

@app.route('/send_otp', methods=['POST'])
def send_otp_route():
    phone_number = request.form.get('phone_number')  # Get phone number from form
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    otp = generate_otp()  # Generate a random 6-digit OTP
    store_otp(phone_number, otp)  # Store OTP for the phone number
    
    # Send OTP via Twilio
    response = send_otp(phone_number, otp)
    if "message" in response:
        return jsonify(response), 200
    else:
        return jsonify(response), 500

@app.route('/verify_otp', methods=['POST'])
def verify_otp_route():
    phone_number = request.form.get('phone_number')
    otp = request.form.get('otp')
    
    if not phone_number or not otp:
        return jsonify({"error": "Phone number and OTP are required"}), 400
    
    if verify_otp(phone_number, otp):  # Verify the OTP
        return jsonify({"message": "OTP verified successfully"}), 200
    else:
        return jsonify({"error": "Invalid OTP"}), 400
    

@app.route('/cart')
def cart():
    return render_template("cart.html")

@app.route('/coupon')
def coupon():
    coupons = fetch_all_coupons()
    print(coupons)
    return jsonify(coupons), 200

@app.route('/thank_you')
def thank_you():
    return render_template('thank_you.html')

@app.route('/predict')
def predict():
    product_name, detected_products = get_detected_product()
    if not product_name:
        return jsonify({"error": "No product detected"}), 404

    product_variants = fetch_product_details(product_name)
    if not product_variants:
        return jsonify({"error": "Product not found in database"}), 404

    # Add confidence info to each variant (same for all if needed)
    confidence = max(
        [p["confidence"] for p in detected_products if p["name"] == product_name],
        default=0
    )

    for variant in product_variants:
        variant["conf"] = confidence

    return jsonify(product_variants)


# Get the weight
@app.route("/weight")
def weight():
    weight_value = get_weight()
    if weight_value is not None:
        return {"weight": weight_value}, 200
    else:
        return {"error": "Failed to fetch weight"}, 500


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