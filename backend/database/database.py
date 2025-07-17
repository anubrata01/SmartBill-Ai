# database.py
import mysql.connector
from mysql.connector import Error
import config

# def fetch_product_details(product_name):
#     try:
#         db = mysql.connector.connect(
#             host=config.host,
#             user=config.user,
#             password=config.password,
#             database=config.database
#         )
#         cursor = db.cursor()
#         query = "SELECT name, img_url, price, weight FROM Info WHERE name = %s"
#         cursor.execute(query, (product_name,))
#         row = cursor.fetchone()

#         if row:
#             name, url, price, weight = row
#             return {"product": name, "price": price, "image": url, "weight":weight}
#         else:
#             return None
#     finally:
#         cursor.close()
#         db.close()

def fetch_product_details(product_name):
    try:
        db = mysql.connector.connect(
            host=config.host,
            user=config.user,
            password=config.password,
            database=config.database
        )
        cursor = db.cursor()
        query = "SELECT name, variant, img_url, price, weight FROM Info WHERE name = %s"
        cursor.execute(query, (product_name,))
        rows = cursor.fetchall()

        if rows:
            variants = []
            for row in rows:
                name, variant, url, price, weight = row
                variants.append({
                    "product": name,
                    "variant": variant,
                    "price": price,
                    "image": url,
                    "weight": weight
                })
            return variants
        else:
            return None
    finally:
        cursor.close()
        db.close()


def fetch_user(user_phone_number):
    try:
        db = mysql.connector.connect(
            host=config.host,
            user=config.user,
            password=config.password,
            database=config.database
        )
        cursor = db.cursor()
        query = "SELECT UserID,FullName FROM users WHERE PhoneNumber = %s"
        cursor.execute(query, (user_phone_number,))
        row = cursor.fetchone()

        if row:
            UserID, FullName = row
            first_name = FullName.split(" ")[0]
            return {"UserID": UserID, "FullName":first_name}
        else:
            return None
    finally:
        cursor.close()
        db.close()
def create_user(name, user_phone_number):
    try:
        # Connect to the database
        db = mysql.connector.connect(
            host=config.host,
            user=config.user,
            password=config.password,
            database=config.database
        )
        
        cursor = db.cursor()
        
        # Correcting the typo in the column name
        query = "INSERT INTO Users (FullName, PhoneNumber) VALUES (%s, %s)"
        
        # Execute the query
        cursor.execute(query, (name, user_phone_number))
        
        # Commit the transaction to the database
        db.commit()

        # Retrieve the last inserted UserID using LAST_INSERT_ID()
        cursor.execute("SELECT LAST_INSERT_ID()")
        user_id = cursor.fetchone()[0]  # Get the inserted UserID
        
        # Return the inserted user's details
        return {"UserID": user_id, "FullName": name}
    
    except Error as e:
        print(f"Error: {e}")
        return None
    
    finally:
        # Ensure the cursor and connection are closed
        if cursor:
            cursor.close()
        if db:
            db.close()
# database.py  (append at bottom)

def fetch_all_coupons():
    try:
        db = mysql.connector.connect(
            host=config.host,
            user=config.user,
            password=config.password,
            database=config.database
        )
        cursor = db.cursor(dictionary=True)     # returns dict rows
        cursor.execute("SELECT * FROM coupons")
        return cursor.fetchall()                # list[dict]
    finally:
        cursor.close()
        db.close()
