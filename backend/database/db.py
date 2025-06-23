from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "online_vote_system"

client = None
db = None

def connect_db():
    global client, db
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        print("Connected to MongoDB successfully!")
        return db
    except ConnectionFailure as e:
        print(f"Database connection failed: {e}")
        raise

def get_db():
    if db is None:
        connect_db()
    return db