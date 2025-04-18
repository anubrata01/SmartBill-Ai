# camera.py
from ultralytics import YOLO
import requests
import numpy as np
import cv2
import json

# Load model globally (faster)
model = YOLO("D:/final year project/my_model/my_model.pt")
ip_camera_url = "http://192.168.0.104/cam-hi.jpg"

def get_detected_product():
    try:
        response = requests.get(ip_camera_url, timeout=5)
        response.raise_for_status()

        img_array = np.array(bytearray(response.content), dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if frame is None:
            return None, []

        results = model.predict(frame)
        detected_products = []

        highest_confidence = 0.7
        best_product = None

        for result in results:
            boxes = result.boxes.xyxy.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()
            confidences = result.boxes.conf.cpu().numpy()

            for box, class_id, conf in zip(boxes, class_ids, confidences):
                product_name = model.names[int(class_id)]
                detected_products.append({
                    "name": product_name,
                    "confidence": round(float(conf), 2),
                })
                if conf > highest_confidence:
                    highest_confidence = conf
                    best_product = product_name

        return best_product, detected_products
    except Exception as e:
        print("Camera Error:", e)
        return None, []
