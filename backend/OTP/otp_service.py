# otp_service.py
import random
from twilio.rest import Client
import config

# In-memory storage for OTP (in a real application, use a database or cache)
otp_storage = {}

# Initialize Twilio client
client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

def generate_otp():
    """Generate a random 6-digit OTP."""
    return random.randint(100000, 999999)

def store_otp(phone_number, otp):
    """Store OTP for the user."""
    otp_storage[phone_number] = otp

def send_otp(phone_number, otp):
    """Send OTP via Twilio."""
    try:
        message = client.messages.create(
            body=f"Your OTP code is: {otp}",
            from_=config.TWILIO_PHONE_NUMBER,
            to="+91"+phone_number
        )
        print("done")
        return {"message": "OTP sent successfully"}
    except Exception as e:
        return {"error": str(e)}

def verify_otp(phone_number, otp):
    """Verify OTP for the user."""
    stored_otp = otp_storage.get(phone_number)
    if stored_otp is None:
        return False
    return str(stored_otp) == str(otp)
