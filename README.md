# SmartBill-Ai 🚀

SmartBill-Ai is an AI-powered smart billing system that uses computer vision (YOLOv8), a Python Flask backend, and Arduino-based camera streaming to recognize items in real-time and auto-generate bills — perfect for retail automation, especially in small to medium stores.

---

## 🔍 Overview

The project combines:

- **AI + Computer Vision** to identify products using a webcam or embedded camera.
- **Backend API** (Flask) to manage orders, users, prediction calls, and OTP-based security.
- **Frontend UI** built using HTML/CSS for user interaction.
- **Arduino Integration** for real-time camera streaming.
- **Payment system placeholder** for transaction handling.
- **Order management** and inventory tracking via SQLite.

---

## 🧠 AI Logic – `predict.py`

The AI engine uses a YOLOv8 model to perform object detection:

- Loads a pretrained model using the `ultralytics` package.
- Captures image frames (base64 or from camera).
- Runs object detection and filters predictions based on confidence threshold.
- Returns product names and quantities for billing.

Example detection output:
```json
{
  "products": ["Pepsi", "Lays", "Oreo"],
  "total_items": 3,
  "detection_confidence": "0.85"
}
```

---

## 🧾 Backend Architecture – Flask API

### `app.py`
Initializes the Flask app and sets up:

- CORS support
- Route registration (`/api/`)
- Environment-based configuration

### API Endpoints – `routes/api.py`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | `POST` | Runs YOLO on input image and returns predicted items |
| `/api/order` | `POST` | Places a new order (JSON body: items, qty, total) |
| `/api/get_orders` | `GET` | Returns all stored orders |
| `/api/send_otp` | `POST` | Sends OTP to user email |
| `/api/verify_otp` | `POST` | Verifies OTP and logs in the user |

---

## 📦 Order Management – `order_controller.py`

Handles CRUD operations for customer orders:

- Save new order with `name`, `price`, `items`, `date`.
- Fetch and list previous orders.
- Interface with SQLite for persistent storage.

---

## ⚙️ Arduino Camera Integration

The `cameraStreaming.ino` file connects a camera module (e.g. ESP32-CAM) and streams video data via serial or WiFi for detection by the AI module.

---

## 🌐 Frontend UI

Located in `/frontend/` with static CSS files:
- Login and signup screens
- Cart and checkout interfaces
- OTP UI for authentication

You can serve them using a local server or integrate into Flask with Jinja templates.

---

## 📦 How to Run

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 2. Frontend

Open the HTML files in any browser or use:

```bash
python -m http.server
```

### 3. AI Training

```bash
# Train model (optional)
Open Train_YOLO_Models.ipynb in Jupyter
```

---

## 🧪 Example API Usage

### POST `/api/predict`

```bash
curl -X POST http://localhost:5000/api/predict   -H "Content-Type: application/json"   -d '{"image": "base64_encoded_image_string"}'
```

### Response:
```json
{
  "products": ["Milk", "Eggs", "Bread"],
  "quantities": [1, 1, 2],
  "success": true
}
```

---

## 🧰 Technologies Used

- Python 3.10
- Flask
- SQLite
- YOLOv8 (`ultralytics`)
- OpenCV
- Arduino (ESP32-CAM)
- HTML/CSS

---

## 📌 Future Enhancements

- Admin dashboard with real-time sales metrics
- Product database with barcode scanning
- Thermal printer integration
- Improved AI accuracy with custom dataset
- Multi-user login and roles (cashier/admin)

---

## 📜 License

MIT License. See `LICENSE` for details.

---

## 📬 Contact

Developed by **Anubrata Dey**  
📧 Email: [you@example.com]  
🌐 GitHub: [anubrata01](https://github.com/anubrata01)