from flask import Blueprint, request, jsonify
from database.mongo_connection import db
from bson import ObjectId
from datetime import datetime

create_vote_bp = Blueprint("create_vote", __name__)

@create_vote_bp.route("/api/create_vote", methods=["POST"])
def create_vote():
    try:
        data = request.json

        title = data.get("title", "").strip()
        description = data.get("description", "").strip()
        expiry = data.get("expiry", "").strip()
        vote_type = data.get("type", "").strip()
        options = data.get("options", [])

        # Validations
        if not title or not expiry or len(options) < 2:
            return jsonify({"error": "Missing required fields"}), 400

        # Convert expiry string to datetime
        try:
            expiry_dt = datetime.fromisoformat(expiry)
        except ValueError:
            return jsonify({"error": "Invalid datetime format"}), 400

        # Structure vote object
        vote = {
            "title": title,
            "description": description,
            "expiry": expiry_dt,
            "type": vote_type,
            "options": [{"text": opt, "count": 0} for opt in options],
            "created_at": datetime.utcnow(),
        }

        result = db.votes.insert_one(vote)
        return jsonify({"message": "Vote created successfully", "vote_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
