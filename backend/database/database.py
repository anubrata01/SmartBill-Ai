# database.py
import mysql.connector
from mysql.connector import Error
import config

def fetch_product_details(product_name):
    try:
        db = mysql.connector.connect(
            host=config.host,
            user=config.user,
            password=config.password,
            database=config.database
        )
        cursor = db.cursor()
        query = "SELECT name, img_url, price FROM Info WHERE name = %s"
        cursor.execute(query, (product_name,))
        row = cursor.fetchone()

        if row:
            name, url, price = row
            return {"product": name, "price": price, "image": url}
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
            return {"UserID": UserID, "FullName":FullName}
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
