from flask import Flask, jsonify
import threading
import firebase_admin
from firebase_admin import credentials, firestore
from scraper import scrape_product


# Flask App
app = Flask(__name__)

from flask_cors import CORS
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# --- Update Logic ---
def update_all_products():
    products_ref = db.collection("products")
    docs = products_ref.stream()

    for doc in docs:
        product = doc.to_dict()
        product_id = doc.id
        url = product.get("link")

        if not url:
            continue

        scraped = scrape_product(url)
        if not scraped:
            print(f"Skipping {url}")
            continue

        new_price = scraped['price'] or product.get('price', 0)
        image_url = scraped['image'] or "/spinner.gif"

        # --- Get current priceHistory or initialize ---
        price_history = product.get("priceHistory", [])

        # Append new price entry with timestamp
        from datetime import datetime
        price_history.append({
            "price": new_price,
            "date": datetime.utcnow().strftime("%y-%m-%d")
        })

        # Update Firestore document
        products_ref.document(product_id).update({
            "price": new_price,
            "image": image_url,
            "priceHistory": price_history
        })

        print(f"✅ Updated {product.get('name')} | Price: {new_price} | Image: {image_url} | History length: {len(price_history)}")

    print("🎉 All products updated successfully!")



# --- Flask Route ---
@app.route("/update-products", methods=["POST"])
def update_products():
    try:
        # Run update in a background thread (non-blocking)
        thread = threading.Thread(target=update_all_products)
        thread.start()

        return jsonify({
            "status": "started",
            "message": "Product update started successfully!"
        }), 200

    except Exception as e:
        print("Error triggering update:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# --- Run Flask App ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
