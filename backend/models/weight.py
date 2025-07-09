# weight.py
import requests
import config

weight_sensor_url = config.WeightUrl

def get_weight():
    try:
        response = requests.get(weight_sensor_url, timeout=5)
        response.raise_for_status()

        # Assume the weight is returned in raw format, like: "Weight: 123.45"
        text = response.text.strip()

        # Try to extract weight value
        weight_value = None
        if ":" in text:
            weight_value = float(text.split(":")[-1].strip())
        else:
            weight_value = float(text)  # if only number is returned

        return round(weight_value, 2)
    except Exception as e:
        print("Weight Sensor Error:", e)
        return None
